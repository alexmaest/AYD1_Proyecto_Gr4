export default function SuccessAlert ({ title, description }: { title: string, description: string }) {
  return (
    <div className='p-4 mb-4 text-sm  rounded-lg bg-gray-800 text-green-400' role='alert'>
      <span className='font-medium'>{title}</span> {description}
    </div>
  )
}
