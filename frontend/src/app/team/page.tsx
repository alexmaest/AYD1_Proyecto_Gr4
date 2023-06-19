import Navbar from '@/components/Navbar'
import Image from 'next/image'

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
    linkTo: '/login',
    text: 'Login'
  },
  {
    linkTo: '/user-register',
    text: 'Registro'
  }
]

export default function Team () {
  const teamMembers = [
    {
      name: 'Rodrigo Porón',
      role: 'Desarrollador Frontend',
      photo: 'https://github.com/rodriporon.png',
      bio: 'Rodrigo es un desarrollador frontend con experiencia en React, Angular, Svelte y TailwindCSS.'
    },
    {
      name: 'David Maldonado',
      role: 'Desarrollador Frontend',
      photo: 'https://github.com/DavidAMaldonadoH.png',
      bio: 'David es una desarrollador frontend con experiencia en React y TailwindCSS.'
    },
    {
      name: 'Alexis Estrada',
      role: 'Desarrollador Backend',
      photo: 'https://github.com/alexmaest.png',
      bio: 'Alexis es un desarrollador backend con experiencia en NodeJS, Express y MongoDB.'
    },
    {
      name: 'Otto Olivarez',
      role: 'Desarrollador Backend',
      photo: 'https://github.com/ottoolivarez.png',
      bio: 'Otto es un desarrollador backend con experiencia en NodeJS, Express y MongoDB.'
    }
  ]

  return (
    <>
      <Navbar liElements={liItems} dropdown={dropdown} />
      <section className='pb-8 md:pt-20 pt-28'>
        <h1 className='text-3xl font-bold text-center mb-8 text-al-yellow'>Nuestro equipo</h1>
        <ul className='flex flex-wrap justify-center'>
          {teamMembers.map((member) => (
            <li key={member.name} className='w-full md:w-1/2 lg:w-1/3 p-4'>
              <div className='rounded-lg shadow-lg overflow-hidden'>
                <Image src={member.photo} alt={member.name} width={720} height={480} className='w-full h-64 object-cover' />
                <div className='p-4'>
                  <h2 className='text-xl font-bold mb-2 text-al-yellow'>{member.name}</h2>
                  <p className='text-white mb-2 font-semibold'>{member.role}</p>
                  <p className='text-white'>{member.bio}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
