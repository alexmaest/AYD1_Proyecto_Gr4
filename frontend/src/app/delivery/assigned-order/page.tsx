'use client'

import baseUrl from '@/constants/baseUrl'
import { DeliveryOrder } from '@/types/interfaces'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import DeliveryOrderCard from '@/components/DeliveryOrderCard'
import Spinner from '@/components/Spinner'

function Page () {
  const { data: session, status } = useSession()
  const [order, setOrder] = useState<DeliveryOrder | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const id = session?.user?.id

  useEffect(() => {
    if (id === undefined) return
    const fetchOrder = async () => {
      const res = await fetch(`${baseUrl}/deliveryMan/orderPending/${id}`)
      const data = await res.json()
      setOrder(data[0])
      setIsLoading(false)
    }
    void fetchOrder()
  }, [id])

  return (
    <div className='container w-4/5 my-24 mx-auto'>
      <div className='w-full flex flex-row pb-2 border-b-2 border-al-yellow'>
        <h1 className='grow text-3xl font-semibold'>Orden por Entregar</h1>
      </div>
      <div className='mt-8 gap-4'>
        {(status === 'loading' || isLoading) && <Spinner />}
        {(status === 'authenticated' && (order === null || order === undefined)) && (
          <h2 className='text-2xl font-semibold'>No haz seleccionado una orden para entregar</h2>
        )}
        {(status === 'authenticated' && order !== null && order !== undefined) && (
          <DeliveryOrderCard key={order.order_id} order={order} userId={id} setOrders={setOrder} deliver />
        )}
      </div>
    </div>
  )
}

export default Page
