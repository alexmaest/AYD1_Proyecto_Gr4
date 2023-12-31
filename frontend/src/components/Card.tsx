import Link from 'next/link'

export default function Card ({ image, title, description, linkTo }: { image: string, title: string, description: string, linkTo: string }) {
  return (
    <Link href={linkTo} className=' bg-al-yellow rounded-lg shadow-md overflow-hidden'>
      <div className='h-40'>
        <img src={image} alt={title} className='w-full h-full object-cover inset-0' />
      </div>
      <div className='p-4'>
        <h3 className='text-lg text-white font-bold mb-2'>{title}</h3>
        <p className='text-al-black font-semibold'>{description}</p>
      </div>
    </Link>
  )
}
