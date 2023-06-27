import Navbar from '@/components/Navbar'

const dropdown = {
  title: 'Pedidos',
  styles: 'min-w-[150px]',
  items: [
    {
      linkTo: '/delivery/available-orders',
      text: 'Solicitudes de entrega'
    },
    {
      linkTo: '/delivery/assigned-order',
      text: 'Pedido asignado'
    },
    {
      linkTo: '/delivery/order-history',
      text: 'Historial de pedidos'
    }
  ]
}

const liItems = [
  {
    linkTo: '/delivery',
    text: 'Inicio'
  },

  {
    linkTo: '/delivery/my-profile',
    text: 'Mi perfil'
  }
]

export default function DeliveryProfile ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar liElements={liItems} dropdown={dropdown} />
      <div>{children}</div>
    </>
  )
}
