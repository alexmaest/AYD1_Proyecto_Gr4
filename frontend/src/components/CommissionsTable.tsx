import { Commission } from '@/types/interfaces'

interface IProps {
  commissions: Commission[]
  total: number
}

function CommissionsTable ({ commissions, total }: IProps) {
  return (
    <div className='flex flex-col w-full mt-4 py-4 rounded-lg'>
      <div className='overflow-x-auto'>
        <div className='align-middle inline-block min-w-full'>
          <table className='min-w-full'>
            <thead>
              <tr className='border-b-2 border-al-gray'>
                <th className='px-6 py-3 text-left text-xs font-medium text-al-gray uppercase tracking-wider'>
                  Orden No.
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-al-gray uppercase tracking-wider'>
                  Fecha
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-al-gray uppercase tracking-wider'>
                  Estado
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-al-gray uppercase tracking-wider'>
                  Total
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-al-gray uppercase tracking-wider'>
                  Comisión
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-al-gray'>
              {commissions.map((commission: Commission, index) => (
                <tr key={index}>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-al-gray'>
                    {commission.order_id}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-al-gray'>
                    {commission.order_date}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-al-gray'>
                    {commission.state}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-al-gray'>
                    {commission.total}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-al-gray'>
                    {commission.commission}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className='flex flex-row justify-end mt-4 border-t-2 border-al-gray py-2'>
        <p className='text-xl font-bold text-al-gray'>Total: </p>
        <p className='text-xl font-bold text-al-gray ml-2'>{total}</p>
      </div>
    </div>
  )
}

export default CommissionsTable
