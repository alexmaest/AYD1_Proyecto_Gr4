import Navbar from '@/components/Navbar'

const liItems = [
  {
    linkTo: '/delivery/requests',
    text: 'Solicitudes de entrega'
  },
  {
    linkTo: '/delivery/assigned-orders',
    text: 'Pedidos asignados'
  },
  {
    linkTo: '/delivery/my-profile',
    text: 'Mi perfil'
  },
  {
    linkTo: '/delivery/order-history',
    text: 'Historial de pedidos'
  }
]

export default function DeliveryProfile ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar liElements={liItems} />
      <div>{children}</div>
    </>
  )
}
