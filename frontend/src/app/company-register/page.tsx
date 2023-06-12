'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import baseUrl from '@/constants/baseUrl'
import Navbar from '@/components/Navbar'

const departments = [
  'Alta Verapaz',
  'Baja Verapaz',
  'Chimaltenango',
  'Chiquimula',
  'El Progreso'
]

const towns = [
  'Cobán',
  'San Pedro Carchá',
  'San Juan Chamelco',
  'San Cristóbal Verapaz',
  'Tactic'
]

const zones = [
  'Zona 1',
  'Zona 2',
  'Zona 3',
  'Zona 4',
  'Zona 5'
]

function Page () {
  const nameRef = useRef<HTMLInputElement>(null)
  const errorRef = useRef<HTMLParagraphElement>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('')
  const [town, setTown] = useState('')
  const [department, setDepartment] = useState('')
  const [zone, setZone] = useState('')
  const [files, setFiles] = useState<FileList | null>(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const _file = e.currentTarget.files
    if (_file == null) return
    setFiles(_file)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // validate password
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres!')
      errorRef.current?.focus()
      return
    }

    // validate type
    if (type === '') {
      setError('Debe seleccionar un tipo de empresa!')
      errorRef.current?.focus()
      return
    }

    // form data
    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('description', description)
    formData.append('type', type)
    formData.append('town', town)
    formData.append('department', department)
    formData.append('zone', zone)
    formData.append('file', files?.item(0) as File)
    formData.append('password', password)

    // send form data
    try {
      const res = await fetch(`${baseUrl}/companyRegister`, {
        method: 'POST',
        body: formData
      })
      if (res.status === 200) {
        alert('Solicitud enviada con éxito')
        window.location.href = '/login'
      } else {
        const { error } = await res.json()
        setError(error)
        errorRef.current?.focus()
      }
    } catch (error) {
      setError('Error al enviar la solicitud')
      errorRef.current?.focus()
    }
  }

  useEffect(() => {
    nameRef.current?.focus()
  }, [])

  useEffect(() => {
    setError('')
  }, [email, town, department, password])

  return (
    <>
      <Navbar />
      <section className='max-w-2xl rounded px-10 py-16 orange_gradient text-al-black mx-auto my-24'>
        <h1 className='text-center font-black text-3xl mb-10'>Solicitud para Empresa</h1>
        {(error !== '') && (
          <p className='bg-red-200 border-none rounded text-red-500 text-lg text-center italic p-2 mb-8'>{error}</p>
        )}
        <form action='post' className='flex flex-col gap-4' onSubmit={(e) => { void handleSubmit(e) }}>
          <div className='flex flex-row w-full'>
            <div className='w-1/2 px-3'>
              <label className='form_label' htmlFor='name'>
                Nombre:
              </label>
              <input
                className='form_input'
                type='text'
                name='name'
                id='name'
                placeholder='Nombre'
                autoComplete='off'
                ref={nameRef}
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </div>
            <div className='w-1/2 px-3'>
              <label className='form_label' htmlFor='email'>
                Correo:
              </label>
              <input
                className='form_input'
                type='email'
                name='email'
                id='email'
                placeholder='Correo'
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>
          </div>
          <div className='w-full px-3'>
            <label className='form_label' htmlFor='description'>
              Descripción:
            </label>
            <textarea
              className='form_textarea resize-none'
              name='description'
              id='description'
              placeholder='Descripción'
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              required
            />
          </div>
          <div className='w-full px-3'>
            <label className='form_label' htmlFor='type'>
              Tipo:
            </label>
            <ul className='flex items-center w-full text-sm font-medium text-al-black p-3'>
              <li className='w-1/3'>
                <div className='flex items-center pl-3'>
                  <input
                    id='restaurant'
                    type='radio'
                    value='Restaurant'
                    name='list-radio'
                    className='form_radio'
                    onChange={(e) => setType(e.target.value)}
                  />
                  <label htmlFor='restaurant' className='w-full py-3 ml-2 font-medium'>
                    Restaurante
                  </label>
                </div>
              </li>
              <li className='w-1/3'>
                <div className='flex items-center pl-3'>
                  <input
                    id='store'
                    type='radio'
                    value='Tienda'
                    name='list-radio'
                    className='form_radio'
                    onChange={(e) => setType(e.target.value)}
                  />
                  <label htmlFor='store' className='w-full py-3 ml-2 font-medium'>
                    Tienda de Conveniencia
                  </label>
                </div>
              </li>
              <li className='w-1/3'>
                <div className='flex items-center pl-3'>
                  <input
                    id='supermarket'
                    type='radio'
                    value='Supermercado'
                    name='list-radio'
                    className='form_radio'
                    onChange={(e) => setType(e.target.value)}
                  />
                  <label htmlFor='supermarket' className='w-full py-3 ml-2 font-medium'>
                    Supermercado
                  </label>
                </div>
              </li>
            </ul>
          </div>
          <div className='flex flex-row w-full'>
            <div className='w-2/5 px-3'>
              <label className='form_label' htmlFor='town'>
                Municipio:
              </label>
              <select
                className='form_select'
                name='towns'
                id='towns'
                onChange={(e) => setTown(e.target.value)}
                value={town}
              >
                {towns.map((town) => (
                  <option key={town} value={town}>{town}</option>
                ))}
              </select>
            </div>
            <div className='w-2/5 px-3'>
              <label className='form_label' htmlFor='department'>
                Departamento:
              </label>
              <select
                className='form_select'
                name='departments'
                id='departments'
                onChange={(e) => setDepartment(e.target.value)}
                value={department}
              >
                {departments.map((department) => (
                  <option key={department} value={department}>{department}</option>
                ))}
              </select>
            </div>
            <div className='w-1/5 px-3'>
              <label className='form_label' htmlFor='zones'>
                Zonas:
              </label>
              <select
                className='form_select'
                name='zones'
                id='zones'
                onChange={(e) => setZone(e.target.value)}
                value={zone}
              >
                {zones.map((zone) => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>
            </div>
          </div>
          <div className='w-full px-3'>
            <label className='form_label' htmlFor='password'>
              Contraseña
            </label>
            <input
              className='form_input'
              id='password'
              type='password'
              placeholder='Ingrese su contraseña'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>
          <div className='w-full px-3'>
            <label className='form_label' htmlFor='files'>
              Hoja de Vida:
            </label>
            <input
              className='form_file'
              type='file'
              name='files'
              id='files'
              accept='.pdf'
              multiple={false}
              onChange={changeHandler}
              required
            />
          </div>
          <div className='w-full px-3'>
            <button
              className='black_btn w-full'
              type='submit'
            >
              Enviar
            </button>
          </div>
          <p className='text-center'>
            Ya tienes una cuenta?&nbsp;
            <span className='text-blue-500 hover:underline font-semibold'>
              <Link href='/login'>Iniciar Sesión</Link>
            </span>
          </p>
        </form>
      </section>
    </>
  )
}

export default Page
