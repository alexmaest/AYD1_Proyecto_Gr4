import baseUrl from '@/constants/baseUrl'
import useSWR from 'swr'

interface Companies {
  company_id: number
  name: string
  description: string
}

interface Categories {
  category_id: number
  description: string
  image: string
  companies: Companies[]
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  return await res.json()
}

const useCategories = () => {
  const { data, error, isLoading } = useSWR(`${baseUrl}/user/dashboard/categories`, fetcher)

  return {
    categories: data as Categories[],
    isLoading,
    error
  }
}

export default useCategories
