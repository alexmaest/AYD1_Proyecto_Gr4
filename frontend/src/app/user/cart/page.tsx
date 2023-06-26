'use client'
import useStore from '@/hooks/useStore'
import useCartStore from '@/hooks/useCartStore'

export default function Page () {
  const { updateProductQuantity, updateComboQuantity, totalCart } = useCartStore()
  const products = useStore(useCartStore, (state) => state.products)
  const combos = useStore(useCartStore, (state) => state.combos)

  const handleAddProduct = (id: number) => {
    updateProductQuantity(id, 1)
  }

  const handleRemoveProduct = (id: number) => {
    updateProductQuantity(id, -1)
  }

  const handleAddCombo = (id: number) => {
    updateComboQuantity(id, 1)
  }

  const handleRemoveCombo = (id: number) => {
    updateComboQuantity(id, -1)
  }

  if (products == null || combos == null) {
    return (
      <section className='py-28 px-2 h-screen'>
        <h1 className='text-2xl  font-bold'>Cargando tu pedido</h1>
      </section>
    )
  }
  return (
    <section className='py-28 px-2 h-screen'>
      <h1 className='text-2xl text-orange-600 font-bold'>Cart</h1>

      <div className='flex flex-col items-center'>
        <article className='flex flex-col items-center my-4 border-2 border-orange-600 w-2/3 rounded-lg h-full'>
          {
          products?.length > 0 && (
            <div className='flex flex-col flex-1 w-full items-start ml-2'>
              <p className='text-gray-400'>Individuales</p>
            </div>
          )
          }
          {
            products?.map((product) => (
              <div
                key={product.id}
                className='flex flex-row justify-between items-center w-full px-4'
              >
                <div className='flex flex-col'>
                  <h1 className='font-bold text-lg'>{product.name}</h1>
                  <h1>Q. {product.price}</h1>
                </div>
                <div className='flex flex-col items-center'>
                  <p>
                    x {product.quantity}
                  </p>
                  <div className='flex flex-row items-center justify-center space-x-2'>
                    <button
                      className='font-bold text-xl'
                      onClick={() => handleAddProduct(product.id)}
                    >
                      +
                    </button>
                    <button
                      className='font-bold text-xl'
                      onClick={() => handleRemoveProduct(product.id)}
                    >
                      -
                    </button>
                  </div>
                </div>
              </div>
            ))
        }
          {
          combos?.length > 0 && (
            <div className='flex flex-col flex-1 w-full items-start ml-2'>
              <p className='text-gray-400'>Combos</p>
            </div>
          )
        }
          {
            combos?.map((combo) => (
              <div
                key={combo.id}
                className='flex flex-row justify-between items-center w-full px-4'
              >
                <div className='flex flex-col'>
                  <h1 className='font-bold text-lg'>{combo.name}</h1>
                  <div className='flex flex-row space-x-2'>
                    {
                      combo?.products?.map(product => (
                        <p
                          key={product.id}
                          className='font-light text-yellow-300 text-xs'
                        >x{product.quantity} {product.name}
                        </p>
                      ))
                    }
                  </div>
                  <h1>Q. {combo.price}</h1>
                </div>
                <div className='flex flex-col items-center'>
                  <p>
                    x {combo.quantity}
                  </p>
                  <div className='flex flex-row items-center justify-center space-x-2'>
                    <button
                      className='font-bold text-xl'
                      onClick={() => handleAddCombo(combo.id)}
                    >
                      +
                    </button>
                    <button
                      className='font-bold text-xl'
                      onClick={() => handleRemoveCombo(combo.id)}
                    >
                      -
                    </button>
                  </div>
                </div>
              </div>
            ))
        }
          <footer className='flex justify-between flex-1 w-full px-2 border-t my-2 items-center'>
            <p>
              Total
            </p>
            <p className='font-bold text-xl text-yellow-400'>
              Q. {totalCart()}
            </p>
          </footer>
        </article>
      </div>
    </section>
  )
}
