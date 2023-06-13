'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import baseUrl from '@/constants/baseUrl'
import Navbar from '@/components/Navbar'

const phoneRegex = /^[+]?([(]?502[)]?)?[-\s]?[0-9]{8}$/
const licenseTypes = ['A', 'B', 'C', 'M']

const dropdown = {
  title: 'Únete al mejor equipo',
  styles: '',
  items: [
    {
      text: 'Repartidor',
      linkTo: '/deliveryManRegister'
    },
    {
      text: 'Restaurante',
      linkTo: '/company-register'
    }
  ]
}

const liItems = [
  {
    linkTo: '/login',
    text: 'Login'
  },
  {
    linkTo: '/user-register',
    text: 'Registro'
  }
]

function Page () {
  const nameRef = useRef<HTMLInputElement>(null)
  const errorRef = useRef<HTMLParagraphElement>(null)

  const [departments, setDepartments] = useState<any[]>([])
  const [towns, setTowns] = useState<any[]>([])
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [town, setTown] = useState('')
  const [department, setDepartment] = useState('')
  const [hasLicense, setHasLicense] = useState(false)
  const [licenseType, setLicenseType] = useState('')
  const [hasVehicle, setHasVehicle] = useState(false)
  const [cv, setCv] = useState<File | null>(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.item(0)
    if (file == null) return
    setCv(file)
  }

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const department = e.currentTarget.value
    setDepartment(department)
    const _towns = departments.find(d => d.descripcion === department)?.municipios
    if (_towns != null) setTowns(_towns)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // validate password
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres!')
      errorRef.current?.focus()
      return
    }

    // validate phone number
    if (!phoneRegex.test(phone)) {
      setError('El número de teléfono no es válido!')
      errorRef.current?.focus()
      return
    }

    // form data
    const formData = new FormData()
    formData.append('name', name)
    formData.append('lastName', lastName)
    formData.append('email', email)
    formData.append('phone', phone)
    formData.append('town', town)
    formData.append('department', department)
    formData.append('hasLicense', hasLicense.toString())
    if (hasLicense) { formData.append('licenseType', licenseType) } else { formData.append('licenseType', '') }
    formData.append('hasVehicle', hasVehicle.toString())
    formData.append('cv', cv as File)
    formData.append('password', password)

    // send form data
    try {
      const res = await fetch(`${baseUrl}/deliveryRegister`, {
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
    const getDepartments = async () => {
      const res = await fetch(`${baseUrl}/departments`, { method: 'GET' })
      const _departments = await res.json()
      setDepartments(_departments)
      setDepartment(_departments[0]?.descripcion)
      setTowns(_departments[0]?.municipios)
      setTown(_departments[0]?.municipios[0]?.descripcion)
    }
    void getDepartments()
  }, [])

  useEffect(() => {
    nameRef.current?.focus()
  }, [])

  useEffect(() => {
    setLicenseType('A')
  }, [hasLicense])

  useEffect(() => {
    setError('')
  }, [email, phone, town, department, hasLicense, licenseType, hasVehicle, cv, password])

  return (
    <>
      <Navbar liElements={liItems} dropdown={dropdown} />
      <section className='max-w-2xl rounded px-10 py-16 orange_gradient text-al-black mx-auto my-24'>
        <h1 className='text-center font-black text-3xl mb-10'>Solicitud para Repartidor</h1>
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
              <label className='form_label' htmlFor='lastName'>
                Apellido:
              </label>
              <input
                className='form_input'
                type='text'
                name='lastName'
                id='lastName'
                placeholder='Apellido'
                autoComplete='off'
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                required
              />
            </div>
          </div>
          <div className='w-full px-3'>
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
          <div className='w-full px-3'>
            <label className='form_label' htmlFor='phone'>
              Teléfono:
            </label>
            <input
              className='form_input'
              type='text'
              name='phone'
              id='phone'
              placeholder='Teléfono'
              autoComplete='off'
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              required
            />
          </div>
          <div className='flex flex-row w-full'>
            <div className='w-1/2 px-3'>
              <label className='form_label' htmlFor='department'>
                Departamento:
              </label>
              <select
                className='form_select'
                name='departments'
                id='departments'
                onChange={(e) => handleDepartmentChange(e)}
                value={department}
              >
                {departments.map((department) => (
                  <option key={department.id} value={department.descripcion}>{department.descripcion}</option>
                ))}
              </select>
            </div>
            <div className='w-1/2 px-3'>
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
                  <option key={town.id} value={town.id}>{town.descripcion}</option>
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
          <div className='flex flex-row w-full items-center'>
            <div className='w-1/3 px-3'>
              <label className='form_label' htmlFor='hasLicense'>
                Tiene Licencia:
              </label>
              <input
                className='form_checkbox'
                type='checkbox'
                name='hasLicense'
                id='hasLicense'
                onChange={() => setHasLicense((prev) => !prev)}
              />
            </div>
            {hasLicense && (
              <div className='w-1/3 px-3'>
                <label className='form_label' htmlFor='licenseType'>
                  Tipo de Licencia:
                </label>
                <select
                  className='form_select'
                  name='licenseType'
                  id='licenseType'
                  onChange={(e) => setLicenseType(e.target.value)}
                  value={licenseType}
                >
                  {licenseTypes.map((type) => (
                    <option value={type} key={type}>{type}</option>
                  ))}
                </select>
              </div>
            )}
            <div className='w-1/3 px-3'>
              <label className='form_label' htmlFor='hasVehicle'>
                Tiene Vehículo Propio:
              </label>
              <input
                className='form_checkbox'
                type='checkbox'
                name='hasVehicle'
                id='hasVehicle'
                onChange={() => setHasVehicle((prev) => !prev)}
              />
            </div>
          </div>
          <div className='w-full px-3'>
            <label className='form_label' htmlFor='cv'>
              Hoja de Vida:
            </label>
            <input
              className='form_file'
              type='file'
              name='cv'
              id='cv'
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
