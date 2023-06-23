'use client'
import { useState, useEffect } from 'react'
import baseUrl from '@/constants/baseUrl'

interface Company {
  category: string
  company_id: number
  description: string
  name: string
}

export default function Page () {
  const [valueToSearch, setValueToSearch] = useState('')
  const [companies, setCompanies] = useState<Company[]>([])
  useEffect(() => {
    if (valueToSearch === '') return setCompanies([])

    const fetcher = async (url: string) => {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ search: valueToSearch })
      })
      const data = await res.json()
      return data
    }

    const getResult = async () => {
      const data = await fetcher(`${baseUrl}/user/dashboard/search`)
      setCompanies(data)
    }

    void getResult()
  }, [valueToSearch])
  return (
    <>
      <section className='py-28 h-screen'>
        <div className='flex justify-start h-full flex-col'>
          <div className='flex flex-col items-center mb-4'>
            <h1 className='text-2xl font-bold text-orange-500 mb-3'>Buscar Restaurante</h1>
            <input
              type='search'
              className='text-white rounded-md p-2 bg-transparent'
              placeholder='Buscar'
              value={valueToSearch}
              onChange={(e) => setValueToSearch(e.target.value)}
            />
          </div>
          {
            companies.length > 0
              ? (
                <div className='p-4'>
                  <div className='flex flex-wrap wrap items-center'>
                    {
                    companies.map((company) => (
                      <div
                        key={company.company_id}
                        className='flex flex-col items-center mx-4 my-4 border border-yellow-400 rounded-lg p-4'
                      >
                        <p className='text-lg font-bold'>{company.category}</p>
                        <h1 className='text-xl font-bold'>{company.name}</h1>
                        <p className='text-lg font-bold'>{company.description}</p>
                      </div>
                    ))
                  }
                  </div>
                </div>
                )
              : null
          }
        </div>

      </section>
    </>
  )
}
