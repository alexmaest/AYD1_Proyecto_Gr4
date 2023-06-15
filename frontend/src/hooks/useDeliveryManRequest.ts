import baseUrl from '@/constants/baseUrl'
import useSWR from 'swr'

interface DeliveryManRequest {
  apellidos: string
  correo: string
  departamento: string
  documento_url: string
  estado_solicitud: string
  fecha_solicitud: Date
  municipio: string
  no_celular: string
  nombres: string
  solicitud_repartidor_id: number
  tiene_vehiculo: string
  tipo_licencia: string
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  return await res.json()
}

const useDeliveryManRequest = () => {
  const { data, error, isLoading, mutate } = useSWR(`${baseUrl}/admin/deliveryRequests`, fetcher)

  return {
    deliveryManRequests: data as DeliveryManRequest[],
    isLoading,
    error,
    mutate
  }
}

export default useDeliveryManRequest
