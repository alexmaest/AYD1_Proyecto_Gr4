'use client'

import Pagination from '@/components/Pagination'
import useDeliveryManRequest from '@/hooks/useDeliveryManRequest'
import { useState } from 'react'

export default function Page () {
  const [selectedCard, setSelectedCard] = useState(0)
  const { deliveryManRequests, isLoading, error } = useDeliveryManRequest()

  console.log({ isLoading }, { error })
  console.log({ deliveryManRequests }, { selectedCard })
  return (
    <section className='flex flex-col items-center justify-center sm:my-6 my-12'>
      <div className='py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 flex flex-col justify-center items-center'>
        <div className='mx-auto max-w-screen-md text-center'>
          <h2 className='mb-4 text-xl font-bold text-white'>Solicitudes de repartidor</h2>
        </div>
        {
          isLoading
            ? (
              <h1>Loading</h1>
              )
            : (
              <div className='space-y-3 lg:grid lg:grid-cols-1 sm:gap-6 xl:gap-10 lg:space-y-0'>
                <div className='flex flex-col p-6 mx-auto max-w-lg text-center rounded-lg border xl:p-8 bg-gray-900 text-white'>
                  <h3 className='mb-4 text-xl font-semibold'>{deliveryManRequests[selectedCard]?.nombres}</h3>
                  <p className='font-light sm:text-lg text-gray-400'>{deliveryManRequests[selectedCard]?.apellidos}</p>
                  <div className='flex justify-center items-baseline my-8'>
                    <span className='mr-2 text-lg font-semibold'>{deliveryManRequests[selectedCard]?.correo}</span>
                    <span className='text-gray-400'> - {deliveryManRequests[selectedCard]?.no_celular}</span>
                  </div>
                  <ul role='list' className='mb-8 space-y-4 text-left'>
                    <li className='flex items-center space-x-3'>
                      <span>Departamento: <span className='font-semibold text-al-yellow'>{deliveryManRequests[selectedCard]?.departamento}</span></span>
                    </li>
                    <li className='flex items-center space-x-3'>
                      <span>Municipio: <span className='font-semibold text-al-yellow'>{deliveryManRequests[selectedCard]?.municipio}</span></span>
                    </li>
                    <li className='flex items-center space-x-3'>
                      <span>Tiene vehículo: <span className='font-semibold text-al-yellow'>{deliveryManRequests[selectedCard]?.tiene_vehiculo}</span></span>
                    </li>
                    <li className='flex items-center space-x-3'>
                      <span>Licencia: <span className='font-semibold text-al-yellow'>{deliveryManRequests[selectedCard]?.tipo_licencia}</span></span>
                    </li>
                    <li className='flex items-center space-x-3'>
                      <span>Fecha solicitud: <span className='font-semibold text-al-yellow'>{new Date(deliveryManRequests[selectedCard]?.fecha_solicitud).toLocaleDateString('es-GT', { timeZone: 'America/Guatemala' })}</span>
                      </span>
                    </li>
                  </ul>
                  <a href={deliveryManRequests[0]?.documento_url} className='text-white hover:bg-al-yellow focus:transition focus:ring-4 focus:ring-al-orange font-medium rounded-lg text-sm px-5 py-2.5 text-center'>Descargar CV</a>
                </div>
              </div>
              )
        }
        <Pagination selectedCard={selectedCard} setSelectedCard={setSelectedCard} amountOfRequests={deliveryManRequests?.length} />
      </div>
    </section>
  )
}
