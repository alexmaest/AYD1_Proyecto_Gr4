'use client'
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
          <ul>
            {category?.companies.map((company) => (
              <li key={company.name} className='py-4'>
                <div className='border rounded-lg p-4 hover:border-yellow-300 hover:cursor-pointer'>
                  <h3 className='text-center font-semibold text-xl mx-2'>{company.name}</h3>
                  <h4 className='text-center text-sm mx-2'>{company.description}</h4>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
