'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

interface DropdownProps {
  title: string
  items: Array<{ linkTo: string, text: string }>
  styles: string
}

export default function Dropdown ({ items, styles, title }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if ((dropdownRef.current != null) && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  return (
    <div ref={dropdownRef} className='relative'>
      <button
        onClick={toggleDropdown}
        className={`font-bold py-2 px-4 rounded ${styles}`}
      >
        {title}
      </button>
      {isOpen && (
        <div className='absolute rounded-md shadow-lg bg-al-gray'>
          {
            items.map(({ linkTo, text }, index) => (
              <Link key={index} href={linkTo} className='block px-4 py-2 text-gray-800 hover:bg-al-orange hover:text-white hover:rounded-md'>
                {text}
              </Link>
            ))
            }
        </div>
      )}
    </div>
  )
}
