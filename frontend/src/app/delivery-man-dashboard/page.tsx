import Card from '@/components/Card'
import DeliveryNavbar from '@/components/DeliveryNavbar'

export default function DeliveryManDashboard () {
  const cards = [
    {
      title: 'Solicitudes de entrega',
      description: 'Listado de pedidos que se han solicitado para entrega.',
      image: './deliveries.webp',
      linkTo: '/delivery-man-dashboard/delivery-requests'
    },
    {
      title: 'Pedidos asignados',
      description: 'Mira los pedidos que tienes asignados para entrega.',
      image: './order.webp',
      linkTo: '/delivery-man-dashboard/assigned-orders'
    },
    {
      title: 'Mi perfil',
      description: 'Actualiza tus datos personales y de contacto.',
      image: './delivery.webp',
      linkTo: '/delivery-man-dashboard/my-profile'
    },
    {
      title: 'HIstorial de pedidos',
      description: 'Mira los pedidos que has entregado.',
      image: './record.webp',
      linkTo: '/delivery-man-dashboard/order-history'
    }
  ]

  return (
    <>
      <DeliveryNavbar />
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
