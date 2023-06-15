export default function SuccessAlert ({ title, description }: { title: string, description: string }) {
  return (
    <div className='p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400' role='alert'>
      <span className='font-medium'>{title}</span> {description}
    </div>
  )
}
