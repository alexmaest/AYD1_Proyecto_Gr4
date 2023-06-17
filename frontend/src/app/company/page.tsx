'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import ProductForm from '@/components/ProductForm'
import ComboForm from '@/components/ComboForm'
import CategoryForm from '@/components/CategoryForm'
import { Category, Product } from '@/types/interfaces'
import baseUrl from '@/constants/baseUrl'

function Page () {
  const { data: session } = useSession()
  const [toggleAddProduct, setToggleAddProduct] = useState(false)
  const [toggleAddCombo, setToggleAddCombo] = useState(false)
  const [toggleAddCategory, setToggleAddCategory] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  const email = ((session?.user?.email) != null) ? session.user.email : ''

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await fetch(`${baseUrl}/company/controlPanel/products/email?=${email}`)
        const data = await res.json()
        setProducts(data)
      } catch (error: any) {
        alert(error.message)
      }
    }
    void getProducts()
  }, [email])

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetch(`${baseUrl}/company/controlPanel/categories`)
        const data = await res.json()
        // rename data to math with the interface
        for (let i = 0; i < data.length; i++) {
          data[i].id = data[i].categoria_producto_id
          delete data[i].categoria_producto_id
          data[i].name = data[i].descripcion
          delete data[i].descripcion
          data[i].image = data[i].ilustracion_url
          delete data[i].ilustracion_url
          data[i].type = data[i].es_combo === 1 ? 'Combo' : 'Producto'
          delete data[i].es_combo
        }
        setCategories(data)
      } catch (error: any) {
        alert(error.message)
      }
    }
    void getCategories()
  }, [])

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
            <ProductForm categories={categories} email={session?.user?.email} />
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
            <ComboForm categories={categories} products={products} email={session?.user?.email} />
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
