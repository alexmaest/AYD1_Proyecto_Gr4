'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import ChangeLocation from '@/components/ChangeLocation'
import baseUrl from '@/constants/baseUrl'
import { Rating } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'
import Spinner from '@/components/Spinner'
import CommissionsTable from '@/components/CommissionsTable'
import { Commission } from '@/types/interfaces'

function Page () {
  const { data: session, status } = useSession()
  const [profileInfo, setProfileInfo] = useState({
    id: 0,
    nombres: '',
    apellidos: '',
    correo: '',
    no_celular: '',
    departamento: '',
    municipio: '',
    tiene_vehiculo: '',
    tipo_licencia: '',
    documento_url: ''
  })
  const [rating, setRating] = useState(0)
  const [userCommissions, setUserCommissions] = useState<Commission[]>([])
  const [total, setTotal] = useState(0)
  const [togglePersonalRating, setTogglePersonalRating] = useState(false)
  const [toggleCommissions, setToggleCommissions] = useState(false)
  const [togglePersonalData, setTogglePersonalData] = useState(false)
  const email = ((session?.user?.email) != null) ? session.user.email : ''
  const id = ((session?.user?.id) != null) ? session.user.id : 0

  useEffect(() => {
    if (email === '') return
    const getProfileInfo = async () => {
      try {
        const response = await fetch(`${baseUrl}/deliveryMan/deliveryManInfoRequest/${email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        setProfileInfo(data)
      } catch (error: any) {
        alert(error.message)
      }
    }
    void getProfileInfo()
  }, [email])

  useEffect(() => {
    if (id === 0) return
    const getRating = async () => {
      try {
        const response = await fetch(`${baseUrl}/deliveryMan/qualification/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        const { qualification } = data
        setRating(qualification)
      } catch (error: any) {
        alert(error.message)
      }
    }
    void getRating()
  }, [id])

  useEffect(() => {
    if (id === 0) return
    const getCommissions = async () => {
      try {
        const response = await fetch(`${baseUrl}/deliveryMan/commissions/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        const { commissions, total_commissions } = data
        setUserCommissions(commissions)
        setTotal(total_commissions)
      } catch (error: any) {
        alert(error.message)
      }
    }
    void getCommissions()
  }, [id])

  if (status === 'loading') {
    return (
      <div className='max-w-2xl px-10 py-16 mx-auto my-[28px] grid justify-center'>
        <Spinner />
      </div>
    )
  }

  return (
    <section className='max-w-2xl rounded px-10 py-16 text-al-black mx-auto my-[28px]'>
      <h1 className='text-center font-black text-4xl mb-10 orange_gradient_text'>Mi Perfil</h1>
      <section className='w-full flex flex-col mt-8'>
        <div className='w-full flex flex-row pb-2 border-b-2 border-al-yellow'>
          <h2 className='grow text-3xl font-semibold text-al-white'>Mi Puntuación</h2>
          <button
            className='outline_btn w-[200px]'
            type='button'
            onClick={() => setTogglePersonalRating(!togglePersonalRating)}
          >
            {togglePersonalRating ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
        {togglePersonalRating && (
          <div className='flex mt-4 py-4 mx-auto'>
            <Rating
              style={{ maxWidth: 250 }}
              value={rating}
              readOnly
            />
          </div>
        )}
      </section>
      <section className='w-full flex flex-col mt-8'>
        <div className='w-full flex flex-row pb-2 border-b-2 border-al-yellow'>
          <h2 className='grow text-3xl font-semibold text-al-white'>Comisiones Generadas</h2>
          <button
            className='outline_btn w-[200px]'
            type='button'
            onClick={() => setToggleCommissions(!toggleCommissions)}
          >
            {toggleCommissions ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
        {toggleCommissions && (
          <CommissionsTable commissions={userCommissions} total={total} />
        )}
      </section>
      <section className='w-full flex flex-col mt-8'>
        <div className='w-full flex flex-row pb-2 border-b-2 border-al-yellow'>
          <h2 className='grow text-3xl font-semibold text-al-white'>Datos Personales</h2>
          <button
            className='outline_btn w-[200px]'
            type='button'
            onClick={() => setTogglePersonalData(!togglePersonalData)}
          >
            {togglePersonalData ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
        {togglePersonalData && (
          <div className='flex flex-col w-full mt-4 py-4 rounded-lg bg-slate-400 gap-4'>
            <div className='flex flex-row w-full'>
              <div className='w-1/2 px-3'>
                <label className='form_label' htmlFor='name'>
                  Nombre:
                </label>
                <p className='text-xl'>
                  {profileInfo.nombres}
                </p>
              </div>
              <div className='w-1/2 px-3'>
                <label className='form_label' htmlFor='lastName'>
                  Apellido:
                </label>
                <p className='text-xl'>
                  {profileInfo.apellidos}
                </p>
              </div>
            </div>
            <div className='w-full px-3'>
              <label className='form_label' htmlFor='email'>
                Correo:
              </label>
              <p className='text-xl'>
                {profileInfo.correo}
              </p>
            </div>
            <div className='w-full px-3'>
              <label className='form_label' htmlFor='phone'>
                Teléfono:
              </label>
              <p className='text-xl'>
                {profileInfo.no_celular}
              </p>
            </div>
            <div className='flex flex-row w-full items-center'>
              <div className='w-1/3 px-3'>
                <label className='form_label' htmlFor='hasLicense'>
                  Tiene Licencia:
                </label>
                <p className='text-xl'>
                  {profileInfo.tipo_licencia !== '' ? 'Si' : 'No'}
                </p>
              </div>
              <div className='w-1/3 px-3'>
                <label className='form_label' htmlFor='licenseType'>
                  Tipo de Licencia:
                </label>
                <p className='text-xl'>
                  {profileInfo.tipo_licencia}
                </p>
              </div>
              <div className='w-1/3 px-3'>
                <label className='form_label' htmlFor='hasVehicle'>
                  Tiene Vehículo Propio:
                </label>
                <p className='text-xl capitalize'>
                  {profileInfo.tiene_vehiculo}
                </p>
              </div>
            </div>
            <div className='w-full px-3'>
              <label className='form_label' htmlFor='cv'>
                Hoja de Vida:
              </label>
              <a href={profileInfo.documento_url} className='text-xl underline'>
                Mi Hoja de Vida
              </a>
            </div>
          </div>
        )}
      </section>
      <ChangeLocation
        currentDepartment={profileInfo.departamento}
        currentMunicipality={profileInfo.municipio}
        userId={profileInfo.id}
      />
    </section>
  )
}

export default Page
