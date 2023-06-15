'use client'
import Logo from '@/components/Logo'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

function Page () {
  const { data } = useSession()
  const router = useRouter()

  const handleClick = () => {
    if (data != null) {
      console.log(data)
      const { role } = data.user
      if (role === 'Administrador') {
        router.push('/admin')
      } else if (role === 'Usuario') {
        router.push('/user')
      } else if (role === 'Empresa') {
        router.push('/company')
      } else {
        router.push('/delivery')
      }
    } else {
      router.push('/')
    }
  }

  return (
    <>
      <section className='flex flex-col items-center justify-center h-screen'>
        <div className='orange_gradient_text flex flex-row items-center'>
          <Logo width={100} height={100} className='mr-4' />
          <div className='flex flex-col'>
            <h1 className='text-5xl font-bold text-center self-start'>401</h1>
            <p className='text-6xl font-bold text-center'>AlChilazo</p>
          </div>
        </div>
        <section className='width-4xl orange_gradient mt-8 p-8 rounded-lg flex flex-col gap-4'>
          <p className='text-3xl font-bold text-center'>No Autorizado</p>
          <p className='text-xl text-center'>No tienes permiso para acceder a esta página.</p>
          <button className='black_btn self-end' onClick={handleClick}>
            Volver al Inicio
          </button>
        </section>
      </section>
    </>
  )
}

export default Page
