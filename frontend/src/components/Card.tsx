
export default function Card ({ image, title, description }: { image: string, title: string, description: string }) {
  return (
    <div className='relative bg-al-yellow rounded-lg shadow-md overflow-hidden'>
      <div className='h-40'>
        <img src={image} alt={title} className='w-full h-full object-cover inset-0' />
      </div>
      <div className='p-4 relative'>
        <h3 className='text-lg text-white drop-shadow-lg font-bold mb-2 z-10 relative'>{title}</h3>
        <p className='text-al-black drop-shadow-lg font-semibold z-10 relative'>{description}</p>
      </div>
    </div>
  )
}
