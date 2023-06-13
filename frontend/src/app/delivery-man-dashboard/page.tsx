import Card from '@/components/Card'
import DeliveryNavbar from '@/components/DeliveryNavbar'

export default function DeliveryManDashboard () {
  const cards = [
    {
      title: 'Solicitudes de entrega',
      description: 'Listado de pedidos que se han solicitado para entrega.',
      image: './deliveries.webp'
    },
    {
      title: 'Pedidos asignados',
      description: 'Mira los pedidos que tienes asignados para entrega.',
      image: './order.webp'
    },
    {
      title: 'Mi perfil',
      description: 'Actualiza tus datos personales y de contacto.',
      image: './delivery.webp'
    },
    {
      title: 'HIstorial de pedidos',
      description: 'Mira los pedidos que has entregado.',
      image: './record.webp'
    }
  ]

  return (
    <>
      <DeliveryNavbar />
      <div className='h-screen '>
        <div className='container mx-auto py-28 px-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
            {cards.map((card, index) => (
              <Card key={index} title={card.title} description={card.description} image={card.image} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
