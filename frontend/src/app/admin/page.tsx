import Card from '@/components/Card'
import Navbar from '@/components/Navbar'

const liItems = [
  {
    linkTo: '/admin-dashboard',
    text: 'Dashboard'
  }
]

export default function DeliveryManDashboard () {
  const cards = [
    {
      title: 'Solicitudes de repartidores',
      description: 'Listado de repartidores que quieren trabajar en la plataforma.',
      image: './delivery-requests.webp',
      linkTo: '/admin-dashboard/delivery-man-requests'
    },
    {
      title: 'Solicitudes de empresas',
      description: 'Listado de empresas que quieren formar parte de la plataforma.',
      image: './company-requests.webp',
      linkTo: '/admin-dashboard/company-requests'
    },
    {
      title: 'Deshabilitar usuario',
      description: 'Deshabilita un usuario de la plataforma.',
      image: './ban-user.webp',
      linkTo: '/admin-dashboard/my-profile'
    },
    {
      title: 'Mantenimiento',
      description: 'Inhabilita tanto repartidores como empresas de la plataforma.',
      image: './maintance.webp',
      linkTo: '/admin-dashboard/maintance'
    }
  ]

  return (
    <>
      <Navbar liElements={liItems} />
      <div className='h-screen '>
        <div className='container mx-auto py-28 px-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
            {cards.map((card, index) => (
              <Card key={index} title={card.title} description={card.description} image={card.image} linkTo={card.linkTo} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
