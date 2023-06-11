import Image from 'next/image'

export default function Logo ({ width, height, className }: { width: number, height: number, className?: string }) {
  return (
    <div className={className}>
      <Image src='/logo.svg' alt='AlChilazo logo' width={width} height={height} />
    </div>
  )
}
