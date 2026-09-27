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
import { SEED_PRODUCTS } from "./seed"

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

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [profile, setProfileState] = useState<UserProfile>(null)
  const [addresses, setAddresses] = useState<Address[]>([])

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("/api/admin/products", {
          cache: "no-store",
        })

        if (response.ok) {
          const data = await response.json()

          if (Array.isArray(data.products) && data.products.length > 0) {
            setProducts(data.products as Product[])
          } else {
            setProducts(SEED_PRODUCTS)
          }
        } else {
          setProducts(SEED_PRODUCTS)
        }
      } catch {
        setProducts(SEED_PRODUCTS)
      }
    }

    loadProducts()

    setCart(load<CartItem[]>(KEYS.cart, []))
    setOrders(load<Order[]>(KEYS.orders, []))
    setProfileState(load<UserProfile>(KEYS.profile, null))
    setAddresses(load<Address[]>(KEYS.addresses, []))
    setReady(true)
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
    (id: string) => products.find((p) => p.id === id),
    [products],
  )

  const addProduct = useCallback(async (p: Omit<Product, "id">) => {
    const tempId = `p_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 7)}`

    const newProduct = {
      ...p,
      id: tempId,
    }

    setProducts((prev) => [newProduct, ...prev])

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(p),
      })

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
  }, [])

  const updateProduct = useCallback(async (p: Product) => {
    setProducts((prev) =>
      prev.map((x) => (x.id === p.id ? p : x)),
    )

    try {
      const response = await fetch("/api/admin/products", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(p),
      })

      if (!response.ok) {
        throw new Error("Failed to update product")
      }
    } catch (error) {
      console.error("Update product error:", error)
    }
  }, [])

  const deleteProduct = useCallback(async (id: string) => {
    setProducts((prev) => prev.filter((x) => x.id !== id))

    try {
      const response = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete product")
      }
    } catch (error) {
      console.error("Delete product error:", error)
    }
  }, [])

  const addToCart = useCallback((productId: string, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === productId)

      if (existing) {
        return prev.map((c) =>
          c.productId === productId
            ? { ...c, quantity: c.quantity + quantity }
            : c,
        )
      }

      return [...prev, { productId, quantity }]
    })
  }, [])

  const setQuantity = useCallback(
    (productId: string, quantity: number) => {
      setCart((prev) =>
        quantity <= 0
          ? prev.filter((c) => c.productId !== productId)
          : prev.map((c) =>
              c.productId === productId
                ? { ...c, quantity }
                : c,
            ),
      )
    },
    [],
  )

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) =>
      prev.filter((c) => c.productId !== productId),
    )
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const addOrder = useCallback((order: Order) => {
    setOrders((prev) => [order, ...prev])
  }, [])

  const updateOrderStatus = useCallback(
    (id: string, status: OrderStatus) => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id
            ? { ...o, orderStatus: status }
            : o,
        ),
      )
    },
    [],
  )

  const setProfile = useCallback(
    (p: UserProfile) => setProfileState(p),
    [],
  )

  const saveAddress = useCallback((a: Address) => {
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
  }, [])

  const removeAddress = useCallback((index: number) => {
    setAddresses((prev) =>
      prev.filter((_, i) => i !== index),
    )
  }, [])

  const cartCount = useMemo(
    () => cart.reduce((sum, c) => sum + c.quantity, 0),
    [cart],
  )

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, c) => {
      const p = products.find(
        (x) => x.id === c.productId,
      )

      if (!p) return sum

      return sum + discountedPrice(p) * c.quantity
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
