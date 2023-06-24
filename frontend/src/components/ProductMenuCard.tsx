export default function ProducMenuCard ({ name, description, price, image, category }: { name: string, description: string, price: number, image: string, category: string }) {
  return (
    <div className='flex justify-center items-center border-gray-500 space-x-2'>
      <div className='w-1/3 h-[200px] flex items-center justify-center'>
        <img src={image} alt={name} className='flex flex-1 object-contain w-[200px] h-[200px]' />
      </div>
      <div className='w-2/3 items-center'>
        <h1 className='text-3xl font-bold'>{name}</h1>
        <p className='text-sm text-white'>{description}</p>
        <span
          className='font-light'
        >
          #{category}
        </span>
        <p className='text-xl text-white'>Q. {price}</p>
      </div>
      <div>
        <button className='yellow_btn'>Pedir</button>
      </div>
    </div>
  )
}
