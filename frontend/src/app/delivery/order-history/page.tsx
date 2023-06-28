'use client'

import Spinner from '@/components/Spinner'
import { DeliveryHistory } from '@/types/interfaces'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Rating } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'

function Page () {
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<DeliveryHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const id = session?.user?.id

  useEffect(() => {
    if (id === undefined) return
    const getOrders = async () => {
      try {
        const response = await fetch(`/api/deliveryMan/history/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        setOrders(data)
        setIsLoading(false)
      } catch (error: any) {
        alert(error.message)
      }
    }
    void getOrders()
  }, [id])

  return (
    <div className='container w-4/5 my-24 mx-auto'>
      <div className='w-full flex flex-row pb-2 border-b-2 border-al-yellow'>
        <h1 className='grow text-3xl font-semibold'>Historial de Pedidos</h1>
      </div>
      <div className='flex flex-col justify-center mt-8 gap-4'>
        {(status === 'loading' || isLoading) && <Spinner />}
        {status === 'authenticated' && orders.length === 0 && <h2 className='text-2xl font-semibold'>Aun no ha escogido una entrega</h2>}
        {status === 'authenticated' && (
          orders.map((order, index) => (
            <div key={index} className='flex flex-col overflow-hidden bg-slate-400 text-al-black rounded-md p-4'>
              <div className='flex flex-row justify-between'>
                <h2 className='text-2xl font-semibold'>Orden #{order.order_id}</h2>
                <h2 className='text-2xl font-semibold'>{order.state}</h2>
              </div>
              <div className='flex flex-row justify-between'>
                <h2 className='text-xl font-semibold'>Cliente: {order.client_names} {order.last_names}</h2>
                <h2 className='text-xl font-semibold'>Q{order.total}</h2>
              </div>
              <div className='flex flex-row justify-between'>
                <h2 className='text-xl font-semibold'>Empresa: {order.company_name}</h2>
                <h2 className='text-xl font-semibold'>{order.order_date}</h2>
              </div>
              {order.calification !== -1 && (
                <div className='flex flex-row justify-between'>
                  <h2 className='text-xl font-semibold'>Calificación:</h2>
                  <Rating
                    style={{ maxWidth: 150 }}
                    value={order.calification}
                    readOnly
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Page
