'use client'
import useStore from '@/hooks/useStore'
import useCartStore from '@/hooks/useCartStore'
import Link from 'next/link'
import { useState } from 'react'
import CancelLogo from '@/components/CancelLogo'

export default function Page () {
  const [descriptionValue, setDescriptionValue] = useState('')
  const {
    updateProductQuantity,
    updateComboQuantity,
    totalCart,
    setDescription,
    deleteProduct,
    deleteCombo
  } = useCartStore()
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

  const handlePay = () => {
    setDescription(descriptionValue)
  }

  const handleDeleteProduct = (id: number) => {
    deleteProduct(id)
  }

  const handleDeleteCombo = (id: number) => {
    deleteCombo(id)
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
                <div className='flex flex-row justify-center items-center space-x-2'>
                  <span
                    className='cursor-pointer'
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <CancelLogo className='w-4 h-4 stroke-white bg-red-500' />
                  </span>
                  <div className='flex flex-col'>
                    <h1 className='font-bold text-lg'>{product.name}</h1>
                    <h1>Q. {product.price}</h1>
                  </div>
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
                <div className='flex flex-row justify-center items-center space-x-2'>
                  <span
                    className='cursor-pointer'
                    onClick={() => handleDeleteCombo(combo.id)}
                  >
                    <CancelLogo className='w-4 h-4 stroke-white bg-red-500' />
                  </span>
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
          <div className='flex flex-col flex-1 w-full items-start ml-2'>
            <p className='text-gray-400'>Descripción</p>
          </div>
          <div
            className='flex flex-row justify-between items-center w-full px-4 my-2'
          >
            <input
              type='text'
              placeholder='Ingrese una descripción a su pedido'
              className='flex flex-1 bg-transparent p-2 text-sm'
              value={descriptionValue}
              onChange={(e) => setDescriptionValue(e.target.value)}
            />
          </div>
          <footer className='flex justify-between flex-1 w-full px-2 border-t my-2 items-center'>
            <p>
              Total
            </p>
            <p className='font-bold text-xl text-yellow-400'>
              Q. {totalCart()}
            </p>
          </footer>
        </article>
        <footer className='w-2/3'>
          <div className='flex justify-end px-2'>
            <Link
              href='/user/cart/pay'
              className='rounded-xl bg-yellow-500 py-2 px-4 hover:bg-transparent hover:border-2 hover:border-yellow-400'
              onClick={handlePay}
            >
              Pagar
            </Link>
          </div>
        </footer>
      </div>
    </section>
  )
}
