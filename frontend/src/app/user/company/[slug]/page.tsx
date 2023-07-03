'use client'
import Pagination from '@/components/Pagination'
import ComboMenuCard from '@/components/ComboMenuCard'
import ProductMenuCard from '@/components/ProductMenuCard'
import baseUrl from '@/constants/baseUrl'
import { useEffect, useState } from 'react'

interface Company {
  category: string
  department: string
  description: string
  email: string
  id: number
  municipality: string
  name: string
  zone: string
}

interface Products {
  category: string
  description: string
  id: number
  image: string
  name: string
  price: number
}

interface Combo {
  category: string
  description: string
  id: number
  image: string
  name: string
  price: number
  products: Product[]
}

interface Product {
  id: number
  name: string
  quantity: number
}

export default function Page ({ params }: { params: { slug: string } }) {
  const [productTab, setProductTab] = useState<boolean>(true)
  const [comboTab, setComboTab] = useState<boolean>(false)
  const [products, setProducts] = useState<Products[]>([])
  const [combos, setCombos] = useState<Combo[]>([])
  const [productAdded, setProductAdded] = useState(false)
  const [comboAdded, setComboAdded] = useState(false)
  const [selectedProductCard, setSelectedProductCard] = useState<number>(0)
  const [selectedComboCard, setSelectedComboCard] = useState<number>(0)
  const [company, setCompany] = useState<Company>({
    category: '',
    department: '',
    description: '',
    email: '',
    id: 0,
    municipality: '',
    name: '',
    zone: ''
  })

  const fetcher = async (url: string) => {
    const res = await fetch(url)
    const data = await res.json()
    return data
  }

  useEffect(() => {
    const getCompany = async () => {
      const data = await fetcher(`${baseUrl}/user/dashboard/company/${params.slug}`)
      setCompany(data)
    }

    void getCompany()
  }, [params.slug])

  useEffect(() => {
    const getProducts = async () => {
      const data = await fetcher(`${baseUrl}/user/dashboard/company/products/${params.slug}`)
      setProducts(data)
    }
    void getProducts()
  }, [productTab, params.slug])

  useEffect(() => {
    const getCombos = async () => {
      const data = await fetcher(`${baseUrl}/user/dashboard/company/combos/${params.slug}`)
      setCombos(data)
    }

    void getCombos()
  }, [comboTab, params.slug])

  return (
    <section className='py-28 px-2 h-screen'>
      <div className=''>
        {company.category !== ''
          ? (<h1 className='text-xl font-bold text-orange-500 mb-3'>{company.category}</h1>)
          : (
            <h1 className='text-xl font-bold text-orange-500 mb-3'>Cargando...</h1>
            )}
        {company.category !== ''
          ? (<h2 className='text-2xl font-bold mb-3'>{company.name}</h2>)
          : (
            <h1 className='text-2xl font-bold mb-3'>Cargando...</h1>
            )}
      </div>
      <div className=' flex flex-row space-x-5'>
        <button
          className='border-2 border-orange-600 rounded-lg px-3 py-2 hover:cursor-pointer'
          onClick={() => {
            setProductTab(true)
            setComboTab(false)
          }}
        >Productos
        </button>
        <button
          className='border-2 border-yellow-600 rounded-lg px-3 py-2 hover:cursor-pointer'
          onClick={() => {
            setProductTab(false)
            setComboTab(true)
          }}
        >Combos
        </button>
      </div>
      <article className='flex justify-center items-center w-full h-3/4 mb-8 my-2'>
        {
          productTab && (
            <div className='flex flex-col w-2/3 p-2'>
              {products.length > 0
                ? (
                  <ProductMenuCard
                    key={products[selectedProductCard]?.id}
                    companyId={company?.id}
                    productAdded={productAdded}
                    setProductAdded={setProductAdded}
                    {...products[selectedProductCard]}
                  />
                  )
                : (
                  <div className='flex flex-col justify-center items-center'>
                    <h2 className='text-2xl font-bold'>No hay productos</h2>
                  </div>
                  )}
            </div>
          )
        }
        {
          comboTab && (
            <div className='flex flex-col w-2/3 p-2'>
              {combos.length > 0
                ? (
                  <ComboMenuCard
                    key={combos[selectedComboCard]?.id}
                    companyId={company?.id}
                    comboAdded={comboAdded}
                    setComboAdded={setComboAdded}
                    {...combos[selectedComboCard]}
                  />
                  )
                : (
                  <div className='flex flex-col justify-center items-center'>
                    <h2 className='text-2xl font-bold'>No hay combos</h2>
                  </div>
                  )}
            </div>
          )
        }
      </article>
      <footer className='flex items-center justify-center'>
        {
        productTab && (
          <Pagination
            amountOfRequests={products.length}
            selectedCard={selectedProductCard}
            setSelectedCard={setSelectedProductCard}
          />
        )
      }
        {
        comboTab && (
          <Pagination
            amountOfRequests={combos.length}
            selectedCard={selectedComboCard}
            setSelectedCard={setSelectedComboCard}
          />
        )
      }
      </footer>
    </section>
  )
}
