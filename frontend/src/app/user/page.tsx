import Navbar from '@/components/Navbar'

const liItems = [
  {
    linkTo: '/user/categories',
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

function Page () {
  return (
    <>
      <Navbar dropdown={undefined} liElements={liItems} />
      <div className='text-white my-[100px]'>Usuario</div>
    </>
  )
}

export default Page
