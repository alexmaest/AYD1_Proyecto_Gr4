'use client'

import { useEffect, useState } from 'react'
import baseUrl from '@/constants/baseUrl'

interface Request {
  cambio_ubicacion_id: number
  repartidor_id: number
  nombres: string
  apellidos: string
  departamento_origen_id: number
  departamento_origen: string
  municipio_origen_id: number
  municipio_origen: string
  departamento_destino_id: number
  departamento_destino: string
  municipio_destino_id: number
  municipio_destino: string
  motivo_solicitud: string
  fecha_solicitud: string
  estado_solicitud_id: number
}

function Page () {
  const [requests, setRequests] = useState<Request[]>([])

  const fetchRequests = async () => {
    const response = await fetch(`${baseUrl}/admin/deliveryChangeLocationRequests`)
    const data = await response.json()
    setRequests(data)
  }

  const approveRequest = async (id: number) => {
    try {
      const response = await fetch(`${baseUrl}/admin/deliveryChangeLocationRequestsApprove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          request_id: id,
          state: 'Aprobado'
        })
      })
      if (response.ok) {
        alert('Solicitud aprobada')
        void fetchRequests()
      }
    } catch (error) {
      alert('No se pudo aprobar la solicitud')
    }
  }

  const rejectRequest = async (id: number) => {
    try {
      const response = await fetch(`${baseUrl}/admin/deliveryChangeLocationRequestsApprove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          request_id: id,
          state: 'Rechazado'
        })
      })
      if (response.ok) {
        alert('Solicitud rechazada')
        void fetchRequests()
      }
    } catch (error) {
      alert('No se pudo rechazar la solicitud')
    }
  }

  useEffect(() => {
    void fetchRequests()
  }, [])

  return (
    <div className='my-24 w-4/5 mx-auto'>
      <h1 className='orange_gradient_text text-4xl text-center font-bold'>
        Solicitudes de Cambio de Ubicación
      </h1>
      {
        requests.length === 0 && (
          <h2 className='text-center text-al-white text-2xl font-bold mt-4'>
            No hay solicitudes de cambio de ubicación
          </h2>
        )
      }
      <section className='w-full grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 mt-4 gap-4'>
        {
        requests.map((request: Request) => (
          <div className='flex flex-col bg-slate-400 w-full rounded-lg p-4' key={request.cambio_ubicacion_id}>
            <span className='text-al-black text-lg font-bold mt-2'>Repartidor</span>
            <span className='text-al-black text-lg capitalize'>{request.nombres} {request.apellidos}</span>
            <span className='text-al-black text-lg font-bold mt-2'>Ubicación Actual</span>
            <span className='text-al-black text-lg'>{request.departamento_origen}, {request.municipio_origen}</span>
            <span className='text-al-black text-lg font-bold mt-2'>Ubicación Nueva</span>
            <span className='text-al-black text-lg'>{request.departamento_destino}, {request.municipio_destino}</span>
            <span className='text-al-black text-lg font-bold mt-2'>Motivo</span>
            <span className='text-al-black text-lg'>{request.motivo_solicitud}</span>
            <span className='text-al-black text-lg font-bold mt-2'>Fecha de Solicitud</span>
            <span className='text-al-black text-lg'>{new Date(request.fecha_solicitud).toLocaleString()}</span>
            <span className='text-al-black text-lg font-bold mt-2'>Estado</span>
            <div className='flex justify-end gap-2 mt-2 lg:flex-row md:flex-col sm:flex-col flex-row'>
              <button
                className='yellow_btn'
                onClick={async () => await approveRequest(request.cambio_ubicacion_id)}
              >
                Aprobar
              </button>
              <button
                className='black_btn'
                onClick={async () => await rejectRequest(request.cambio_ubicacion_id)}
              >
                Rechazar
              </button>
            </div>
          </div>
        ))
        }
      </section>
    </div>
  )
}

export default Page
