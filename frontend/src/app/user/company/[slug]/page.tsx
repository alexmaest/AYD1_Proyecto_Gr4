'use client'
import baseUrl from '@/constants/baseUrl'
import { useEffect } from 'react'

export default function Page ({ params }: { params: { slug: string } }) {
  useEffect(() => {
    const fetcher = async (url: string) => {
      const res = await fetch(url)
      const data = await res.json()
      return data
    }

    const getCompany = async () => {
      const data = await fetcher(`${baseUrl}/user/dashboard/company/${params.slug}`)
      console.log(data)
    }

    void getCompany()
  })
  return (
    <section className='py-28 h-screen'>
      <div className='px-2'>
        <h1 className='text-2xl font-bold text-orange-500 mb-3'>Empresa</h1>
      </div>
    </section>
  )
}
