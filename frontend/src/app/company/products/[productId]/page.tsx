'use client'
import { useState, useEffect } from 'react'
import { Category } from '@/types/interfaces'
import baseUrl from '@/constants/baseUrl'
import Link from 'next/link'
import Image from 'next/image'

interface Params {
  params: {
    productId: string
  }
}

const imageMimeType = /image\/(png|jpg|jpeg)/i
const categoryTypes = ['Producto', 'Combo']

function Page ({ params: { productId } }: Params) {
  const [categories, setCategories] = useState<Category[]>([])
  const [subCategories, setSubCategories] = useState<Category[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [fileDataURL, setFileDataURL] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState<Category>()
  const [categoryType, setCategoryType] = useState('Producto')

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetch(`${baseUrl}/company/controlPanel/categories`)
        const data = await res.json()
        setCategories(data)
      } catch (error: any) {
        alert(error.message)
      }
    }
    void getCategories()
  }, [])

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await fetch(`${baseUrl}/company/controlPanel/singleProduct/${productId}`)
        const data = await res.json()
        const { name, description, price, category, categoryType, image } = data
        setName(name)
        setDescription(description)
        setPrice(price)
        setCategory(category)
        setCategoryType(categoryType)
        setFileDataURL(image)
      } catch (error: any) {
        alert(error.message)
      }
    }
    void getProduct()
  }, [productId])

  useEffect(() => {
    const _subCategories = categories.filter((category) => category.type === 'Producto')
    setSubCategories(_subCategories)
    setCategory(_subCategories[0])
  }, [categories])

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const _category = subCategories.find((category) => category.name === e.target.value)
    setCategory(_category)
  }

  const handleCategoryTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryType(e.target.value)
    if (e.target.value === 'Producto') {
      const _subCategories = categories.filter((category) => category.type === 'Producto')
      setSubCategories(_subCategories)
    } else {
      const _subCategories = categories.filter((category) => category.type === 'Combo')
      setSubCategories(_subCategories)
    }
  }

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
      id: Number(productId),
      name,
      description,
      price: Number(price),
      category: Number(category),
      categoryType,
      image: fileDataURL
    })
    console.log(formData)
    try {
      const res = await fetch(`${baseUrl}/company/controlPanel/editProduct`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (res.status === 200) {
        alert('Producto editado con éxito')
      } else {
        const { error } = await res.json()
        alert(error)
      }
    } catch (err) {
      alert('Hubo un error al editar el producto')
    }
  }
  return (
    <div className='container w-4/5 my-20 mx-auto'>
      <section className='w-full flex flex-col'>
        <div className='w-full flex flex-row pb-2 border-b-2 border-al-yellow'>
          <h1 className='grow text-3xl font-semibold'>Editar Producto</h1>
          <Link className='outline_btn w-[200px]' href='/company/products'>
            Cancelar
          </Link>
        </div>
      </section>
      <form
        action='post'
        className='flex flex-col gap-4 mx-auto mt-8 bg-slate-400 p-4 rounded-lg w-[500px]'
        onSubmit={handleSubmit}
      >
        <div className='flex w-full h-[200px] items-center'>
          {fileDataURL != null
            ? (
              <Image
                src={fileDataURL}
                loader={({ src }) => src}
                alt='product_image'
                width={200}
                height={200}
                className='mx-auto object-contain w-[200px] h-[200px] p-2'
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
              onChange={(e) => handleCategoryTypeChange(e)}
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
              value={category?.name}
              onChange={(e) => handleCategoryChange(e)}
            >
              {subCategories.map((_category) => (
                <option key={_category.id} value={_category.id}>{_category.name}</option>
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
            className='yellow_btn cursor-pointer'
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
            Editar
          </button>
        </div>
      </form>
    </div>
  )
}

export default Page
