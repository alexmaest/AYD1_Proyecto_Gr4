import Navbar from '@/components/Navbar'
const liItems = [
  {
    linkTo: '/company/products',
    text: 'Productos'
  },
  {
    linkTo: '/company/control-panel',
    text: 'Panel de control'
  },
  {
    linkTo: '/company/orders',
    text: 'Pedidos'
  },
  {
    linkTo: '/company/combos',
    text: 'Combos'
  },
  {
    linkTo: '/company/reports',
    text: 'Reportes'
  }
]
function Page () {
  return (
    <>
      <Navbar dropdown={undefined} liElements={liItems} />
      <div>Page</div>
    </>
  )
}

export default Page
