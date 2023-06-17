'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Category } from '@/types/interfaces'
import CategoryCard from '@/components/CategoryCard'
import baseUrl from '@/constants/baseUrl'

function Page () {
  const [categories, setCategories] = useState<Category[]>([])

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

  // const handleDelete = async (id: number) => {
  //   try {
  //     const res = await fetch(`${baseUrl}/company/categories/${id}`, {
  //       method: 'DELETE'
  //     })
  //     const data = await res.json()
  //     alert(data.message)
  //   } catch (error: any) {
  //     alert(error.message)
  //   }
  // }

  // const handleEdit = (id: number) => {
  //   try {
  //     router.push(`/company/categories/${id}`)
  //   } catch (error: any) {
  //     alert(error.message)
  //   }
  // }

  return (
    <div className='container w-4/5 my-20 mx-auto'>
      <section className='w-full flex flex-col'>
        <div className='w-full flex flex-row pb-2 border-b-2 border-al-yellow'>
          <h1 className='grow text-3xl font-semibold'>Categorías</h1>
          <Link className='outline_btn w-[200px]' href='/company'>
            Agregar
          </Link>
        </div>
        <div className='grid gap-4 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-3 mt-8'>
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Page
