import ProductCard from '@/components/ProductCard'
import { Product } from '@/types/interfaces'
import Link from 'next/link'

const sampleProduct: Product = {
  id: 1,
  name: 'Producto 1',
  description: 'Descripción del producto 1',
  price: 100,
  image: '/pizza.webp',
  category: 'Categoría 1'
}

function Page () {
  return (
    <div className='container w-4/5 my-20 mx-auto'>
      <section className='w-full flex flex-col'>
        <div className='w-full flex flex-row pb-2 border-b-2 border-al-yellow'>
          <h1 className='grow text-3xl font-semibold'>Productos</h1>
          <Link className='outline_btn w-[200px]' href='/company'>
            Agregar
          </Link>
        </div>
        <div className='grid gap-4 grid-cols-4 mt-8'>
          <ProductCard product={sampleProduct} />
          <ProductCard product={sampleProduct} />
          <ProductCard product={sampleProduct} />
          <ProductCard product={sampleProduct} />
          <ProductCard product={sampleProduct} />
        </div>
      </section>
    </div>
  )
}

export default Page
