import Image from 'next/image'
import { Product } from '@/types/interfaces'

function ProductCard ({ product }: { product: Product }) {
  return (
    <div className='flex flex-col rounded overflow-hidden bg-slate-400'>
      <Image
        className='mx-auto object-contain w-[200px] h-[200px]'
        src={product.image}
        alt={product.name}
        width={200}
        height={160}
      />
      <div className='px-6 py-4'>
        <span className='flex flex-row'>
          <h2 className='grow font-bold text-xl mb-2'>{product.name}</h2>
          <p className='text-2xl font-bold text-al-black'>Q.{product.price}</p>
        </span>
        <p className='text-gray-700 text-base font-semibold'>
          {product.description}
        </p>
      </div>
      <div className='px-6 pt-4 pb-2'>
        <span
          className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'
        >
          #{product.category}
        </span>
      </div>
    </div>
  )
}

export default ProductCard
