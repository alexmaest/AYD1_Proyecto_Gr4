'use client'

import { useEffect, useState } from 'react'
import baseUrl from '@/constants/baseUrl'
import Spinner from '@/components/Spinner'
import { Rating } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'

interface Delivery {
  deliveryMan_id: number
  first_name: string
  last_name: string
  average_rating: number
}

function Page () {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getCompanies = async () => {
      try {
        const response = await fetch(`${baseUrl}/admin/deliveryTop5`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        setDeliveries(data)
        setIsLoading(false)
      } catch (error) {
        alert(error)
      }
    }
    void getCompanies()
  }, [])

  return (
    <div className='container w-4/5 my-24 mx-auto'>
      <h1 className='text-center text-5xl orange_gradient_text font-bold mb-8'>
        Top 5 Repartidores
      </h1>
      <section className='w-full mb-8'>
        {isLoading && (
          <div className='flex justify-center items-center'>
            <Spinner />
          </div>
        )}
        <div className='flex flex-col w-full gap-4'>
          {!isLoading && (
            <>
              {deliveries.map((delivery, index) => (
                <div
                  key={delivery.deliveryMan_id}
                  className='flex flex-row justify-between items-center border-2 border-al-orange rounded-lg shadow-lg p-4'
                >
                  <h2 className='font-bold text-xl capitalize'>{index + 1}. {delivery.first_name} {delivery.last_name}</h2>
                  <Rating
                    style={{ maxWidth: 150 }}
                    value={delivery.average_rating}
                    readOnly
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default Page
