import Image from 'next/image'
import { Product } from '@/types/interfaces'

interface IProps {
  product: Product
  handleDelete: () => Promise<void>
  handleEdit: () => void
}

function ProductCard ({ product, handleDelete, handleEdit }: IProps) {
  return (
    <div className='flex flex-col rounded overflow-hidden bg-slate-400'>
      <div className='w-full h-[200px] flex items-center justify-center'>
        <Image
          className='object-contain w-[200px] h-[200px] pt-2'
          loader={({ src }) => src}
          src={product.image}
          alt={product.name}
          width={200}
          height={200}
        />
      </div>
      <div className='px-6 py-4 grow'>
        <span className='flex flex-row lg:flex-row md:flex-col'>
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
      <div
        className='flex lg:flex-row md:flex-col 2xl:justify-end lg:justify-between justify-end gap-2 m-4'
      >
        <button className='yellow_btn' onClick={handleDelete}>Eliminar</button>
        <button className='black_btn' onClick={handleEdit}>Editar</button>
      </div>
    </div>
  )
}

export default ProductCard
