'use client'
import AddToCartLogo from './AddToCartLogo'
import useCartStore from '@/hooks/useCartStore'
import SuccessAlert from './SuccessAlert'
import React from 'react'

export default function ProductMenuCard (
  { id, name, description, price, image, category, productAdded, setProductAdded }:
  { id: number
    name: string
    description: string
    price: number
    image: string
    category: string
    productAdded: boolean
    setProductAdded: React.Dispatch<React.SetStateAction<boolean>>
  }) {
  const { addProduct } = useCartStore()

  const handleAddToCart = () => {
    addProduct({ id, name, description, price, image, category, quantity: 1 })
    setProductAdded(true)
    setTimeout(() => {
      setProductAdded(false)
    }
    , 1500)
  }
  return (
    <div className='flex justify-center items-center border-gray-500 space-x-2'>
      {
        productAdded && (
          <div className='absolute top-1/3'>
            <SuccessAlert title='Producto agregado al carrito' description='revisa tu carrito para finalizar tu pedido' />
          </div>
        )
      }
      <div className='w-1/3 h-[200px] flex items-center justify-center'>
        <img src={image} alt={name} className='flex flex-1 object-contain w-[200px] h-[200px]' />
      </div>
      <div className='w-2/3 items-center'>
        <h1 className='text-3xl font-bold'>{name}</h1>
        <p className='text-sm text-white'>{description}</p>
        <span
          className='font-light'
        >
          #{category}
        </span>
        <p className='text-xl text-white'>Q. {price}</p>
      </div>
      <div>
        <button
          className='yellow_btn'
          onClick={handleAddToCart}
        >
          <AddToCartLogo className='w-8 h-8' />
        </button>
      </div>
    </div>
  )
}
