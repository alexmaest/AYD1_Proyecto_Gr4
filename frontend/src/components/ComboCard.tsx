import Image from 'next/image'
import { Combo } from '@/types/interfaces'

interface ComboCardProps {
  combo: Combo
}

function ComboCard ({ combo }: ComboCardProps) {
  return (
    <div className='flex flex-col rounded overflow-hidden bg-slate-400'>
      <div className='w-full h-[200px] flex items-center justify-center'>
        <Image
          className='object-contain w-[200px] h-[200px] pt-2'
          loader={({ src }) => src}
          src={combo.image}
          alt={combo.name}
          width={200}
          height={200}
        />
      </div>
      <div className='px-6 py-4'>
        <span className='flex flex-row lg:flex-row md:flex-col'>
          <h2 className='grow font-bold text-xl mb-2'>{combo.name}</h2>
          <p className='text-2xl font-bold text-al-black'>Q.{combo.price}</p>
        </span>
        <p className='text-gray-700 text-base font-semibold'>
          {combo.description}
        </p>
      </div>
      <div className='px-6 py-2 flex'>
        <span
          className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'
        >
          #{combo.category}
        </span>
      </div>
      <div className='px-6 pb-2'>
        <p className='font-bold text-al-black mb-2'>Productos</p>
        {combo.products?.map((product) => (
          <span
            key={product.id}
            className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'
          >
            {product.quantity} x {product.name}
          </span>
        ))}
      </div>
      {/* <div
        className='flex lg:flex-row md:flex-col 2xl:justify-end lg:justify-between justify-end gap-2 m-4'
      >
        <button className='yellow_btn' onClick={handleDelete}>Eliminar</button>
        <button className='black_btn' onClick={handleEdit}>Editar</button>
      </div> */}
    </div>
  )
}

export default ComboCard
