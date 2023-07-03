'use client'

import { useEffect, useState } from 'react'
import baseUrl from '@/constants/baseUrl'
import Spinner from '@/components/Spinner'

interface Company {
  company_id: number
  name: string
  orders_number: number
}

function Page () {
  const [companies, setCompanies] = useState<Company[]>([])
  const [maxValue, setMaxValue] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getCompanies = async () => {
      try {
        const response = await fetch(`${baseUrl}/admin/companyTop5`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        setCompanies(data)
        setIsLoading(false)
        setMaxValue(data[0].orders_number)
      } catch (error) {
        alert(error)
      }
    }
    void getCompanies()
  }, [])

  return (
    <div className='container w-4/5 my-24 mx-auto'>
      <h1 className='text-center text-5xl orange_gradient_text font-bold mb-8'>
        Top 5 Empresas
      </h1>
      <section className='w-full mb-8'>
        {isLoading && (
          <div className='flex justify-center items-center'>
            <Spinner />
          </div>
        )}
        <div className='flex flex-col w-full border-t-2 border-al-orange'>
          {!isLoading && (
            <>
              {companies.map((company, index) => (
                <div
                  key={company.company_id}
                >
                  <div
                    className='flex justify-start items-center border-2 border-t-0 border-al-orange p-4 overflow-visible'
                    style={{ width: (company.orders_number * 100 / maxValue).toString() + '%' }}
                  >
                    <h2 className='font-bold text-xl text-al-white'>{company.name}</h2>
                  </div>
                </div>
              ))}
              <div className='flex flex-row justify-between pt-4 mt-1 border-t-2 border-al-orange'>
                {companies.map((company, index) => (
                  <h2 key={company.company_id} className='font-bold text-xl'>{index}</h2>
                ))}
              </div>
            </>
          )}
          <p>Cantidad de Pedidos</p>
        </div>
      </section>
    </div>
  )
}

export default Page
