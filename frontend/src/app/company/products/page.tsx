'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import baseUrl from '@/constants/baseUrl'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types/interfaces'

function Page () {
  const { data: session } = useSession()
  const router = useRouter()

  const [products, setProducts] = useState<Product[]>([])
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

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${baseUrl}/company/products/${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      alert(data.message)
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleEdit = (id: number) => {
    try {
      router.push(`/company/products/${id}`)
    } catch (error: any) {
      alert(error.message)
    }
  }

  return (
    <div className='container w-4/5 my-20 mx-auto'>
      <section className='w-full flex flex-col'>
        <div className='w-full flex flex-row pb-2 border-b-2 border-al-yellow'>
          <h1 className='grow text-3xl font-semibold'>Productos</h1>
          <Link className='outline_btn w-[200px]' href='/company'>
            Agregar
          </Link>
        </div>
        <div className='grid gap-4 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-3 mt-8'>
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              handleDelete={async () => await handleDelete(product.id)}
              handleEdit={() => handleEdit(product.id)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Page
