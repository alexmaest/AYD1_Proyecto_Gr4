'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import ChangeLocation from '@/components/ChangeLocation'
import baseUrl from '@/constants/baseUrl'

function Page () {
  const { data: session } = useSession()
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
  const email = ((session?.user?.email) != null) ? session.user.email : ''

  useEffect(() => {
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
    if (email !== '') void getProfileInfo()
  }, [email])

  return (
    <section className='max-w-2xl rounded px-10 py-16 text-al-black mx-auto my-[28px]'>
      <h1 className='text-center font-black text-4xl mb-10 orange_gradient_text'>Mi Perfil</h1>
      <section className='flex flex-col gap-4 w-full rounded-lg bg-slate-400 py-4'>
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
