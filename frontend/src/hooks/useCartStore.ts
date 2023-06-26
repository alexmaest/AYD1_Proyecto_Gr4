import { Combo, Product } from '@/types/interfaces'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProductCartInfo {
  quantity: number
}

interface ComboCartInfo {
  quantity: number
}

type ProductCart = Product & ProductCartInfo
type ComboCart = Combo & ComboCartInfo

interface CartStore {
  products: ProductCart[]
  combos: ComboCart[]
  total: number
  addProduct: (product: ProductCart) => void
  addCombo: (combo: ComboCart) => void
  removeProduct: (product: ProductCart) => void
  updateProductQuantity: (id: number, quantity: number) => void
  updateComboQuantity: (id: number, quantity: number) => void
  removeCombo: (combo: ComboCart) => void
  clearCart: () => void
  totalCart: () => number
}

const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      products: [] as ProductCart[],
      combos: [] as ComboCart[],
      total: 0,
      addProduct: (product) => {
        set((state) => {
          const productInCart = state.products.find((p) => p.id === product.id)
          if (productInCart !== undefined) {
            return {
              products: state.products.map((p) => {
                if (p.id === product.id) {
                  return { ...p, quantity: p.quantity + 1 }
                }
                return p
              })
            }
          }
          return { products: [...state.products, { ...product }] }
        })
      },
      addCombo: (combo) => {
        set((state) => {
          const comboInCart = state.combos.find((c) => c.id === combo.id)
          if (comboInCart !== undefined) {
            return {
              combos: state.combos.map((c) => {
                if (c.id === combo.id) {
                  return { ...c, quantity: c.quantity + 1 }
                }
                return c
              })
            }
          }
          return { combos: [...state.combos, { ...combo }] }
        })
      },
      removeProduct: (product) => {
        set((state) => ({ products: state.products.filter((p) => p.id !== product.id) }))
      },
      updateProductQuantity: (id, quantity) => {
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id === id) {
              if (p.quantity + quantity <= 0) {
                return p
              }
              p.quantity += quantity
              return p
            }
            return p
          })
        }))
      },
      updateComboQuantity: (id, quantity) => {
        set((state) => ({
          combos: state.combos.map((c) => {
            if (c.id === id) {
              if (c.quantity + quantity <= 0) {
                return c
              }
              c.quantity += quantity
              return c
            }
            return c
          })
        }))
      },
      removeCombo: (combo) => {
        set((state) => ({ combos: state.combos.filter((c) => c.id !== combo.id) }))
      },
      clearCart: () => {
        set(() => ({ products: [], combos: [] }))
      },
      totalCart: () => {
        const totalProducts: number = useCartStore.getState().products.reduce(
          (acc: number, product: ProductCart) => acc + product.price * product.quantity,
          0
        )
        const totalCombos: number = useCartStore.getState().combos.reduce(
          (acc: number, combo: ComboCart) => acc + combo.price * combo.quantity,
          0
        )
        return totalProducts + totalCombos
      }
    }),
    {
      name: 'cart-storage'
    }
  )
)

export default useCartStore
