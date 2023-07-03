'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import CompanyOrderCard from '@/components/CompanyOrderCard'
import baseUrl from '@/constants/baseUrl'
import Spinner from '@/components/Spinner'
import { CompanyOrder } from '@/types/interfaces'

function Page () {
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<CompanyOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const id = session?.user?.id

  useEffect(() => {
    if (id === undefined) return
    const fetchOrders = async () => {
      const res = await fetch(`${baseUrl}/company/orders/${id}`)
      if (res.status === 200) {
        const data = await res.json()
        setOrders(data)
      }
      setIsLoading(false)
    }
    void fetchOrders()
  }, [id])

  return (
    <div className='container w-4/5 my-24 mx-auto'>
      <div className='w-full flex flex-row pb-2 border-b-2 border-al-yellow'>
        <h1 className='grow text-3xl font-semibold'>Ordenes Entrantes</h1>
      </div>
      <div className='flex flex-col flex-wrap justify-center mt-8 gap-4'>
        {(status === 'loading' || isLoading) && <Spinner />}
        {status === 'authenticated' && orders.length === 0 && <h2 className='text-2xl font-semibold'>No se han realizado ordenes!</h2>}
        {status === 'authenticated' && (
          orders.map((order: CompanyOrder) =>
            <CompanyOrderCard key={order.order_id} setOrders={setOrders} order={order} />
          ))}
      </div>
    </div>
  )
}

export default Page
