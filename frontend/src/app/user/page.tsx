'use client'
import useCategories from '@/hooks/useCategories'
import Link from 'next/link'

function Page () {
  const { categories, isLoading, error } = useCategories()
  return (
    <>
      <section className='my-24'>
        <div>
          <h1 className='text-3xl font-bold text-center text-orange-400'>Categorías</h1>
          <div className='flex flex-wrap justify-center'>
            {isLoading && <p>Cargando...</p>}
            {error === undefined || error === null ? null : <p>Hubo un error al cargar las categorías</p>}
            {(categories === undefined || categories?.length === 0) && error === undefined && !isLoading
              ? <p>No se encontraron categorías</p>
              : categories?.map((category) => (
                <div key={category.category_id} className='flex flex-col items-center justify-center w-1/3 p-4'>
                  <Link href={
                      {
                        pathname: '/user/category-companies',
                        query: { categoryId: category.category_id }
                      }
                        }
                  >
                    <img src={category.image} alt={category.description} className='w-32 h-32 object-cover rounded-full' />
                  </Link>
                  <p className='text-center font-bold py-3'>{category.description}</p>
                </div>
              ))}
          </div>
        </div>

      </section>
    </>
  )
}

export default Page
