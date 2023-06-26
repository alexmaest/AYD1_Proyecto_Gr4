import useCartStore from '@/hooks/useCartStore'
import AddToCartLogo from './AddToCartLogo'
import React from 'react'
import SuccessAlert from './SuccessAlert'

interface Product {
  id: number
  name: string
  quantity: number
}

interface ComboMenuCardProps {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
  products: Product[]
  comboAdded: boolean
  setComboAdded: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ComboMenuCard (
  { id, name, description, price, image, category, products, comboAdded, setComboAdded }:
  ComboMenuCardProps
) {
  const { addCombo } = useCartStore()

  const handleAddToCard = () => {
    addCombo({ id, name, description, price, image, category, products, quantity: 1 })
    setComboAdded(true)
    setTimeout(() => {
      setComboAdded(false)
    }
    , 1500)
  }
  return (
    <div className='flex justify-center items-center border-gray-500 space-x-2'>
      {
        comboAdded && (
          <div className='absolute top-1/3'>
            <SuccessAlert title='Combo agregado al carrito' description='revisa tu carrito para finalizar tu pedido' />
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
        <div className='flex flex-row space-x-1'>
          {
                products?.map((product) => (
                  <p
                    key={product.id}
                    className='text-sm text-yellow-200'
                  >{product.quantity}x {product.name}
                  </p>
                ))
            }
        </div>
      </div>
      <div>
        <button
          className='yellow_btn'
          onClick={handleAddToCard}
        >
          <AddToCartLogo className='w-8 h-8' />
        </button>
      </div>
    </div>
  )
}
