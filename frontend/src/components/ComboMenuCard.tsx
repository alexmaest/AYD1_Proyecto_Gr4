interface Product {
  id: number
  name: string
  quantity: number
}

export default function ComboMenuCard ({ name, description, price, image, category, products }:
{ name: string, description: string, price: number, image: string, category: string, products: Product[] }) {
  return (
    <div className='flex justify-center items-center border-gray-500 space-x-2'>
      <div className='w-1/3 h-[200px] flex items-center justify-center'>
        <img src={image} alt={name} className='flex flex-1 object-contain w-[200px] h-[200px]' />
      </div>
      <div className='w-2/3 items-center'>
        <h1 className='text-3xl font-bold'>{name}</h1>
        <p className='text-sm text-white'>{description}</p>
        <span
          className='font-light'
        >
          #{category}
        </span>
        <p className='text-xl text-white'>Q. {price}</p>
        <div className='flex flex-row space-x-1'>
          {
                products?.map((product) => (
                  <p
                    key={product.id}
                    className='text-sm text-yellow-200'
                  >{product.quantity}x {product.name}
                  </p>
                ))
            }
        </div>
      </div>
      <div>
        <button className='yellow_btn'>Pedir</button>
      </div>
    </div>
  )
}
