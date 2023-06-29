'use client'

import Spinner from '@/components/Spinner'
import baseUrl from '@/constants/baseUrl'
import { CompanyHistory } from '@/types/interfaces'
import { Rating } from '@smastrom/react-rating'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import '@smastrom/react-rating/style.css'

function Page () {
  const { data: session, status } = useSession()
  const [product, setProduct] = useState<{ productName: string, count: number }>({ productName: '', count: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState<CompanyHistory[]>([])
  const [search, setSearch] = useState('')
  const [filterBy, setFilterBy] = useState('Todos')
  const [filtrar, setFiltrar] = useState<CompanyHistory[]>([])
  const [toggleProduct, setToggleProduct] = useState(false)
  const [toggleHistory, setToggleHistory] = useState(false)
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
    const getProduct = async () => {
      try {
        const response = await fetch(`${baseUrl}/company/bestSeller/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        setProduct(data)
      } catch (error: any) {
        alert(error.message)
      }
    }
    void getProduct()
  }, [id])

  useEffect(() => {
    if (id === undefined) return
    const getProducts = async () => {
      try {
        const response = await fetch(`${baseUrl}/company/history/${id}`, {
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
    void getProducts()
  }, [id])

  return (
    <div className='container w-4/5 my-24 mx-auto'>
      <h1 className='text-center text-5xl orange_gradient_text font-bold mb-8'>
        Reportes
      </h1>
      {status === 'loading' && (
        <div className='flex justify-center items-center'>
          <Spinner />
        </div>
      )}
      {!toggleHistory && (
        <section className='w-full flex flex-col mb-8'>
          <div className='w-full flex flex-row pb-2 border-b-2 border-al-yellow'>
            <h2 className='grow text-3xl font-semibold'>Producto Mas Vendido</h2>
            <button
              className='outline_btn w-[200px]'
              onClick={() => setToggleProduct(!toggleProduct)}
              type='button'
            >
              {toggleProduct ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          {toggleProduct && (
            <div className='flex flex-col mx-auto mt-4 p-4 gap-4 rounded-md bg-slate-400'>
              <p className='text-lg font-bold text-al-black'>Nombre: {product.productName}</p>
              <p className='text-lg font-bold text-al-black'>Cantidad: {product.count}</p>
            </div>
          )}
        </section>
      )}
      {!toggleProduct && (
        <section className='w-full flex flex-col mb-8'>
          <div className='w-full flex flex-row pb-2 border-b-2 border-al-yellow'>
            <h2 className='grow text-3xl font-semibold'>Historial de Pedidos</h2>
            <div className='flex flex-row gap-4'>
              <button
                className='outline_btn w-[200px]'
                onClick={() => setToggleHistory(!toggleHistory)}
                type='button'
              >
                {toggleHistory ? 'Ocultar' : 'Mostrar'}
              </button>
              {toggleHistory && (
                <>
                  <select
                    className='outline_input'
                    onChange={(e) => setFilterBy(e.target.value)}
                  >
                    <option value='Todos'>Todos</option>
                    <option value='En camino'>En Camino</option>
                    <option value='Pendiente'>Pendiente</option>
                    <option value='Entregado'>Entregado</option>
                  </select>
                  <input
                    className='outline_input'
                    type='number'
                    placeholder='Buscar por ID'
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </>
              )}
            </div>
          </div>
          {toggleHistory && (
            <div className='flex flex-col justify-center mt-8 gap-4'>
              {!isLoading && (
                filtrar.map((order, index) => (
                  <div key={index} className='flex flex-col overflow-hidden bg-slate-400 text-al-black rounded-md p-4'>
                    <div className='flex flex-row justify-between'>
                      <p className='text-xl font-semibold'>Orden #{order.order_id}</p>
                      <p className='text-xl font-semibold'>{order.state}</p>
                    </div>
                    <div className='flex flex-row justify-between'>
                      <p className='text-lg font-semibold'>Repartidor: {order.deliveryMan_firstNames} {order.deliveryMan_lastNames}</p>
                      <p className='text-lg font-semibold'>{order.order_date}</p>
                    </div>
                    <div className='flex flex-row justify-between'>
                      <p className='text-lg font-semibold'>Cliente: {order.client_firstNames} {order.client_lastNames}</p>
                      <p className='text-lg font-semibold'>Q{order.total}</p>
                    </div>
                    <div className='flex flex-row justify-between'>
                      <p className='text-lg font-semibold'>Teléfono: {order.client_lastNamesphone}</p>
                      <p className='text-lg font-semibold'>{order.calification_description}</p>
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
          )}
        </section>
      )}
    </div>
  )
}

export default Page
