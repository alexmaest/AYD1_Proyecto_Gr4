'use client'

function CompanyOrderCard (order: any) {
  const handlePrepare = () => {
    if (order.status === 'preparando') {
      alert('La orden ya esta siendo preparada')
    }
    console.log('preparando')
  }

  const handleDeliver = () => {
    if (order.status === 'pendiente') {
      alert('La orden no esta preparada')
    }
    console.log('entregando')
  }
  return (
    <div className='flex flex-col rounded overflow-hidden bg-slate-400'>
      <div className='px-6 py-4'>
        <span className='flex flex-row'>
          <h2 className='grow font-bold text-xl mb-2'>Orden #{order.id}</h2>
          <p className='text-2xl font-bold text-al-black'>Q.{order.total}</p>
        </span>
        <span className='flex flex-row'>
          <p className='text-gray-700 font-semibold text-base'>
            Indicaciones: <br /> {order.indications}
          </p>
          <p className='text-gray-700 text-base font-semibold ml-auto'>
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </span>
      </div>
      <div className='px-6 pb-2'>
        <p className='font-bold text-al-black mb-2'>Productos</p>
        {order.products?.map((product: any) => (
          <span
            key={product.id}
            className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'
          >
            {product.quantity} x {product.name}
          </span>
        ))}
      </div>
      <div className='px-6 pb-2'>
        <p className='font-bold text-al-black mb-2'>Combos</p>
        {order.combos?.map((combo: any) => (
          <span
            key={combo.id}
            className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'
          >
            {combo.quantity} x {combo.name}
          </span>
        ))}
      </div>
      <div className='px-6 pb-4 flex flex-row items-end'>
        <div>
          <p className='font-bold text-al-black mb-2'>Estado</p>
          <span
            className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 capitalize mr-2 mb-2'
          >
            {order.status}
          </span>
        </div>
        <div className='ml-auto flex flex-row'>
          <button className='black_btn mr-2' onClick={handleDeliver}>
            Entregar
          </button>
          <button className='yellow_btn' onClick={handlePrepare}>
            Preparar
          </button>
        </div>
      </div>
    </div>
  )
}

export default CompanyOrderCard
