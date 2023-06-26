import CompanyOrderCard from '@/components/CompanyOrderCard'

const mockOrder = {
  id: 1,
  products: [
    {
      id: 1,
      name: 'Big Mac',
      price: 50,
      quantity: 2
    },
    {
      id: 2,
      name: 'Coca Cola',
      price: 20,
      quantity: 1
    }
  ],
  combos: [
    {
      id: 1,
      name: 'Combo 1',
      price: 70,
      quantity: 1
    }
  ],
  total: 140,
  status: 'pendiente',
  createdAt: '2021-10-10T00:00:00.000Z',
  indications: 'Sin cebolla'
}

function Page () {
  return (
    <div className='container w-4/5 my-24 mx-auto'>
      <div className='w-full flex flex-row pb-2 border-b-2 border-al-yellow'>
        <h1 className='grow text-3xl font-semibold'>Ordenes Entrantes</h1>
      </div>
      <div className='flex flex-col flex-wrap justify-center mt-8'>
        <CompanyOrderCard {...mockOrder} />
      </div>
    </div>
  )
}

export default Page
