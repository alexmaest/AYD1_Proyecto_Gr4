import { useEffect, useState } from 'react'
import { Category } from '@/types/interfaces'
import Image from 'next/image'
import baseUrl from '@/constants/baseUrl'

interface IProductForm {
  categories: Category[]
  email: string | null | undefined
}

const imageMimeType = /image\/(png|jpg|jpeg)/i
const categoryTypes = ['Producto', 'Combo']

function ProductForm ({
  categories,
  email
}: IProductForm) {
  const [file, setFile] = useState<File | null>(null)
  const [fileDataURL, setFileDataURL] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [categoryType, setCategoryType] = useState('Producto')

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (Number(price) <= 0) {
      alert('El precio debe ser mayor a 0')
      return
    }
    const formData = JSON.stringify({
      name,
      description,
      price: Number(price),
      category: Number(category),
      categoryType,
      email,
      image: fileDataURL
    })
    try {
      const res = await fetch(`${baseUrl}/company/controlPanel/addProduct`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (res.status === 200) {
        alert('Producto agregado con éxito')
      } else {
        const { error } = await res.json()
        alert(error)
      }
    } catch (err) {
      alert('Hubo un error al crear el producto')
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
      <div className='w-full flex flex-row justify-between gap-4 px-3 mt-4'>
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

export default ProductForm
