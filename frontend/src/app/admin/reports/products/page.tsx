'use client'

import { useEffect, useState } from 'react'
import baseUrl from '@/constants/baseUrl'
import Spinner from '@/components/Spinner'

interface Product {
  product_id: number
  product_name: string
  quantity: number
  company: string
}

function Page () {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getCompanies = async () => {
      try {
        const response = await fetch(`${baseUrl}/admin/productsTopGlobal`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        setProducts(data)
        setIsLoading(false)
      } catch (error) {
        alert(error)
      }
    }
    void getCompanies()
  }, [])

  return (
    <div className='container w-4/5 my-24 mx-auto'>
      <h1 className='text-center text-5xl orange_gradient_text font-bold mb-8'>
        Productos mas Vendidos
      </h1>
      <section className='w-full mb-8'>
        {isLoading && (
          <div className='flex justify-center items-center'>
            <Spinner />
          </div>
        )}
        <div className='flex flex-col w-full gap-4'>
          {!isLoading && (
            <>
              {products.map((product, index) => (
                <div
                  key={product.product_id}
                  className='flex flex-row justify-between items-center border-2 border-al-orange rounded-lg shadow-lg p-4'
                >
                  <h2 className='font-bold text-xl'>{index + 1}. {product.product_name} - {product.quantity} ordenes</h2>
                  <h2 className='font-bold text-xl'>Empresa: {product.company}</h2>
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default Page
