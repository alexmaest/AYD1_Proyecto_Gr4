import Navbar from '@/components/Navbar'
import Image from 'next/image'
import Link from 'next/link'

export default function Home () {
  const itemsFooter = [
    {
      title: 'Quiénes somos',
      url: '/'
    },
    {
      title: 'Equipo',
      url: '/team'
    },
    {
      title: 'Preguntas Frecuentes',
      url: '/'
    },
    {
      title: 'Términos y condiciones',
      url: '/'
    },
    {
      title: 'Políticas de Privacidad',
      url: '/'
    }
  ]

  return (
    <main>
      <Navbar />
      <section className='flex flex-col justify-center items-center h-screen sm:flex-row sm:justify-around'>
        <div className='h-auto'>
          <Image src='/principal.png' width={1000} height={1000} alt='principal' />
        </div>
        <div className=''>
          <h1 className='md:text-6xl text-4xl font-bold text-center text-al-yellow'>¡Pide con nosotros!</h1>
          <p className='text-center font-semibold text-al-white'>Es la forma más sencilla de pedir comida a domicilio</p>
        </div>
      </section>
      <footer className='flex md:flex-row-reverse flex-col items-center h-screen bg-al-orange md:justify-center justify-evenly'>
        <div className='md:w-1/3 w-2/4'>
          <Image className='w-full h-auto' src='/pizza.webp' width={709} height={726} alt='logo' />
        </div>
        <nav>
          <ul className='flex md:flex-row flex-col items-center'>
            {
              itemsFooter.map(({ title, url }, index) => {
                return (
                  <li key={index} className='md:mx-2 my-2'>
                    <Link href={url} target='_top' className='text-al-black font-semibold hover:underline' rel='noreferrer'>
                      {title}
                    </Link>
                  </li>
                )
              })
            }
          </ul>
        </nav>
      </footer>
    </main>
  )
}
