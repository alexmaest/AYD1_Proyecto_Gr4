'use client'
import baseUrl from '@/constants/baseUrl'
import { CompanyOrder } from '@/types/interfaces'
import { useEffect, useState } from 'react'

function CompanyOrderCard ({ order, setOrders }: { order: CompanyOrder, setOrders: any }) {
  const [stateColor, setStateColor] = useState('')
  const handlePrepare = async () => {
    try {
      const res = await fetch(`${baseUrl}/company/orderAccept/${order.order_id}`, {
        method: 'PUT'
      })
      if (res.status === 200) {
        alert('La orden se ha comenzado a preparar')
        setOrders((prev: CompanyOrder[]) => {
          const index = prev.findIndex((o: CompanyOrder) => o.order_id === order.order_id)
          prev[index].state_id = 'En proceso'
          return [...prev]
        }
        )
      }
    } catch (error) {
      alert('Ha ocurrido un error al intentar preparar la orden')
    }
  }

  const handleDeliver = async () => {
    try {
      const res = await fetch(`${baseUrl}/company/orderReady/${order.order_id}`, {
        method: 'PUT'
      })
      if (res.status === 200) {
        alert('La orden se ha entregado')
        setOrders((prev: CompanyOrder[]) => {
          const index = prev.findIndex((o: CompanyOrder) => o.order_id === order.order_id)
          prev[index].state_id = 'Entregado'
          return [...prev]
        }
        )
      }
    } catch (error) {
      alert('Ha ocurrido un error al intentar entregar la orden')
    }
  }

  useEffect(() => {
    switch (order.state_id) {
      case 'Pendiente':
        setStateColor('bg-red-200')
        break
      case 'En proceso':
        setStateColor('bg-yellow-200')
        break
      default:
        setStateColor('bg-green-200')
        break
    }
  }, [order.state_id])

  return (
    <div className='flex flex-col rounded overflow-hidden bg-slate-400'>
      <div className='px-6 py-4'>
        <span className='flex flex-row'>
          <h2 className='grow font-bold text-xl mb-2'>Orden #{order.order_id}</h2>
          <p className='text-2xl font-bold text-al-black'>Q.{order.total}</p>
        </span>
        <span className='flex flex-row'>
          <p className='text-gray-700 font-semibold text-base'>
            Indicaciones: <br /> {order.description}
          </p>
          <p className='text-gray-700 text-base font-semibold ml-auto'>
            {new Date(order.order_date).toLocaleString()}
          </p>
        </span>
      </div>
      <div className='px-6 pb-2'>
        <p className='font-bold text-al-black mb-2'>Productos</p>
        {order.products?.map((product: any) => (
          <span
            key={product.id}
            className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'
          >
            {product.quantity} x {product.name}
          </span>
        ))}
      </div>
      <div className='px-6 pb-2'>
        <p className='font-bold text-al-black mb-2'>Combos</p>
        {order.combos?.map((combo: any) => (
          <span
            key={combo.id}
            className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'
          >
            {combo.quantity} x {combo.name}
          </span>
        ))}
      </div>
      <div className='px-6 pb-4 flex flex-row items-end'>
        <div className='mr-4'>
          <p className='font-bold text-al-black mb-2'>Estado</p>
          <span
            className={'inline-block rounded-full px-3 py-1 text-sm font-semibold text-gray-700 capitalize mr-2 mb-2 ' + stateColor}
          >
            {order.state_id}
          </span>
        </div>
        <div>
          <p className='font-bold text-al-black mb-2'>Tarjeta de Crédito</p>
          <span
            className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 capitalize mr-2 mb-2'
          >
            {order.card_number}
          </span>
        </div>
        <div className='ml-auto'>
          {
            order.state_id === 'Pendiente'
              ? (
                <button className='yellow_btn' onClick={handlePrepare}>
                  Preparar
                </button>)
              : (
                <button className='black_btn' onClick={handleDeliver}>
                  Entregar
                </button>)
          }
        </div>
      </div>
    </div>
  )
}

export default CompanyOrderCard
