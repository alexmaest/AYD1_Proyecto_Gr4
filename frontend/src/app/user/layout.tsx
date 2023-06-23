import Navbar from '@/components/Navbar'

const liItems = [
  {
    linkTo: '/user',
    text: 'Categorías'
  },
  {
    linkTo: '/user/order',
    text: 'Pedir Producto'
  },
  {
    linkTo: '/user/cart',
    text: 'Carrito'
  },
  {
    linkTo: '/user/coupons',
    text: 'Cupones'
  },
  {
    linkTo: '/user/order-history',
    text: 'Historial de pedidos'
  },
  {
    linkTo: '/user/review-deliveries',
    text: 'Calificar entregas'
  }
]

export default function Layout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar liElements={liItems} />
      <section>{children}</section>
    </>
  )
}
