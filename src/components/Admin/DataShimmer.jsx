import React from 'react'

const DataShimmer = () => {
  return (
    <div className='shimmer__parent'>
      <div className='w-full flex justify-between items-center mb-2 border-b pb-3'>
        <div className='animate w-full h-[25px] max-w-[50px] rounded'></div>
        <div className='flex gap-3'>
          <div className='animate h-[25px] w-[250px] rounded'></div>
          <div className='animate h-[25px] w-[60px] rounded'></div>
          <div className='animate h-[25px] w-[60px] rounded'></div>
          <div className='animate h-[25px] w-[100px] rounded'></div>
          <div className='animate h-[25px] w-[100px] rounded'></div>

          <div className='animate h-[25px] w-[25px] rounded-full'></div>
        </div>
      </div>
      {/* table text */}
      <div className='mt-4'>
        <div className='flex flex-col gap-2'>
          {Array.from({ length: 8 }).map((i, _) =>
            <div key={Math.random()} className='animate w-full h-[20px] rounded'></div>)}
        </div>
      </div>
    </div>
  )
}

export default DataShimmer;
