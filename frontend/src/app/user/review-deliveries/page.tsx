'use client'
import { useSession } from 'next-auth/react'
import baseUrl from '@/constants/baseUrl'
import { useEffect, useState } from 'react'
import { OrdersDelivered } from '@/types/interfaces'
import { Rating } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'

export default function Page () {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<OrdersDelivered[]>([])
  const [rating, setRating] = useState(3)
  const [description, setDescription] = useState('')

  useEffect(() => {
    const getOrders = async () => {
      if (session?.user.id == null) return
      try {
        const res = await fetch(`${baseUrl}/user/dashboard/ordersDelivered/${session?.user.id.toString() ?? ''}`)

        if (!res.ok) throw new Error(`Something went wrong, error: ${res.status}`)

        const data = await res.json()

        setOrders(data)
      } catch (error) {
        console.error(error)
      }
    }
    void getOrders()
  }, [session?.user.id])

  const handleSetRaiting = async (orderId: number) => {
    const body = {
      orderId,
      calification: rating,
      description
    }

    try {
      const res = await fetch(`${baseUrl}/user/dashboard/qualifyDeliveryMan`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        })

      if (!res.ok) throw new Error(`Something went wrong, error: ${res.status}`)

      if (res.ok) {
        alert('Calificación enviada')
        setDescription('')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value)
  }

  if (session?.user.id == null) {
    return (
      <section className='py-28 px-2 h-screen'>
        <h1 className='text-2xl text-orange-600 font-bold'>Cargando...</h1>
      </section>
    )
  }
  return (
    <section className='py-28 px-2 h-screen'>
      <h1 className='text-2xl text-orange-600 font-bold'>Review Deliveries</h1>
      <div className='my-4 grid grid-cols-6'>
        {
                orders.map((order) => (
                  <section key={order.order_id}>
                    <h2 className='text-yellow-500'>Order ID: {order.order_id}</h2>
                    <p>{order.state}</p>
                    <ul className='flex flex-col'>
                      {
                                order.products.map((product) => (
                                  <li key={product.id} className='flex'>
                                    <p className='text-xs'>x {product.quantity} {product.name}</p>
                                  </li>
                                )
                                )
                            }
                      {
                                order.combos.map((combo) => (
                                  <li key={combo.id} className='flex'>
                                    <p className='text-xs'>x {combo.quantity} {combo.name}</p>
                                  </li>
                                )
                                )
                            }
                    </ul>
                    <input
                      id='description'
                      name='description'
                      className='bg-transparent text-sm'
                      type='text'
                      placeholder='Danos tu opinión'
                      value={description}
                      onChange={handleDescription}
                    />
                    <Rating style={{ maxWidth: 120 }} value={rating} onChange={setRating} />
                    <button>
                      <span className='text-xs text-white bg-yellow-500 rounded-md px-2 py-1' onClick={async () => await handleSetRaiting(order.order_id)}>Calificar</span>
                    </button>
                  </section>
                ))
            }
      </div>
    </section>
  )
}
