'use client'

import { useState, useEffect } from 'react'
import Spinner from '@/components/Spinner'
import baseUrl from '@/constants/baseUrl'

interface User {
  user_id: number
  first_names: string
  last_names: string
  email: string
  register_date: string
}

function Page () {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const handleDisable = async (id: number) => {
    try {
      const response = await fetch(`${baseUrl}/admin/userDisabled/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.status === 200) {
        alert('Usuario deshabilitado con éxito!')
        setUsers(users.filter(user => user.user_id !== id))
      } else {
        alert('No se puede deshabilitar el usuario porque aun tiene ordenes pendientes!')
      }
    } catch (error) {
      alert('Hubo un error al intentar deshabilitar el usuario!')
    }
  }

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetch(`${baseUrl}/admin/usersToDisable`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        setUsers(data)
        setIsLoading(false)
      } catch (error: any) {
        alert(error.message)
      }
    }
    void getUsers()
  }, [])

  return (
    <div className='container w-4/5 my-24 mx-auto'>
      <h1 className='text-center text-5xl orange_gradient_text font-bold mb-8'>
        Deshabilitar Usuario
      </h1>
      <section className='w-full mb-8'>
        {isLoading && (
          <div className='flex justify-center items-center'>
            <Spinner />
          </div>
        )}
        <div className='grid gap-4 lg:grid-cols-3 md:grid-cols-2'>
          {!isLoading && (
            users.map((user: User, index: number) => (
              <div key={index} className='flex flex-col overflow-hidden bg-slate-400 text-al-black rounded-md p-4 gap-4'>
                <div className='flex flex-row justify-between'>
                  <p className='text-xl font-semibold'>{user.first_names} {user.last_names}</p>
                  <p className='text-xl font-semibold'>{user.register_date}</p>
                </div>
                <p className='text-xl font-semibold'>{user.email}</p>
                <div className='flex flex-row justify-end'>
                  <button
                    className='black_btn'
                    type='button'
                    onClick={async (e) => { await handleDisable(user.user_id) }}
                  >
                    Deshabilitar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

export default Page
