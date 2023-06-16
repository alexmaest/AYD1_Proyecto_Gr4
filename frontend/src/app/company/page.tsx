'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import ProductForm from '@/components/ProductForm'
import ComboForm from '@/components/ComboForm'
import CategoryForm from '@/components/CategoryForm'

const sampleCategories = [
  { id: 1, name: 'Categoría 1', image: 'sin-fotos.png', type: 'Combo' },
  { id: 2, name: 'Categoría 2', image: 'sin-fotos.png', type: 'Combo' },
  { id: 3, name: 'Categoría 3', image: 'sin-fotos.png', type: 'Combo' }
]

const products = [
  {
    id: 1,
    name: 'Producto 1',
    description: 'Descripción del producto 1',
    price: 100,
    image: '/pizza.webp',
    category: 'Categoría 1'
  },
  {
    id: 2,
    name: 'Producto 2',
    description: 'Descripción del producto 2',
    price: 200,
    image: '/pizza.webp',
    category: 'Categoría 1'
  }
]

function Page () {
  const { data: session } = useSession()
  const [toggleAddProduct, setToggleAddProduct] = useState(false)
  const [toggleAddCombo, setToggleAddCombo] = useState(false)
  const [toggleAddCategory, setToggleAddCategory] = useState(false)

  return (
    <div className='container w-4/5 my-24 mx-auto'>
      <h1 className='text-center text-5xl orange_gradient_text font-bold mb-8'>
        Panel de Control
      </h1>
      {!(toggleAddCombo || toggleAddCategory) && (
        <section className='w-full flex flex-col mb-8'>
          <div className='w-full flex flex-row pb-2 border-b-2 border-al-yellow'>
            <h2 className='grow text-3xl font-semibold'>Productos</h2>
            <button
              className='outline_btn w-[200px] mr-4'
              onClick={() => setToggleAddProduct(!toggleAddProduct)}
            >
              {toggleAddProduct ? 'Cancelar' : 'Agregar'}
            </button>
            <Link className='outline_btn w-[200px]' href='/company/products'>
              Ver Productos
            </Link>
          </div>
          {toggleAddProduct && (
            <ProductForm categories={sampleCategories} email={session?.user?.email} />
          )}
        </section>
      )}
      {!(toggleAddProduct || toggleAddCategory) && (
        <section className='w-full flex flex-col mb-8'>
          <div className='w-full flex flex-row pb-2 border-b-2 border-al-yellow'>
            <h2 className='grow text-3xl font-semibold'>Combos</h2>
            <button
              className='outline_btn w-[200px] mr-4'
              onClick={() => setToggleAddCombo(!toggleAddCombo)}
            >
              {toggleAddCombo ? 'Cancelar' : 'Agregar'}
            </button>
            <Link className='outline_btn w-[200px]' href='/company/combos'>
              Ver Combos
            </Link>
          </div>
          {toggleAddCombo && (
            <ComboForm categories={sampleCategories} products={products} email={session?.user?.email} />
          )}
        </section>
      )}
      {!(toggleAddProduct || toggleAddCombo) && (
        <section className='w-full flex flex-col'>
          <div className='w-full flex flex-row pb-2 border-b-2 border-al-yellow'>
            <h2 className='grow text-3xl font-semibold'>Categorías</h2>
            <button
              className='outline_btn w-[200px] mr-4'
              onClick={() => setToggleAddCategory(!toggleAddCategory)}
            >
              {toggleAddCategory ? 'Cancelar' : 'Agregar'}
            </button>
            <Link className='outline_btn w-[200px]' href='/company/categories'>
              Ver Categorías
            </Link>
          </div>
          {toggleAddCategory && (
            <CategoryForm email={session?.user?.email} />
          )}
        </section>
      )}
    </div>
  )
}

export default Page
