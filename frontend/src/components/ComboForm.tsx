import { useEffect, useState } from 'react'
import { Category, Product, ComboProduct } from '@/types/interfaces'
import Image from 'next/image'
import baseUrl from '@/constants/baseUrl'

interface IComboForm {
  categories: Category[]
  products: Product[]
  email: string | null | undefined
}

const imageMimeType = /image\/(png|jpg|jpeg)/i
const categoryTypes = ['Producto', 'Combo']

function ComboForm ({
  categories,
  products,
  email
}: IComboForm) {
  const [file, setFile] = useState<File | null>(null)
  const [fileDataURL, setFileDataURL] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [categoryType, setCategoryType] = useState('Producto')
  const [selectedProduct, setSelectedProduct] = useState<Product>()
  const [selectedProducts, setSelectedProducts] = useState<ComboProduct[]>([])

  // Handle image
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const _file = e.currentTarget.files?.item(0)
    if (_file?.type.match(imageMimeType) == null) {
      alert('El tipo de la imagen no es un tipo valido!')
      return
    }
    setFile(_file)
  }

  useEffect(() => {
    let fileReader: FileReader
    let isCancel = false
    if (file != null) {
      fileReader = new FileReader()
      fileReader.onload = (e: any) => {
        const { result } = e.target
        if ((Boolean(result)) && !isCancel) {
          setFileDataURL(result)
        }
      }
      fileReader.readAsDataURL(file)
    }
    return () => {
      isCancel = true
      if ((fileReader != null) && fileReader.readyState === 1) {
        fileReader.abort()
      }
    }
  }, [file])

  const handleAddProduct = () => {
    if (selectedProduct != null) {
      if (selectedProducts.find((p) => p.id === selectedProduct.id) != null) {
        // if the product is already in the list, increase the quantity
        setSelectedProducts((prev) => prev.map((p) => {
          if (p.id === selectedProduct.id) {
            return {
              ...p,
              quantity: p.quantity + 1
            }
          }
          return p
        }
        ))
        return
      }
      setSelectedProducts((prev) => [...prev, {
        id: selectedProduct.id,
        name: selectedProduct.name,
        quantity: 1
      }])
    }
  }

  const handleRemoveProduct = (product: ComboProduct) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== product.id))
  }

  const handleSetSelectedProduct = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const _product = products.find((p) => p.id === Number(e.target.value))
    if (_product != null) {
      setSelectedProduct(_product)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // validate price
    if (Number(price) <= 0) {
      alert('El precio debe ser mayor a 0')
      return
    }
    const formData = JSON.stringify({
      name,
      description,
      price: Number(price),
      category: Number(category),
      email,
      products: selectedProducts,
      image: fileDataURL
    })
    try {
      const res = await fetch(`${baseUrl}/company/controlPanel/addCombo`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (res.status === 200) {
        alert('Combo agregado con éxito')
      } else {
        const { error } = await res.json()
        alert(error)
      }
    } catch (err) {
      alert('Hubo un error al crear la combo')
    }
  }

  return (
    <form
      action='post'
      className='flex flex-col gap-4 mx-auto mt-8 orange_gradient p-4 rounded-lg w-[500px]'
      onSubmit={handleSubmit}
    >
      <div className='flex w-full h-[200px] items-center'>
        {fileDataURL != null
          ? (
            <Image
              src={fileDataURL}
              alt='product_image'
              width={200}
              height={200}
              className='mx-auto object-contain w-[200px] h-[200px]'
            />
            )
          : (
            <Image
              src='/sin-fotos.png'
              alt='product_image'
              width={200}
              height={200}
              className='mx-auto'
            />
            )}
      </div>
      <div className='flex flex-row w-full'>
        <div className='w-1/2 px-3'>
          <label htmlFor='name' className='form_label'>
            Nombre
          </label>
          <input
            type='text'
            name='name'
            id='name'
            className='form_input'
            autoComplete='off'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className='w-1/2 px-3'>
          <label htmlFor='price' className='form_label'>Precio</label>
          <input
            type='text'
            name='price'
            id='price'
            className='form_input'
            autoComplete='off'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
      </div>
      <div className='flex flex-row w-full'>
        <div className='w-1/2 px-3'>
          <label htmlFor='price' className='form_label'>Tipo de Categoría</label>
          <select
            name='categoryType'
            id='categoryType'
            className='form_select'
            required
            value={categoryType}
            onChange={(e) => setCategoryType(e.target.value)}
          >
            {categoryTypes.map((categoryType) => (
              <option key={categoryType} value={categoryType}>{categoryType}</option>
            ))}
          </select>
        </div>
        <div className='w-1/2 px-3'>
          <label htmlFor='category' className='form_label'>Categoría</label>
          <select
            name='category'
            id='category'
            className='form_select'
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className='w-full px-3'>
        <label htmlFor='description' className='form_label'>Descripción</label>
        <textarea
          name='description'
          id='description'
          className='form_textarea resize-none'
          autoComplete='off'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className='flex flex-row w-full'>
        <div className='w-1/2 px-3'>
          <label htmlFor='product' className='form_label'>Producto</label>
          <select
            name='product'
            id='product'
            className='form_select'
            value={selectedProduct?.id}
            onChange={(e) => handleSetSelectedProduct(e)}
            required
          >
            {products.map((product) => (
              <option key={product.id} value={product.id}>{product.name}</option>
            ))}
          </select>
        </div>
        <div className='w-1/2 px-3 self-end'>
          <button
            className='transparent_btn w-full'
            type='button'
            onClick={() => handleAddProduct()}
          >
            Añadir al Combo
          </button>
        </div>
      </div>
      <div className='px-3 w-full'>
        <label htmlFor='products' className='form_label'>Productos</label>
        {selectedProducts.length > 0 && (
          selectedProducts.map((product, index) => (
            <span
              className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'
              key={index}
            >
              {product.quantity} x&nbsp;
              {product.name}
              &nbsp;
              <button
                type='button'
                onClick={() => handleRemoveProduct(product)}
              >
                ❌
              </button>
            </span>
          ))
        )}
      </div>
      <div className='w-full flex flex-row justify-between gap-4 px-3 mt-2'>
        <label
          className='transparent_btn cursor-pointer'
          htmlFor='image'
        >Seleccionar Imagen
          <input
            className='hidden'
            type='file'
            id='image'
            accept='.png, .jpg, .jpeg'
            multiple={false}
            onChange={changeHandler}
            required
          />
        </label>

        <button className='black_btn' type='submit'>
          Agregar
        </button>
      </div>
    </form>
  )
}

export default ComboForm
