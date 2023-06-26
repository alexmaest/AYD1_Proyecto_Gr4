'use client'
import useStore from '@/hooks/useStore'
import useCartStore from '@/hooks/useCartStore'
import DangerAlert from '@/components/DangerAlert'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import baseUrl from '@/constants/baseUrl'

const creditCardRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})$/

export default function Page () {
  const [cardNumber, setCardNumber] = useState('')
  const [cvv, setCvv] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [coupon, setCoupon] = useState('')
  const [validCard, setValidCard] = useState(false)
  const [paying, setPaying] = useState(false)
  const products = useStore(useCartStore, (state) => state.products)
  const combos = useStore(useCartStore, (state) => state.combos)
  const companyId = useStore(useCartStore, (state) => state.companyId)
  const description = useStore(useCartStore, (state) => state.description)
  const { data: session, status } = useSession()
  const { totalCart } = useCartStore()

  const userId = session?.user?.id ?? null

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setCardNumber(value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const payObject = {
      user_id: userId,
      company_id: companyId,
      description,
      card_number: cardNumber,
      cvv,
      due_date: dueDate,
      coupon,
      total: totalCart(),
      products: products?.map(({ id, quantity }) => ({ id, quantity })),
      combos: combos?.map(({ id, quantity }) => ({ id, quantity }))
    }

    const fetcher = async (url: string) => {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payObject)
      })
      return await res.json()
    }

    const pay = async () => {
      setPaying(true)
      const res = await fetcher(`${baseUrl}/user/dashboard/shoppingCart`)
      if (res.status === 503) {
        setPaying(false)
        alert('Cupón ya usado')
      }
      if (res.status === 504) {
        setPaying(false)
        alert('Cupón inválido')
      }
      if (res.status === 200) {
        setPaying(false)
        alert('Compra exitosa')
      } else {
        setPaying(false)
        alert('Error en la compra')
      }
    }

    await pay()
  }

  useEffect(() => {
    if (cardNumber.match(creditCardRegex) != null) {
      setValidCard(true)
    } else {
      setValidCard(false)
    }
  }, [cardNumber])

  if (products == null || combos == null || totalCart() == null || status === 'loading') {
    return (
      <section className='py-28 px-2 h-screen'>
        <h1 className='text-2xl  font-bold'>Cargando tu información</h1>
      </section>
    )
  }

  return (
    <section className='py-28 px-2 h-screen'>
      <h1 className='text-2xl text-orange-600 font-bold'>Pay</h1>
      {
        !validCard && cardNumber !== ''
          ? (
            <div className='flex justify-center'>
              <div className='absolute bottom-0'>
                <DangerAlert title='Tarjeta inválida' description='Ingrese una tarjeta válida' />
              </div>
            </div>
            )
          : null
      }
      <div className='flex justify-around'>
        <article className='flex flex-col w-2/5'>
          <h2 className='text-2xl font-bold'>Resumen</h2>
          <span className='border w-full' />
          {
            products == null
              ? <p>Sin productos</p>
              : products.map((product) => (
                <div className='flex flex-col' key={product.id}>
                  <div className='flex space-x-2 items-center'>
                    <p>{product.name}</p>
                    <p className='text-xs font-light'>x{product.quantity}</p>
                  </div>
                  <p className='text-xs font-light'>Q. {product.price}</p>
                </div>
              ))
            }
          <span className='border border-gray-700' />
          {
            combos == null
              ? <p>Sin combos</p>
              : combos.map((combo) => (
                <div className='flex flex-col' key={combo.id}>
                  <div className='flex space-x-2 items-center'>
                    <p>{combo.name}</p>
                    <p className='text-xs font-light'>x{combo.quantity}</p>
                  </div>
                  <p className='text-xs font-light'>Q. {combo.price}</p>
                </div>
              ))
          }
          <p className='font-bold'>
            Total a pagar: Q. {totalCart()}
          </p>
        </article>
        <article className='flex flex-col w-2/5'>
          <h2 className='text-2xl font-bold'>Pago</h2>
          <span className='border w-full' />
          <form
            action='POST'
            onSubmit={handleSubmit}
          >
            <div className='flex flex-col w-2/3 space-y-2 my-2'>
              <label htmlFor='card'>Tarjeta</label>
              <input
                className='bg-transparent'
                type='text'
                name='card'
                id='card'
                placeholder='4242 4242 4242 4242'
                onChange={handleCardChange}
                value={cardNumber}
                required
                autoComplete='off'
              />
              <label htmlFor='cvv'>CVV</label>
              <input
                className='bg-transparent'
                type='password'
                name='cvv'
                id='cvv'
                placeholder='123'
                onChange={(e) => setCvv(e.target.value)}
                value={cvv}
                required
                autoComplete='off'
              />
              <label htmlFor='dueDate'>Fecha de vencimiento</label>
              <input
                className='bg-transparent'
                type='text'
                name='dueDate'
                id='dueDate'
                placeholder='2023-06-30'
                onChange={(e) => setDueDate(e.target.value)}
                value={dueDate}
                required
                autoComplete='off'
              />
              <label htmlFor='coupon'>Cupón</label>
              <input
                className='bg-transparent'
                type='text'
                name='coupon'
                id='coupon'
                placeholder='CUPON123'
                autoComplete='off'
                onChange={(e) => setCoupon(e.target.value)}
                value={coupon}
              />
            </div>
            <footer className='flex justify-end'>
              <button
                className='bg-orange-500 py-2 px-12 rounded-lg font-bold disabled:opacity-50'
                type='submit'
                disabled={!validCard && cardNumber !== ''}
              >
                {paying ? 'Pagando...' : 'Pagar'}
              </button>
            </footer>
          </form>
        </article>
      </div>
    </section>
  )
}
