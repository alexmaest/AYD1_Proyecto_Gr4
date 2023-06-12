import Card from '@/components/Card'
import DeliveryNavbar from '@/components/DeliveryNavbar'

export default function DeliveryManDashboard () {
  const cards = [
    {
      title: 'Solicitudes de entrega',
      description: 'Listado de pedidos que se han solicitado para entrega.',
      image: './listado-entrega.jpg'
    },
    {
      title: 'Card 2',
      description: 'This is the description for Card 2.',
      image: './listado-entrega.jpg'
    },
    {
      title: 'Card 3',
      description: 'This is the description for Card 3.',
      image: './listado-entrega.jpg'
    },
    {
      title: 'Card 4',
      description: 'This is the description for Card 4.',
      image: './listado-entrega.jpg'
    }
  ]

  return (
    <>
      <DeliveryNavbar />
      <div className='h-screen '>
        <div className='container mx-auto py-28'>
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
