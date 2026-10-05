"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react"

import type {
  Product,
  CartItem,
  Order,
  Address,
  UserProfile,
  OrderStatus,
} from "./types"

import { discountedPrice } from "./types"
import { SEED_PRODUCTS } from "@/seed"

const KEYS = {
  cart: "aurelia.cart",
  orders: "aurelia.orders",
  profile: "aurelia.profile",
  addresses: "aurelia.addresses",
}

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback

  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function save<T>(key: string, value: T) {
  if (typeof window === "undefined") return

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore
  }
}

type StoreContextValue = {
  ready: boolean
  products: Product[]
  cart: CartItem[]
  orders: Order[]
  profile: UserProfile
  addresses: Address[]

  addProduct: (p: Omit<Product, "id">) => void
  updateProduct: (p: Product) => void
  deleteProduct: (id: string) => void
  getProduct: (id: string) => Product | undefined

  addToCart: (productId: string, quantity?: number) => void
  setQuantity: (productId: string, quantity: number) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void

  cartCount: number
  cartTotal: number

  addOrder: (order: Order) => void
  updateOrderStatus: (id: string, status: OrderStatus) => void

  setProfile: (p: UserProfile) => void
  saveAddress: (a: Address) => void
  removeAddress: (index: number) => void
}

const StoreContext =
  createContext<StoreContextValue | null>(null)

