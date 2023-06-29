'use client'
import { useEffect, useState } from 'react'
import DeliveryOrderCard from '@/components/DeliveryOrderCard'
import { DeliveryOrder } from '@/types/interfaces'
import baseUrl from '@/constants/baseUrl'
import { useSession } from 'next-auth/react'
import Spinner from '@/components/Spinner'

function Page () {
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<DeliveryOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const id = session?.user?.id

  useEffect(() => {
    if (id === undefined) return
    console.log(id)
    const fetchOrders = async () => {
      const res = await fetch(`${baseUrl}/deliveryMan/orders/${id}`)
      const data = await res.json()
      setOrders(data)
      setIsLoading(false)
    }
    void fetchOrders()
  }, [id])
  return (
    <div className='container w-4/5 my-24 mx-auto'>
      <div className='w-full flex flex-row pb-2 border-b-2 border-al-yellow'>
        <h1 className='grow text-3xl font-semibold'>Ordenes Disponibles</h1>
      </div>
      <div className='grid grid-cols-2 justify-center mt-8 gap-4'>
        {(status === 'loading' || isLoading) && <Spinner />}
        {status === 'authenticated' && orders.length === 0 && <h2 className='text-2xl font-semibold'>No hay ordenes disponibles</h2>}
        {status === 'authenticated' && (
          orders.map((order: DeliveryOrder) =>
            <DeliveryOrderCard key={order.order_id} setOrders={setOrders} order={order} userId={id} deliver={false} />
          ))}
      </div>
    </div>
  )
}

export default Page
