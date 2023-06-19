import Image from 'next/image'
import { Category } from '@/types/interfaces'

interface IProps {
  category: Category
}

function CategoryCard ({ category }: IProps) {
  return (
    <div className='flex flex-col rounded overflow-hidden bg-slate-400'>
      <div className='w-full h-[200px] flex items-center justify-center'>
        <Image
          className='object-contain w-[200px] h-[200px] p-2'
          loader={({ src }) => src}
          src={category.image}
          alt={category.name}
          width={200}
          height={200}
        />
      </div>
      <div className='px-6 py-4'>
        <span className='flex flex-row lg:flex-row md:flex-col'>
          <h2 className='grow font-bold text-xl mb-2'>{category.name}</h2>
          <p className='text-2xl font-bold text-al-black'>{category.type}</p>
        </span>
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

export default CategoryCard
