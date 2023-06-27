'use client'
import baseUrl from '@/constants/baseUrl'
import { DeliveryOrder } from '@/types/interfaces'

interface DeliveryOrderCardProps {
  order: DeliveryOrder
  setOrders: any
  userId: number | undefined
  deliver: boolean
}

function DeliveryOrderCard ({ order, setOrders, userId, deliver }: DeliveryOrderCardProps) {
  const handleAccept = async () => {
    if (userId === undefined) return
    try {
      const res = await fetch(`${baseUrl}/deliveryMan/orderAccept`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId: order.order_id, deliveryManId: userId })
      })
      if (res.status === 200) {
        alert('La orden se ha aceptado')
        setOrders((prev: DeliveryOrder[]) => {
          // remove the order from the list
          const index = prev.findIndex((o: DeliveryOrder) => o.order_id === order.order_id)
          prev.splice(index, 1)
          return [...prev]
        }
        )
      }
    } catch (error) {
      alert('Ha ocurrido un error al intentar aceptar la orden')
    }
  }

  const handleDeliver = async () => {
    try {
      const res = await fetch(`${baseUrl}/deliveryMan/orderDelivered/${order.order_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (res.status === 200) {
        alert('La orden se ha entregado')
        setOrders(null)
      }
    } catch (error) {
      alert('Ha ocurrido un error al intentar entregar la orden')
    }
  }

  return (
    <div className='flex flex-col rounded overflow-hidden bg-slate-400'>
      <div className='flex flex-col gap-2 px-6 py-4 grow'>
        <span className='flex flex-row'>
          <h2 className='grow font-bold text-xl mb-2'>Orden #{order.order_id}</h2>
          <p className='text-2xl font-bold text-al-black'>Q.{order.total}</p>
        </span>
        <span className='flex flex-row text-al-black font-bold'>
          Cliente:&nbsp;
          <p className='text-base font-semibold'>{order.client_names} {order.last_names}</p>
        </span>
        <span className='flex flex-row text-al-black font-bold '>
          Indicaciones:&nbsp;
          <p className='font-semibold text-base'>
            {order.description}
          </p>
        </span>
        <span className='flex flex-row text-al-black font-bold'>
          Empresa:&nbsp;
          <p className='text-base font-semibold'>{order.company_name}</p>
        </span>
        <span className='flex flex-row text-al-black font-bold'>
          Dirección:&nbsp;
          <p className='text-base font-semibold'>{order.municipality}, {order.department}</p>
        </span>
      </div>
      <div className='px-6 pb-4 flex flex-row items-end'>
        <div className='mr-4'>
          <p className='font-bold text-al-black mb-2'>Utilizo Cupón</p>
          <span
            className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 capitalize mr-2 mb-2'
          >
            {order.coupon_applied}
          </span>
        </div>
        <div>
          <p className='font-bold text-al-black mb-2'>Teléfono</p>
          <span
            className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 capitalize mr-2 mb-2'
          >
            {order.phone}
          </span>
        </div>
        {
          !deliver
            ? (
              <button className='ml-auto black_btn' onClick={handleAccept}>
                Aceptar Orden
              </button>
              )
            : (
              <button className='ml-auto black_btn' onClick={handleDeliver}>
                Entregar
              </button>
              )
        }
      </div>
    </div>
  )
}

export default DeliveryOrderCard
