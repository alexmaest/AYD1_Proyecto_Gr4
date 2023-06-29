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
      <div className='my-4 grid grid-cols-6'>
        {
          orders.map((order) => (
            <section key={order.order_id}>
              <h2 className='text-yellow-500'>Order ID: {order.order_id}</h2>
              <p>Order Date: {order.order_date.toString()}</p>
              <p>Order Status: {order.state}</p>
              <p>Order Total: Q. {order.total}</p>
              <p>Order Items:</p>
              <ul className='flex flex-col'>
                {
                  order.products.map((product) => (
                    <li key={product.id} className='py-2'>
                      <p className='text-xs'>Product ID: {product.id}</p>
                      <p className='text-xs'>Product Name: {product.name}</p>
                      <p className='text-xs'>Product Quantity: {product.quantity}</p>
                      <p className='text-xs'>Product Price: Q. {product.unitary_price}</p>
                    </li>
                  )
                  )
                }
                {
                  order.combos.map((combo) => (
                    <li key={combo.id} className='py-2'>
                      <p className='text-xs'>Combo ID: {combo.id}</p>
                      <p className='text-xs'>Combo Name: {combo.name}</p>
                      <p className='text-xs'>Combo Quantity: {combo.quantity}</p>
                      <p className='text-xs'>Combo Price: Q. {combo.unitary_price}</p>
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
