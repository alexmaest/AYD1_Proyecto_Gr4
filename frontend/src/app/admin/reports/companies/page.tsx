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
        <div className='flex flex-col w-full gap-4'>
          {!isLoading && (
            <>
              {companies.map((company, index) => (
                <div
                  key={company.company_id}
                  className='flex flex-col justify-center items-center border-2 border-al-orange rounded-lg shadow-lg p-4'
                >
                  <h2 className='font-bold text-xl'>{index + 1}. {company.name} - {company.orders_number} ordenes</h2>
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
