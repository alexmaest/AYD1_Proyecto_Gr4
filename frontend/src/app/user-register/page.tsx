'use client'
import Navbar from '@/components/Navbar'
import baseUrl from '@/constants/baseUrl'
import useDepartment from '@/hooks/useDepartment'
import { useState } from 'react'

const dropdown = {
  title: 'Únete al mejor equipo',
  styles: '',
  items: [
    {
      text: 'Repartidor',
      linkTo: '/delivery-man-register'
    },
    {
      text: 'Restaurante',
      linkTo: '/company-register'
    }
  ]
}

const liItems = [
  {
    linkTo: '/user-register',
    text: 'Registro'
  }
]

export default function Register () {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedMunicipality, setSelectedMunicipality] = useState('')
  const { departments } = useDepartment()
  const phoneRegex = /^[+]?([(]?502[)]?)?[-\s]?[0-9]{8}$/

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())

    if (data.password !== data.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (!phoneRegex.test(data.phoneNumber.toString())) {
      setError('El número de teléfono no es válido')
      return
    }

    if (data.department === '') {
      setError('Debes seleccionar un departamento')
      return
    }

    if (data.municipality === '') {
      setError('Debes seleccionar un municipio')
      return
    }

    try {
      const res = await fetch(baseUrl + '/userRegister', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          phoneNumber: data.phoneNumber,
          municipality: data.municipality,
          department: data.department
        })
      })
      if (res.ok) {
        setSuccess('Usuario registrado con éxito')
        setError('')
      } else {
        const dataJson = await res.json()
        setError(dataJson.error)
      }
    } catch (error) {
      console.log(error)
      setError('Ha ocurrido un error, intenta de nuevo')
    }
  }

  const handleDepartmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(event.target.value)
    setSelectedMunicipality('')
  }

  const handleMunicipalityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMunicipality(event.target.value)
  }

  const filteredMunicipalities = departments?.find((department: { id: number, descripcion: string }) => department.descripcion === selectedDepartment
  )?.municipios ?? []

  return (
    <div>
      <Navbar liElements={liItems} dropdown={dropdown} />
      <h1 className='py-20 text-2xl text-center text-al-yellow font-bold'>Registrate y pide cuando quieras</h1>
      <form
        className='flex flex-col items-center justify-center w-full max-w-md mx-auto'
        onSubmit={handleSubmit}
      >
        {
        error !== '' && (
          <div className='flex flex-col p-2 mb-4 absolute bottom-0 w-full rounded-lg items-center justify-center bg-red-500 text-white text-center max-w-md'>
            <p>{error}</p>
          </div>
        )
      }
        {
        success !== '' && (
          <div className='flex flex-col p-2 mb-4 absolute bottom-0 w-full rounded-lg items-center justify-center bg-green-500 text-white text-center max-w-md'>
            <p>{success}</p>
          </div>
        )
        }
        <div className='flex flex-row'>
          <input
            name='firstName'
            className='w-full mr-2 px-4 py-2 mb-4 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:outline-none focus:border-green-500'
            type='text'
            placeholder='Nombre'
            autoComplete='off'
            required
          />
          <input
            name='lastName'
            className='w-full ml-2 px-4 py-2 mb-4 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:outline-none focus:border-green-500'
            type='text'
            placeholder='Apellido'
            autoComplete='off'
            required
          />
        </div>
        <input
          name='email'
          className='w-full px-4 py-2 mb-4 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:outline-none focus:border-green-500'
          type='email'
          placeholder='Correo electrónico'
          autoComplete='off'
          required
        />
        <input
          name='phoneNumber'
          className='w-full px-4 py-2 mb-4 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:outline-none focus:border-green-500'
          type='text'
          placeholder='Número de teléfono'
          autoComplete='off'
          required
        />
        <div className='flex flex-row justify-center items-center'>
          <div className='flex-1 mr-2'>
            <label
              htmlFor='department'
              className='text-sm text-al-yellow font-semibold'
            >Departamento:
            </label>
            <select
              id='department'
              name='department'
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              className='px-4 py-2 mb-4 w-full text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:outline-none focus:border-green-500'
            >
              <option value=''>Selecciona un departamento</option>
              {
              departments?.map(({ departamento_id: departamentoId, descripcion }: { departamento_id: number, descripcion: string }) => (
                <option key={departamentoId} value={descripcion}>{descripcion}</option>
              ))
            }
            </select>
          </div>
          <div className='flex-1 ml-2'>
            <label htmlFor='municipality' className='text-sm text-al-yellow font-semibold'>Municipio</label>
            <select
              id='municipality'
              name='municipality'
              value={selectedMunicipality}
              onChange={handleMunicipalityChange}
              disabled={selectedDepartment === '' || filteredMunicipalities.length === 0}
              className='px-4 py-2 mb-4 w-full text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:outline-none focus:border-green-500'
            >
              <option value=''>Selecciona un municipio</option>
              {
                filteredMunicipalities.map(({ municipio_id: municipioId, descripcion }: { municipio_id: number, descripcion: string }) => (
                  <option key={municipioId} value={descripcion}>{descripcion}</option>
                ))
               }
            </select>
          </div>
        </div>
        <input
          name='password'
          className='w-full px-4 py-2 mb-4 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:outline-none focus:border-green-500'
          type='password'
          placeholder='Contraseña'
          autoComplete='off'
          required
        />
        <input
          name='confirmPassword'
          className='w-full px-4 py-2 mb-4 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:outline-none focus:border-green-500'
          type='password'
          placeholder='Confirmar contraseña'
          autoComplete='off'
          required
        />
        <button
          className='w-full px-4 py-2 mb-4 text-base font-semibold text-white transition duration-200 bg-green-500 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:bg-green-700'
          type='submit'
        >
          Registrarse
        </button>
      </form>
    </div>
  )
}
