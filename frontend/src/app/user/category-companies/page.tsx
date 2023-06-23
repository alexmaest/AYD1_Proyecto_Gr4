'use client'
import CompanyCard from '@/components/CompanyCard'
import useCategory from '@/hooks/useCategory'
import { useSearchParams } from 'next/navigation'

export default function Page () {
  const searchParams = useSearchParams()
  const categoryId = searchParams?.get('categoryId')

  const { category } = useCategory(categoryId as string)
  return (
    <>
      <section className='flex justify-center my-28'>
        <div className='p-8 w-3/4 border border-orange-600 rounded-lg flex flex-col justify-center items-center'>
          <h1 className='text-yellow-300 font-bold text-3xl mx-2'>{category?.description}</h1>
          <h4 className='py-5 items-center justify-center flex text-center text-sm'>Empresas</h4>
          <div className='flex flex-wrap space-x-5'>
            {category?.companies.map((company) => (
              <CompanyCard key={company.company_id} id={company.company_id} {...company} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
