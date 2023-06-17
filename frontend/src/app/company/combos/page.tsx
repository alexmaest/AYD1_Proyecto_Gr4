'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import ComboCard from '@/components/ComboCard'
import { Combo } from '@/types/interfaces'
import baseUrl from '@/constants/baseUrl'

function Page () {
  const { data: session } = useSession()

  const [combos, setCombos] = useState<Combo[]>([])

  const email = ((session?.user?.email) != null) ? session.user.email : ''

  useEffect(() => {
    const getCombos = async () => {
      try {
        const res = await fetch(`${baseUrl}/company/controlPanel/combos/${email}`)
        const data = await res.json()
        setCombos(data)
      } catch (error: any) {
        alert(error.message)
      }
    }
    if (email !== '') void getCombos()
  }, [email])

  // const handleDelete = async (id: number) => {
  //   try {
  //     const res = await fetch(`${baseUrl}/company/combos/${id}`, {
  //       method: 'DELETE'
  //     })
  //     const data = await res.json()
  //     alert(data.message)
  //   } catch (error: any) {
  //     alert(error.message)
  //   }
  // }

  // const handleEdit = (id: number) => {
  //   try {
  //     router.push(`/company/combos/${id}`)
  //   } catch (error: any) {
  //     alert(error.message)
  //   }
  // }

  return (
    <div className='container w-4/5 my-20 mx-auto'>
      <section className='w-full flex flex-col'>
        <div className='w-full flex flex-row pb-2 border-b-2 border-al-yellow'>
          <h1 className='grow text-3xl font-semibold'>Combos</h1>
          <Link className='outline_btn w-[200px]' href='/company'>
            Agregar
          </Link>
        </div>
        <div className='grid gap-4 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-3 mt-8'>
          {combos.map((combo) => (
            <ComboCard combo={combo} key={combo.id} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Page
