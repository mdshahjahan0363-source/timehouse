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
  if (typeof window === "undefined") {
    return fallback
  }

  try {
    const raw = window.localStorage.getItem(key)

    if (!raw) {
      return fallback
    }

    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function save<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return
  }

  try {
    window.localStorage.setItem(
      key,
      JSON.stringify(value),
    )
  } catch {
    // Ignore localStorage errors
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

  addToCart: (
    productId: string,
    quantity?: number,
  ) => void

  setQuantity: (
    productId: string,
    quantity: number,
  ) => void

  removeFromCart: (productId: string) => void
  clearCart: () => void

  cartCount: number
  cartTotal: number

  addOrder: (order: Order) => void

  updateOrderStatus: (
    id: string,
    status: OrderStatus,
  ) => void

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

  const [products, setProducts] =
    useState<Product[]>([])

  const [cart, setCart] =
    useState<CartItem[]>([])

  const [orders, setOrders] =
    useState<Order[]>([])

  const [profile, setProfileState] =
    useState<UserProfile>(null)

  const [addresses, setAddresses] =
    useState<Address[]>([])

  // --------------------------------
  // INITIAL LOAD
  // --------------------------------

  useEffect(() => {
    let mounted = true

    async function initialize() {
      // Load local data first
      const savedCart = load<CartItem[]>(
        KEYS.cart,
        [],
      )

      const savedOrders = load<Order[]>(
        KEYS.orders,
        [],
      )

      const savedProfile =
        load<UserProfile>(
          KEYS.profile,
          null,
        )

      const savedAddresses =
        load<Address[]>(
          KEYS.addresses,
          [],
        )

      if (!mounted) return

      setCart(savedCart)
      setOrders(savedOrders)
      setProfileState(savedProfile)
      setAddresses(savedAddresses)

      // Load products from server
      try {
        const response = await fetch(
          "/api/admin/products",
          {
            cache: "no-store",
          },
        )

        if (
          response.ok &&
          mounted
        ) {
          const data =
            await response.json()

          if (
            Array.isArray(data.products) &&
            data.products.length > 0
          ) {
            setProducts(
              data.products as Product[],
            )
          } else {
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

      if (mounted) {
        setReady(true)
      }
    }

    initialize()

    return () => {
      mounted = false
    }
  }, [])

  // --------------------------------
  // SAVE CART
  // --------------------------------

  useEffect(() => {
    if (!ready) return

    save(KEYS.cart, cart)
  }, [cart, ready])

  // --------------------------------
  // SAVE ORDERS
  // --------------------------------

  useEffect(() => {
    if (!ready) return

    save(KEYS.orders, orders)
  }, [orders, ready])

  // --------------------------------
  // SAVE PROFILE
  // --------------------------------

  useEffect(() => {
    if (!ready) return

    save(KEYS.profile, profile)
  }, [profile, ready])

  // --------------------------------
  // SAVE ADDRESSES
  // --------------------------------

  useEffect(() => {
    if (!ready) return

    save(KEYS.addresses, addresses)
  }, [addresses, ready])

  // --------------------------------
  // GET PRODUCT
  // --------------------------------

  const getProduct = useCallback(
    (id: string) => {
      return products.find(
        (product) => product.id === id,
      )
    },
    [products],
  )

  // --------------------------------
  // ADD PRODUCT
  // --------------------------------

  const addProduct = useCallback(
    async (p: Omit<Product, "id">) => {
      const tempId =
        `p_${Date.now()}_` +
        Math.random()
          .toString(36)
          .slice(2, 7)

      const newProduct: Product = {
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
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(p),
          },
        )

        if (!response.ok) {
          throw new Error(
            "Failed to create product",
          )
        }

        const saved =
          await response.json()

        setProducts((prev) =>
          prev.map((product) =>
            product.id === tempId
              ? {
                  ...saved,
                }
              : product,
          ),
        )
      } catch (error) {
        console.error(
          "Add product error:",
          error,
        )
      }
    },
    [],
  )

  // --------------------------------
  // UPDATE PRODUCT
  // --------------------------------

  const updateProduct = useCallback(
    async (p: Product) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === p.id
            ? p
            : product,
        ),
      )

      try {
        const response = await fetch(
          "/api/admin/products",
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(p),
          },
        )

        if (!response.ok) {
          throw new Error(
            "Failed to update product",
          )
        }
      } catch (error) {
        console.error(
          "Update product error:",
          error,
        )
      }
    },
    [],
  )

  // --------------------------------
  // DELETE PRODUCT
  // --------------------------------

  const deleteProduct = useCallback(
    async (id: string) => {
      setProducts((prev) =>
        prev.filter(
          (product) =>
            product.id !== id,
        ),
      )

      try {
        const response = await fetch(
          "/api/admin/products",
          {
            method: "DELETE",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              id,
            }),
          },
        )

        if (!response.ok) {
          throw new Error(
            "Failed to delete product",
          )
        }
      } catch (error) {
        console.error(
          "Delete product error:",
          error,
        )
      }
    },
    [],
  )

  // --------------------------------
  // ADD TO CART
  // --------------------------------

  const addToCart = useCallback(
    (
      productId: string,
      quantity = 1,
    ) => {
      if (quantity <= 0) return

      setCart((prev) => {
        const existing =
          prev.find(
            (item) =>
              item.productId ===
              productId,
          )

        let nextCart: CartItem[]

        if (existing) {
          nextCart = prev.map(
            (item) =>
              item.productId ===
              productId
                ? {
                    ...item,
                    quantity:
                      item.quantity +
                      quantity,
                  }
                : item,
          )
        } else {
          nextCart = [
            ...prev,
            {
              productId,
              quantity,
            },
          ]
        }

        // IMPORTANT:
        // Save immediately so navigation
        // cannot happen before localStorage
        // is updated.
        save(KEYS.cart, nextCart)

        return nextCart
      })
    },
    [],
  )

  // --------------------------------
  // SET QUANTITY
  // --------------------------------

  const setQuantity = useCallback(
    (
      productId: string,
      quantity: number,
    ) => {
      setCart((prev) => {
        let nextCart: CartItem[]

        if (quantity <= 0) {
          nextCart = prev.filter(
            (item) =>
              item.productId !==
              productId,
          )
        } else {
          nextCart = prev.map(
            (item) =>
              item.productId ===
              productId
                ? {
                    ...item,
                    quantity,
                  }
                : item,
          )
        }

        save(KEYS.cart, nextCart)

        return nextCart
      })
    },
    [],
  )

  // --------------------------------
  // REMOVE FROM CART
  // --------------------------------

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart((prev) => {
        const nextCart =
          prev.filter(
            (item) =>
              item.productId !==
              productId,
          )

        save(KEYS.cart, nextCart)

        return nextCart
      })
    },
    [],
  )

  // --------------------------------
  // CLEAR CART
  // --------------------------------

  const clearCart = useCallback(() => {
    setCart([])

    save(KEYS.cart, [])
  }, [])

  // --------------------------------
  // ADD ORDER
  // --------------------------------

  const addOrder = useCallback(
    (order: Order) => {
      setOrders((prev) => {
        const nextOrders = [
          order,
          ...prev,
        ]

        save(
          KEYS.orders,
          nextOrders,
        )

        return nextOrders
      })
    },
    [],
  )

  // --------------------------------
  // UPDATE ORDER STATUS
  // --------------------------------

  const updateOrderStatus =
    useCallback(
      (
        id: string,
        status: OrderStatus,
      ) => {
        setOrders((prev) => {
          const nextOrders =
            prev.map((order) =>
              order.id === id
                ? {
                    ...order,
                    orderStatus:
                      status,
                  }
                : order,
            )

          save(
            KEYS.orders,
            nextOrders,
          )

          return nextOrders
        })
      },
      [],
    )

  // --------------------------------
  // PROFILE
  // --------------------------------

  const setProfile = useCallback(
    (p: UserProfile) => {
      setProfileState(p)

      save(KEYS.profile, p)
    },
    [],
  )

  // --------------------------------
  // SAVE ADDRESS
  // --------------------------------

  const saveAddress = useCallback(
    (a: Address) => {
      setAddresses((prev) => {
        const existingIndex =
          prev.findIndex(
            (address) =>
              address.address ===
                a.address &&
              address.pincode ===
                a.pincode,
          )

        let nextAddresses: Address[]

        if (existingIndex >= 0) {
          const copy = [...prev]

          copy[existingIndex] = a

          nextAddresses = copy
        } else {
          nextAddresses = [
            a,
            ...prev,
          ]
        }

        save(
          KEYS.addresses,
          nextAddresses,
        )

        return nextAddresses
      })
    },
    [],
  )

  // --------------------------------
  // REMOVE ADDRESS
  // --------------------------------

  const removeAddress = useCallback(
    (index: number) => {
      setAddresses((prev) => {
        const nextAddresses =
          prev.filter(
            (_, i) => i !== index,
          )

        save(
          KEYS.addresses,
          nextAddresses,
        )

        return nextAddresses
      })
    },
    [],
  )

  // --------------------------------
  // CART COUNT
  // --------------------------------

  const cartCount = useMemo(() => {
    return cart.reduce(
      (sum, item) =>
        sum + item.quantity,
      0,
    )
  }, [cart])

  // --------------------------------
  // CART TOTAL
  // --------------------------------

  const cartTotal = useMemo(() => {
    return cart.reduce(
      (sum, item) => {
        const product =
          products.find(
            (p) =>
              p.id ===
              item.productId,
          )

        if (!product) {
          return sum
        }

        return (
          sum +
          discountedPrice(
            product,
          ) *
            item.quantity
        )
      },
      0,
    )
  }, [cart, products])

  // --------------------------------
  // CONTEXT VALUE
  // --------------------------------

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
    <StoreContext.Provider
      value={value}
    >
      {children}
    </StoreContext.Provider>
  )
}

// --------------------------------
// USE STORE
// --------------------------------

export function useStore() {
  const ctx =
    useContext(StoreContext)

  if (!ctx) {
    throw new Error(
      "useStore must be used within StoreProvider",
    )
  }

  return ctx
}
