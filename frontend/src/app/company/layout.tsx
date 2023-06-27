import Navbar from '@/components/Navbar'

const dropdown = {
  title: 'Panel de Control',
  styles: 'min-w-[150px]',
  items: [
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
}

const liItems = [
  {
    linkTo: '/company',
    text: 'Inicio'
  },
  {
    linkTo: '/company/orders',
    text: 'Pedidos'
  },
  {
    linkTo: '/company/reports',
    text: 'Reportes'
  }
]

export default function CompanyLayout ({
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
