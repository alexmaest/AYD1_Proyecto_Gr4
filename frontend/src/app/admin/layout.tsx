import Navbar from '@/components/Navbar'

const liItems = [
  {
    linkTo: '/admin',
    text: 'Inicio'
  },
  {
    linkTo: '/admin/reports',
    text: 'Reportes'
  }
]

export default function DashboardLayout ({
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
