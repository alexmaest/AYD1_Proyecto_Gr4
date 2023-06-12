import baseUrl from '@/constants/baseUrl'
import useSWR from 'swr'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  return await res.json()
}

const useDepartment = () => {
  const { data, error, isLoading } = useSWR(`${baseUrl}/department`, fetcher)

  return {
    departments: data,
    isLoading,
    error
  }
}

export default useDepartment
