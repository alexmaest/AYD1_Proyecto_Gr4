import Navbar from '@/components/Navbar'

const liItems = [
  {
    linkTo: '/company/orders',
    text: 'Pedidos'
  },
  {
    linkTo: '/company/reports',
    text: 'Reportes'
  },
  {
    linkTo: '/company/products',
    text: 'Productos'
  },
  {
    linkTo: '/company/combos',
    text: 'Combos'
  },
  {
    linkTo: '/company/categories',
    text: 'Categorías'
  }
]

export default function CompanyLayout ({
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
