import Link from 'next/link'

export default function CompanyCard ({ id, name, description, category }: { id: number, name: string, description: string, category?: string }) {
  return (
    <Link
      href={`/user/company/${id}`} passHref
      className='border rounded-lg p-4 text-center hover:border-yellow-300 hover:cursor-pointer'
    >
      <p className='text-lg font-bold'>{category}</p>
      <h3 className='text-center font-semibold text-xl mx-2'>{name}</h3>
      <h4 className='text-center text-sm mx-2'>{description}</h4>
    </Link>
  )
}