export function StoreProvider({
  children,
}: {
  children: ReactNode
}) {
  const [ready, setReady] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [profile, setProfileState] =
    useState<UserProfile>(null)
  const [addresses, setAddresses] =
    useState<Address[]>([])

  /*
   * INITIAL LOAD
   *
   * Local data is loaded immediately.
   * Firebase products/orders load in the background,
   * so Checkout does not wait for slow Firebase APIs.
   */
  useEffect(() => {
    let mounted = true

    async function loadProducts() {
      try {
        const response = await fetch(
          "/api/admin/products",
          { cache: "no-store" },
        )

        if (response.ok) {
          const data = await response.json()

          if (
            Array.isArray(data.products) &&
            data.products.length > 0
          ) {
            if (mounted) {
              setProducts(data.products as Product[])
            }
          } else if (mounted) {
            setProducts(SEED_PRODUCTS)
          }
        } else if (mounted) {
          setProducts(SEED_PRODUCTS)
        }
      } catch {
        if (mounted) {
          setProducts(SEED_PRODUCTS)
        }
      }
    }

    async function loadOrders() {
      try {
        const response = await fetch(
          "/api/orders",
          { cache: "no-store" },
        )

        if (response.ok) {
          const data = await response.json()

          if (
            mounted &&
            Array.isArray(data.orders)
          ) {
            setOrders(data.orders as Order[])
          }
        }
      } catch {
        // Keep local order backup.
      }
    }

    async function loadData() {
      const savedCart = load<CartItem[]>(
        KEYS.cart,
        [],
      )

      const savedProfile = load<UserProfile>(
        KEYS.profile,
        null,
      )

      const savedAddresses = load<Address[]>(
        KEYS.addresses,
        [],
      )

      const savedOrders = load<Order[]>(
        KEYS.orders,
        [],
      )

      if (!mounted) return

      setCart(savedCart)
      setProfileState(savedProfile)
      setAddresses(savedAddresses)
      setOrders(savedOrders)

      /*
       * Ready immediately.
       * Checkout no longer waits for Firebase.
       */
      setReady(true)

      /*
       * Firebase loads continue in background.
       */
      void loadProducts()
      void loadOrders()
    }

    void loadData()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (ready) save(KEYS.cart, cart)
  }, [cart, ready])

  useEffect(() => {
    if (ready) save(KEYS.orders, orders)
  }, [orders, ready])

  useEffect(() => {
    if (ready) save(KEYS.profile, profile)
  }, [profile, ready])

  useEffect(() => {
    if (ready) save(KEYS.addresses, addresses)
  }, [addresses, ready])

  const getProduct = useCallback(
    (id: string) =>
      products.find((p) => p.id === id),
    [products],
  )

  const addProduct = useCallback(
    async (p: Omit<Product, "id">) => {
      const tempId =
        `p_${Date.now()}_${Math.random()
          .toString(36)
          .slice(2, 7)}`

      const newProduct = {
        ...p,
        id: tempId,
      }

      setProducts((prev) => [
        newProduct,
        ...prev,
      ])

      try {
        const response = await fetch(
          "/api/admin/products",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(p),
          },
        )

        if (!response.ok) {
          throw new Error("Failed to create product")
        }

        const saved = await response.json()

        setProducts((prev) =>
          prev.map((product) =>
            product.id === tempId
              ? { ...saved }
              : product,
          ),
        )
      } catch (error) {
        console.error("Add product error:", error)
      }
    },
    [],
  )

  const updateProduct = useCallback(
    async (p: Product) => {
      setProducts((prev) =>
        prev.map((x) =>
          x.id === p.id ? p : x,
        ),
      )

      try {
        const response = await fetch(
          "/api/admin/products",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(p),
          },
        )

        if (!response.ok) {
          throw new Error("Failed to update product")
        }
      } catch (error) {
        console.error("Update product error:", error)
      }
    },
    [],
  )

  const deleteProduct = useCallback(
    async (id: string) => {
      setProducts((prev) =>
        prev.filter((x) => x.id !== id),
      )

      try {
        const response = await fetch(
          "/api/admin/products",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
          },
        )

        if (!response.ok) {
          throw new Error("Failed to delete product")
        }
      } catch (error) {
        console.error("Delete product error:", error)
      }
    },
    [],
  )

  const addToCart = useCallback(
    (productId: string, quantity = 1) => {
      setCart((prev) => {
        const existing = prev.find(
          (c) => c.productId === productId,
        )

        if (existing) {
          return prev.map((c) =>
            c.productId === productId
              ? {
                  ...c,
                  quantity:
                    c.quantity + quantity,
                }
              : c,
          )
        }

        return [
          ...prev,
          {
            productId,
            quantity,
          },
        ]
      })
    },
    [],
  )

  const setQuantity = useCallback(
    (productId: string, quantity: number) => {
      setCart((prev) =>
        quantity <= 0
          ? prev.filter(
              (c) => c.productId !== productId,
            )
          : prev.map((c) =>
              c.productId === productId
                ? { ...c, quantity }
                : c,
            ),
      )
    },
    [],
  )

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart((prev) =>
        prev.filter(
          (c) => c.productId !== productId,
        ),
      )
    },
    [],
  )

  const clearCart = useCallback(
    () => setCart([]),
    [],
  )

  const addOrder = useCallback(
    async (order: Order) => {
      setOrders((prev) => {
        const exists = prev.some(
          (x) => x.id === order.id,
        )

        if (exists) {
          return prev.map((x) =>
            x.id === order.id ? order : x,
          )
        }

        return [order, ...prev]
      })

      try {
        const response = await fetch(
          "/api/orders",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(order),
          },
        )

        if (!response.ok) {
          const data = await response
            .json()
            .catch(() => null)

          console.error(
            "Firebase order save failed:",
            data,
          )
        }
      } catch (error) {
        console.error("Order save error:", error)
      }
    },
    [],
  )

  const updateOrderStatus = useCallback(
    async (
      id: string,
      status: OrderStatus,
    ) => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id
            ? {
                ...o,
                orderStatus: status,
              }
            : o,
        ),
      )

      try {
        const existing = orders.find(
          (o) => o.id === id,
        )

        if (!existing) return

        await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...existing,
            orderStatus: status,
          }),
        })
      } catch (error) {
        console.error(
          "Order status update error:",
          error,
        )
      }
    },
    [orders],
  )

  const setProfile = useCallback(
    (p: UserProfile) =>
      setProfileState(p),
    [],
  )

  const saveAddress = useCallback(
    (a: Address) => {
      setAddresses((prev) => {
        const exists = prev.findIndex(
          (x) =>
            x.address === a.address &&
            x.pincode === a.pincode,
        )

        if (exists >= 0) {
          const copy = [...prev]
          copy[exists] = a
          return copy
        }

        return [a, ...prev]
      })
    },
    [],
  )

  const removeAddress = useCallback(
    (index: number) => {
      setAddresses((prev) =>
        prev.filter((_, i) => i !== index),
      )
    },
    [],
  )

  const cartCount = useMemo(
    () =>
      cart.reduce(
        (sum, c) => sum + c.quantity,
        0,
      ),
    [cart],
  )

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, c) => {
      const product = products.find(
        (x) => x.id === c.productId,
      )

      if (!product) return sum

      return (
        sum +
        discountedPrice(product) *
          c.quantity
      )
    }, 0)
  }, [cart, products])

  const value: StoreContextValue = {
    ready,
    products,
    cart,
    orders,
    profile,
    addresses,

    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,

    addToCart,
    setQuantity,
    removeFromCart,
    clearCart,

    cartCount,
    cartTotal,

    addOrder,
    updateOrderStatus,

    setProfile,
    saveAddress,
    removeAddress,
  }

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)

  if (!ctx) {
    throw new Error(
      "useStore must be used within StoreProvider",
    )
  }

  return ctx
}
