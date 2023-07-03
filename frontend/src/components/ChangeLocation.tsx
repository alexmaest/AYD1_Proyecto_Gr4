import { useEffect, useRef, useState } from 'react'
import { Department, Town } from '@/types/interfaces'
import baseUrl from '@/constants/baseUrl'

interface IProps {
  currentDepartment: string
  currentMunicipality: string
  userId: number
}

function ChangeLocation ({ currentDepartment, currentMunicipality, userId }: IProps) {
  const errorRef = useRef<HTMLParagraphElement>(null)
  const successRef = useRef<HTMLParagraphElement>(null)
  const [departments, setDepartments] = useState<Department[]>([])
  const [towns, setTowns] = useState<Town[]>([])
  const [department, setDepartment] = useState<Department>()
  const [town, setTown] = useState<Town>()
  const [motive, setMotive] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [toggleRequest, setToggleRequest] = useState(false)

  const sendRequest = async () => {
    if (motive === '') {
      setError('Debes ingresar un motivo')
      return
    }

    if (currentMunicipality === town?.descripcion) {
      setError('Ya estás registrado en este municipio')
      return
    }

    try {
      const res = await fetch(`${baseUrl}/deliveryMan/changeLocation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: userId,
          department: department?.departamento_id,
          municipality: town?.municipio_id,
          description: motive
        })
      })
      if (res.ok) {
        setSuccess('Solicitud enviada con éxito')
        setError('')
        setMotive('')
        setDepartment(departments[0])
      } else {
        setError('Ha ocurrido un error, intenta de nuevo')
        setSuccess('')
      }
    } catch (error) {
      setError('Ha ocurrido un error, intenta de nuevo')
    }
  }

  useEffect(() => {
    const getDepartments = async () => {
      const res = await fetch(`${baseUrl}/departments`, { method: 'GET' })
      const _departments = await res.json()
      setDepartments(_departments)
      setDepartment(_departments[0])
    }
    void getDepartments()
  }, [])

  useEffect(() => {
    const _towns = departments.find(d => d.descripcion === department?.descripcion)?.municipios
    if (_towns != null) {
      setTowns(_towns)
      setTown(_towns[0])
    }
  }, [department, departments])

  useEffect(() => {
    if (errorRef.current != null) {
      errorRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [error])

  useEffect(() => {
    if (successRef.current != null) {
      successRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [success])

  useEffect(() => {
    setError('')
    setSuccess('')
  }, [department, town, motive])

  return (
    <section className='w-full flex flex-col mt-8'>
      <div className='w-full flex flex-row pb-2 border-b-2 border-al-yellow'>
        <h2 className='grow text-3xl font-semibold text-al-white'>Solicitar Traslado</h2>
        <button
          className='outline_btn w-[200px]'
          type='button'
          onClick={() => setToggleRequest(!toggleRequest)}
        >
          {toggleRequest ? 'Cancelar' : 'Realizar Solicitud'}
        </button>
      </div>
      {
        error !== '' && (
          <p className='w-full mt-4 p-2 rounded-lg bg-red-500 text-white text-center' ref={errorRef}>{error}</p>
        )
      }
      {
        success !== '' && (
          <p className='w-full mt-4 p-2 rounded-lg bg-green-500 text-white text-center' ref={successRef}>{success}</p>
        )
      }
      {toggleRequest && (
        <>
          <div className='flex flex-row w-full mt-4 py-4 rounded-lg bg-slate-400'>
            <div className='w-1/2 px-3'>
              <label className='form_label' htmlFor='department'>
                Departamento Actual:
              </label>
              <p className='text-xl'>
                {currentDepartment}
              </p>
            </div>
            <div className='w-1/2 px-3'>
              <label className='form_label' htmlFor='town'>
                Municipio Actual:
              </label>
              <p className='text-xl'>
                {currentMunicipality}
              </p>
            </div>
          </div>
          <form
            action='post'
            className='flex flex-col gap-4 w-full mt-4 py-4 rounded-lg bg-slate-400'
          >
            <div className='flex flex-row w-full'>
              <div className='w-1/2 px-3'>
                <label className='form_label' htmlFor='department'>
                  Nuevo Departamento:
                </label>
                <select
                  className='form_select'
                  name='departments'
                  id='departments'
                  onChange={(e) => {
                    setDepartment(departments.find(d => d.descripcion === e.target.value))
                  }}
                  value={department?.descripcion}
                >
                  {departments.map((department) => (
                    <option key={department.departamento_id} value={department.descripcion}>{department.descripcion}</option>
                  ))}
                </select>
              </div>
              <div className='w-1/2 px-3'>
                <label className='form_label' htmlFor='town'>
                  Nuevo Municipio:
                </label>
                <select
                  className='form_select'
                  name='towns'
                  id='towns'
                  onChange={(e) => {
                    setTown(towns.find(t => t.descripcion === e.target.value))
                  }}
                  value={town?.descripcion}
                >
                  {towns.map((town) => (
                    <option key={town.municipio_id} value={town.descripcion}>{town.descripcion}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className='w-full px-3'>
              <label className='form_label' htmlFor='motive'>
                Motivo:
              </label>
              <textarea
                className='form_textarea resize-none'
                name='motive'
                id='motive'
                placeholder='Motivo'
                onChange={e => setMotive(e.target.value)}
                value={motive}
                required
              />
            </div>
            <div className='flex justify-end px-3'>
              <button
                className='black_btn w-[200px]'
                type='button'
                onClick={sendRequest}
              >
                Enviar
              </button>
            </div>
          </form>
        </>
      )}
    </section>
  )
}

export default ChangeLocation
