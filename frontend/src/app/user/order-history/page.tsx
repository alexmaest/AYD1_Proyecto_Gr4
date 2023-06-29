'use client'

import baseUrl from '@/constants/baseUrl'
import { UserOrderHistory } from '@/types/interfaces'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function Page () {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<UserOrderHistory[]>([])

  useEffect(() => {
    const getOrders = async () => {
      if (session?.user.id == null) return
      try {
        const res = await fetch(`${baseUrl}/user/dashboard/history/${session?.user.id.toString() ?? ''}`)

        if (!res.ok) throw new Error(`Something went wrong, error: ${res.status}`)

        const data = await res.json()

        setOrders(data)
      } catch (error) {
        console.error(error)
      }
    }

    void getOrders()
  }, [session?.user.id])

  return (
    <section className='py-28 px-2 h-screen'>
      <h1 className='text-2xl text-orange-600 font-bold'>Order History</h1>
      <div className='flex flex-wrap space-x-4 justify-center my-4'>
        {
          orders.map((order) => (
            <section key={order.order_id}>
              <h2 className=''>Order ID: {order.order_id}</h2>
              <p className=''>Order Date: {order.order_date.toString()}</p>
              <p className=''>Order Status: {order.state}</p>
              <p className=''>Order Total: Q. {order.total}</p>
              <p className=''>Order Items:</p>
              <ul className='flex flex-col'>
                {
                  order.products.map((product) => (
                    <li key={product.id}>
                      <p className='text-xs'>Product ID: {product.id}</p>
                      <p className='text-xs'>Product Price: {product.unitary_price}</p>
                      <p className='text-xs'>Product Quantity: {product.quantity}</p>
                    </li>
                  )
                  )
                }
                {
                  order.products.map((product) => (
                    <li key={product.id}>
                      <p className='text-xs'>Product ID: {product.id}</p>
                      <p className='text-xs'>Product Price: {product.unitary_price}</p>
                      <p className='text-xs'>Product Quantity: {product.quantity}</p>
                    </li>
                  )
                  )
                }
              </ul>
            </section>
          ))
        }
      </div>
    </section>
  )
}
