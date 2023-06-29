'use client'

import Spinner from '@/components/Spinner'
import { DeliveryHistory } from '@/types/interfaces'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Rating } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'
import baseUrl from '@/constants/baseUrl'

function Page () {
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<DeliveryHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterBy, setFilterBy] = useState('Todos')
  const [filtrar, setFiltrar] = useState<DeliveryHistory[]>([])
  const id = session?.user?.id

  useEffect(() => {
    if (parseInt(search) < 0) {
      setSearch('')
    }
    if (search === '' && filterBy === 'Todos') {
      setFiltrar(orders)
    } else if (search === '' && filterBy !== 'Todos') {
      setFiltrar(orders.filter((order) => order.state === filterBy))
    } else if (search !== '' && filterBy === 'Todos') {
      setFiltrar(orders.filter((order) => order.order_id === parseInt(search)))
    } else {
      setFiltrar(orders.filter((order) => order.order_id === parseInt(search) && order.state === filterBy))
    }
  }, [search, filterBy, orders])

  useEffect(() => {
    if (id === undefined) return
    const getOrders = async () => {
      try {
        const response = await fetch(`${baseUrl}/deliveryMan/history/${id}`, {
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
        <div className='flex flex-row gap-4'>
          <select
            className='outline_input'
            onChange={(e) => setFilterBy(e.target.value)}
          >
            <option value='Todos'>Todos</option>
            <option value='En camino'>En Camino</option>
            <option value='Entregado'>Entregado</option>
          </select>
          <input
            className='outline_input'
            type='number'
            placeholder='Buscar por ID'
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className='flex flex-col justify-center mt-8 gap-4'>
        {(status === 'loading' || isLoading) && <Spinner />}
        {status === 'authenticated' && orders.length === 0 && <h2 className='text-2xl font-semibold'>Aun no ha escogido una entrega</h2>}
        {status === 'authenticated' && (
          filtrar.map((order, index) => (
            <div key={index} className='flex flex-col overflow-hidden bg-slate-400 text-al-black rounded-md p-4'>
              <div className='flex flex-row justify-between'>
                <p className='text-xl font-semibold'>Orden #{order.order_id}</p>
                <p className='text-xl font-semibold'>{order.state}</p>
              </div>
              <div className='flex flex-row justify-between'>
                <p className='text-lg font-semibold'>Cliente: {order.client_names} {order.last_names}</p>
                <p className='text-lg font-semibold'>Q{order.total}</p>
              </div>
              <div className='flex flex-row justify-between'>
                <p className='text-lg font-semibold'>Teléfono: {order.phone}</p>
                <p className='text-lg font-semibold'>{order.calification_description}</p>
              </div>
              <div className='flex flex-row justify-between'>
                <p className='text-lg font-semibold'>Empresa: {order.company_name}</p>
                <p className='text-lg font-semibold'>{order.order_date}</p>
              </div>
              <div className='flex flex-row justify-between'>
                <p className='text-lg font-semibold'>Departamento: {order.department}</p>
                <p className='text-lg font-semibold'>Municipio: {order.municipality}</p>
              </div>
              {order.calification !== -1 && (
                <div className='flex flex-row justify-end'>
                  <p className='text-lg font-semibold mr-4'>Calificación:</p>
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
