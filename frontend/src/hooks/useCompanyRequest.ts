import baseUrl from '@/constants/baseUrl'
import { CompanyRequest } from '@/types/interfaces'
import useSWR from 'swr'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  return await res.json()
}

const useCompanyRequest = () => {
  const { data, error, isLoading, mutate } = useSWR(`${baseUrl}/admin/companyRequests`, fetcher)

  return {
    companyRequests: data as CompanyRequest[],
    isLoading,
    error,
    mutate
  }
}

export default useCompanyRequest
