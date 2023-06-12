'use client'
import Navbar from '@/components/Navbar'
import baseUrl from '@/constants/baseUrl'
import { useState } from 'react'

export default function Register () {
  const [error, setError] = useState('')
  const phoneRegex = /^[+]?([(]?502[)]?)?[-\s]?[0-9]{8}$/

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())

    if (data.password !== data.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (!phoneRegex.test(data.phoneNumber.toString())) {
      setError('El número de teléfono no es válido')
      return
    }

    try {
      const res = await fetch(baseUrl + '/userRegister', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          phoneNumber: data.phoneNumber,
          municipality: data.municipality,
          department: data.department
        })
      })
      const dataJson = await res.json()
      console.log(dataJson)
    } catch (error) {
      console.log(error)
      setError('Ha ocurrido un error, intenta de nuevo')
    }
  }

  return (
    <div>
      <Navbar />
      <h1 className='py-20 text-2xl text-center text-al-yellow font-bold'>Registrate y pide cuando quieras</h1>
      <form
        className='flex flex-col items-center justify-center w-full max-w-md mx-auto'
        onSubmit={handleSubmit}
      >
        {
        error !== '' && (
          <div className='flex flex-col p-2 mb-4 absolute bottom-0 w-full rounded-lg items-center justify-center bg-red-500 text-white text-center max-w-md'>
            <p>{error}</p>
          </div>
        )
      }
        <div className='flex flex-row'>
          <input
            name='firstName'
            className='w-full mr-2 px-4 py-2 mb-4 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:outline-none focus:border-green-500'
            type='text'
            placeholder='Nombre'
          />
          <input
            name='lastName'
            className='w-full ml-2 px-4 py-2 mb-4 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:outline-none focus:border-green-500'
            type='text'
            placeholder='Apellido'
          />
        </div>
        <input
          name='email'
          className='w-full px-4 py-2 mb-4 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:outline-none focus:border-green-500'
          type='email'
          placeholder='Correo electrónico'
        />
        <input
          name='phoneNumber'
          className='w-full px-4 py-2 mb-4 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:outline-none focus:border-green-500'
          type='text'
          placeholder='Número de teléfono'
        />
        <div className='flex flex-row'>
          <input
            name='municipality'
            className='w-full mr-2 px-4 py-2 mb-4 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:outline-none focus:border-green-500'
            type=''
            placeholder='Municipio'
          />
          <input
            name='department'
            className='w-full ml-2 px-4 py-2 mb-4 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:outline-none focus:border-green-500'
            type='text'
            placeholder='Departamento'
          />
        </div>
        <input
          name='password'
          className='w-full px-4 py-2 mb-4 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:outline-none focus:border-green-500'
          type='password'
          placeholder='Contraseña'
        />
        <input
          name='confirmPassword'
          className='w-full px-4 py-2 mb-4 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:outline-none focus:border-green-500'
          type='password'
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
