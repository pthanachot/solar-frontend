import { Skeleton } from '../ui/skeleton'

const DropdownSkeleton = () => {
  return (
    <div className='space-y-2 px-4 py-4'>
      <Skeleton className='h-5 w-1/2' />
      <Skeleton className='h-5 w-full' />
      <Skeleton className='h-5 w-full' />
    </div>
  )
}

export default DropdownSkeleton
