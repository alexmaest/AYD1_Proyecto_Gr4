'use client'

import Navbar from '@/components/Navbar'
import { useEffect, useRef, useState } from 'react'
import { signIn } from 'next-auth/react'

const dropdown = {
  title: 'Únete al mejor equipo',
  styles: '',
  items: [
    {
      text: 'Repartidor',
      linkTo: '/deliveryManRegister'
    },
    {
      text: 'Restaurante',
      linkTo: '/company-register'
    }
  ]
}

const liItems = [
  {
    linkTo: '/user-register',
    text: 'Registro'
  }
]

function Page () {
  const emailRef = useRef<HTMLInputElement>(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await signIn('credentials', {
        email,
        password,
        redirect: true,
        callbackUrl: '/check-role'
      })
    } catch (error) {
      setError('Correo o contraseña incorrectos')
    }
  }

  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  useEffect(() => {
    setError('')
  }, [email, password])

  return (
    <>
      <Navbar liElements={liItems} dropdown={dropdown} />
      <div className='w-full h-screen flex items-center'>
        <section className='w-96 rounded px-10 py-16 orange_gradient text-al-black mx-auto my-24'>
          <h1 className='text-center font-black text-3xl mb-10'>Iniciar Sesión</h1>
          {(error !== '') && (
            <p className='bg-red-200 border-none rounded text-red-500 text-lg text-center italic p-2 mb-8'>{error}</p>
          )}
          <form action='post' className='flex flex-col gap-4' onSubmit={(e) => { void handleSubmit(e) }}>
            <div className='w-full px-3'>
              <label className='form_label' htmlFor='email'>
                Correo:
              </label>
              <input
                className='form_input'
                type='email'
                name='email'
                ref={emailRef}
                id='email'
                placeholder='Correo'
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>
            <div className='w-full px-3'>
              <label className='form_label' htmlFor='password'>
                Contraseña
              </label>
              <input
                className='form_input'
                id='password'
                type='password'
                placeholder='Ingrese su contraseña'
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
            </div>
            <div className='w-full px-3'>
              <button
                className='black_btn w-full'
                type='submit'
              >
                Iniciar Sesión
              </button>
            </div>
          </form>
        </section>
      </div>
    </>
  )
}

export default Page
