import { useEffect, useState } from 'react'
import Image from 'next/image'
import baseUrl from '@/constants/baseUrl'

interface ICategoryProps {
  email: string | null | undefined
}

const imageMimeType = /image\/(png|jpg|jpeg)/i
const categoryTypes = ['Producto', 'Combo']

function CategoryForm ({ email }: ICategoryProps) {
  const [file, setFile] = useState<File | null>(null)
  const [fileDataURL, setFileDataURL] = useState(null)
  const [name, setName] = useState('')
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
    const formData = JSON.stringify({
      name,
      categoryType,
      email,
      image: fileDataURL
    })
    try {
      const res = await fetch(`${baseUrl}/company/controlPanel/addCategory`, {
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
      alert('Hubo un error al crear la categoría')
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
            <Image src={fileDataURL} alt='product_image' width={200} height={200} className='mx-auto object-contain w-[200px] h-[200px]' />
            )
          : (
            <Image src='/sin-fotos.png' alt='product_image' width={200} height={200} className='mx-auto' />
            )}
      </div>
      <div className='w-full px-3'>
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
      <div className='w-full px-3'>
        <label htmlFor='categoryType' className='form_label'>
          Tipo de Categoría
        </label>
        <select
          name='categoryType'
          id='categoryType'
          className='form_select'
          value={categoryType}
          onChange={(e) => setCategoryType(e.target.value)}
          required
        >
          {categoryTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
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
        <button className='black_btn'>
          Agregar
        </button>
      </div>
    </form>
  )
}

export default CategoryForm
