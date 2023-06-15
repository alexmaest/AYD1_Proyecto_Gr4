import baseUrl from '@/constants/baseUrl'
import useSWR from 'swr'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  return await res.json()
}

const useDeliveryManRequest = () => {
  const { data, error, isLoading } = useSWR(`${baseUrl}/admin/deliveryRequests`, fetcher)

  return {
    deliveryManRequests: data,
    isLoading,
    error
  }
}

export default useDeliveryManRequest
