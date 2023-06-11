import Navbar from '@/components/Navbar'

export default function Register () {
  return (
    <div>
      <Navbar />
      <h1 className='py-20 text-2xl text-center'>Únete como delivery</h1>
      <form className='flex flex-col items-center justify-center w-full max-w-md mx-auto'>
        <input
          className='w-full px-4 py-2 mb-4 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:outline-none focus:border-green-500'
          type='text'
          placeholder='Nombre'
        />
        <input
          className='w-full px-4 py-2 mb-4 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:outline-none focus:border-green-500'
          type='text'
          placeholder='Apellido'
        />
        <input
          className='w-full px-4 py-2 mb-4 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:outline-none focus:border-green-500'
          type='text'
          placeholder='Correo electrónico'
        />
        <input
          className='w-full px-4 py-2 mb-4 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:outline-none focus:border-green-500'
          type='text'
          placeholder='Contraseña'
        />
        <input
          className='w-full px-4 py-2 mb-4 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:outline-none focus:border-green-500'
          type='text'
          placeholder='Confirmar contraseña'
        />
        <button
          className='w-full px-4 py-2 mb-4 text-base font-semibold text-white transition duration-200 bg-green-500 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:bg-green-700'
          type='submit'
        >
          Registrarse
        </button>
      </form>
    </div>
  )
}
