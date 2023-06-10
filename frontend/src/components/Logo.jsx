import Image from 'next/image'

export default function Logo ({ width, height }) {
  return (
    <Image src='/logo.svg' alt='AlChilazo logo' width={width} height={height} />
  )
}
