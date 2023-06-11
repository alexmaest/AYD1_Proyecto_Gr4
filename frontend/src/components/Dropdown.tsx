'use client'

import { useState } from 'react'
import Link from 'next/link'

interface DropdownProps {
  title: string
  items: Array<{ linkTo: string, text: string }>
  styles: string
}

export default function Dropdown ({ items, styles, title }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className='relative'>
      <button
        onClick={toggleDropdown}
        className={`font-bold py-2 px-4 rounded ${styles}`}
      >
        {title}
      </button>
      {isOpen && (
        <div className='absolute bg-white rounded-md shadow-lg'>
          {
            items.map(({ linkTo, text }, index) => (
              <Link key={index} href={linkTo} className='block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white'>
                {text}
              </Link>
            ))
            }
        </div>
      )}
    </div>
  )
}
