import UserLogo from '@/components/UserLogo'
import Link from 'next/link'

export default function Page () {
  return (
    <div className='h-screen'>
      <div className='grid grid-rows-4 my-24 max-w-md mx-auto gap-4'>
        <Link
          href='/admin/reports/users'
          className='flex justify-between items-center rounded-lg p-4 cursor-pointer border hover:border-yellow-300 duration-1000 transition-all'
        >
          <div className='flex justify-center items-center'>
            <UserLogo className='fill-al-orange' />
          </div>
          <h1 className='font-semibold'>Reporte de Usuarios</h1>
        </Link>
        <Link
          href='/admin/reports/companies'
          className='flex justify-between items-center rounded-lg p-4 cursor-pointer border hover:border-yellow-300 duration-1000 transition-all'
        >
          <div className='flex justify-center items-center'>
            <UserLogo className='fill-al-yellow' />
          </div>
          <h1 className='font-semibold'>Top 5 Empresas</h1>
        </Link>
        <Link
          href='/admin/reports/deliveries'
          className='flex justify-between items-center rounded-lg p-4 cursor-pointer border hover:border-yellow-300 duration-1000 transition-all'
        >
          <div className='flex justify-center items-center'>
            <UserLogo className='fill-emerald-500' />
          </div>
          <h1 className='font-semibold'>Top 5 Repartidores</h1>
        </Link>
        <Link
          href='/admin/reports/products'
          className='flex justify-between items-center rounded-lg p-4 cursor-pointer border hover:border-yellow-300 duration-1000 transition-all'
        >
          <div className='flex justify-center items-center'>
            <UserLogo className='fill-sky-500' />
          </div>
          <h1 className='font-semibold'>Productos mas vendidos</h1>
        </Link>
      </div>
    </div>
  )
}
