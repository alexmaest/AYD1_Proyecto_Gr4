'use client'
import Pagination from '@/components/Pagination'
import useDeliveryManRequest from '@/hooks/useDeliveryManRequest'
import baseUrl from '@/constants/baseUrl'
import React, { useEffect, useState } from 'react'
import Spinner from '@/components/Spinner'
import SuccessAlert from '@/components/SuccessAlert'

export default function Page () {
  const [selectedCard, setSelectedCard] = useState(0)
  const [isLoadingReject, setIsLoadingReject] = useState(false)
  const [isLoadingAccept, setIsLoadingAccept] = useState(false)
  const [acceptedSuccess, setAcceptedSuccess] = useState(false)
  const [rejectedSuccess, setRejectedSuccess] = useState(false)

  const { deliveryManRequests, isLoading, mutate } = useDeliveryManRequest()

  useEffect(() => {
    if (acceptedSuccess) {
      setTimeout(() => {
        setAcceptedSuccess(false)
        void mutate()
      }, 2000)
    }

    if (rejectedSuccess) {
      setTimeout(() => {
        setRejectedSuccess(false)
        void mutate()
      }, 2000)
    }
  }, [acceptedSuccess, rejectedSuccess, mutate])

  const handleReject = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoadingReject(true)
    const id = deliveryManRequests[selectedCard]?.solicitud_repartidor_id

    const formData = new FormData(event.currentTarget)
    const inputs = Object.fromEntries(formData.entries())

    const { description } = inputs

    try {
      const response = await fetch(`${baseUrl}/admin/deliveryRequests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id,
          state: 'Rechazado',
          description
        })
      })
      if (response.ok) {
        setRejectedSuccess(true)
      } else {
        console.log('Error al rechazar solicitud')
      }
    } catch {
      setIsLoadingReject(false)
      console.log('Error al rechazar solicitud')
    }

    setIsLoadingReject(false)
  }

  const handleAccept = async () => {
    const id = deliveryManRequests[selectedCard]?.solicitud_repartidor_id

    try {
      const response = await fetch(`${baseUrl}/admin/deliveryRequests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id,
          state: 'Aprobado',
          description: ''
        })
      })
      if (response.ok) {
        setAcceptedSuccess(true)
      }
    } catch {
      setIsLoadingReject(false)
      console.log('Error al rechazar solicitud')
    }

    setIsLoadingAccept(isLoading)
  }

  if (deliveryManRequests?.length === 0) {
    return (
      <section className='flex flex-col items-center justify-center sm:my-6 my-12'>
        <div className='py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 flex flex-col justify-center items-center'>
          <div className='mx-auto max-w-screen-md text-center'>
            <h2 className='mb-4 text-xl font-bold text-white'>Sin solicitudes</h2>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className='flex flex-col items-center justify-center sm:my-6 my-12'>
      <div className='py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 flex flex-col justify-center items-center'>
        <div className='mx-auto max-w-screen-md text-center'>
          <h2 className='mb-4 text-xl font-bold text-white'>Solicitudes de repartidor</h2>
          {
            acceptedSuccess && (
              <SuccessAlert title='Solicitud aceptada' description='La solicitud de repartidor ha sido aceptada' />
            )
          }
          {
            rejectedSuccess && (
              <SuccessAlert title='Solicitud rechazada' description='La solicitud de repartidor ha sido rechazada' />
            )
          }
        </div>
        {
          isLoading
            ? (
              <Spinner />
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
                    <li className='flex items-center space-x-3'>
                      <span>Hoja de vida: <a href={deliveryManRequests[selectedCard]?.documento_url} className='font-semibold text-al-yellow'>Descargar</a>
                      </span>
                    </li>
                  </ul>
                  <div className='flex flex-col justify-center'>
                    {
                      isLoadingAccept
                        ? (
                          <Spinner />
                          )
                        : (
                          <button
                            onClick={handleAccept}
                            className='text-white hover:bg-green-500 focus:transition focus:ring-4 focus:ring-al-orange font-medium rounded-lg text-sm px-5 py-2.5 text-center'
                          >Aprobar
                          </button>
                          )
                    }
                    <form action='post' onSubmit={handleReject}>
                      <input
                        name='description'
                        type='text'
                        autoComplete='off'
                        placeholder='Razón de rechazo'
                        className='text-black rounded-lg text-sm px-5 py-2.5 text-center' required
                      />
                      {
                        isLoadingReject
                          ? (
                            <Spinner />
                            )
                          : (
                            <button
                              className='text-white hover:bg-red-500 focus:transition focus:ring-4 focus:ring-al-orange font-medium rounded-lg text-sm px-5 py-2.5 text-center'
                            >Rechazar
                            </button>
                            )
                      }
                    </form>
                  </div>
                </div>
              </div>
              )
        }
        <Pagination selectedCard={selectedCard} setSelectedCard={setSelectedCard} amountOfRequests={deliveryManRequests?.length} />
      </div>
    </section>
  )
}
