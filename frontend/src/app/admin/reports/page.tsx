import UserLogo from '@/components/UserLogo'
import Link from 'next/link'

export default function Page () {
  return (
    <div className='h-screen'>
      <div className='flex justify-center items-center py-20'>
        <Link
          href='/admin/reports/users'
          className='flex justify-center items-center rounded-lg p-4 cursor-pointer border hover:border-yellow-300 duration-1000 transition-all'
        >
          <div className='flex justify-center items-center'>
            <UserLogo className='fill-al-orange' />
          </div>
          <h1 className='font-semibold'>Reporte de Usuarios</h1>
        </Link>
      </div>
    </div>
  )
}
