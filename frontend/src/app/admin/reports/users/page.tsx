'use client'
import baseUrl from '@/constants/baseUrl'
import { UserReport } from '@/types/interfaces'
import { useEffect, useState } from 'react'

export default function Page () {
  const [reportUsersData, setReportUsersData] = useState<UserReport>({ enabledUsers: 0, disabledUsers: 0 })

  useEffect(() => {
    const fetchReportUsersData = async () => {
      const response = await fetch(`${baseUrl}/admin/reports`)
      const data = await response.json()
      setReportUsersData(data)
    }
    void fetchReportUsersData()
  })

  return (
    <main className='h-screen'>
      <section className='flex justify-center items-center py-20'>
        <div className='space-y-14'>
          <h1 className='font-bold text-2xl text-orange-500 text-center'>Reporte de Usuarios</h1>
          <section className='flex flex-col items-center border border-spacing-1 border-amber-400 rounded-lg p-4'>
            <div className='flex flex-row items-center'>
              <div className='flex flex-row items-center space-x-4'>
                <h2 className='text-xl text-justify'>Usuarios habilitados: </h2>
                <h2 className='text-3xl text-justify font-bold text-al-yellow'>{reportUsersData.enabledUsers}</h2>
              </div>
            </div>
            <div className='flex flex-row items-center'>
              <div className='flex flex-row items-center space-x-4'>
                <h2 className='text-xl text-justify'>Usuarios deshabilitados: </h2>
                <h2 className='text-3xl text-justify font-bold text-al-yellow'>{reportUsersData.disabledUsers}</h2>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
