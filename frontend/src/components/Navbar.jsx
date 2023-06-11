import Logo from './Logo'
import Link from 'next/link'

export default function Navbar () {
  return (
    <nav className='flex justify-between items-center px-2 fixed top-0 left-0 right-0 backdrop-blur-lg py-2'>
      <div className='flex items-center'>
        <Link href='/' target='_top' className='w-1/3'>
          <Logo className='w-full h-auto' width={100} height={100} />
          <p className='text-al-white font-semibold text-center'>AlChilazo</p>
        </Link>
      </div>
      <ul className='flex space-x-4 p-1 h-auto justify-center items-center'>
        <li className='bg-al-yellow font-semibold p-1 rounded-md text-center'>
          <Link href='/register-delivery'>
            Únete a nuestro equipo
          </Link>
        </li>
        <li className=''>
          <Link href='/login'>
            Login
          </Link>
        </li>
        <li>
          <Link href='/register'>
            Regístrate
          </Link>
        </li>
      </ul>

    </nav>
  )
}
