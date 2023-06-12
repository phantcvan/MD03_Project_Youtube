import React from 'react';
import { AiOutlineClose } from "react-icons/ai";

const Upload = ({ setOpen }) => {

  return (
    <div className='w-[100%] h-[100%] absolute top-0 left-0 bg-overlay-40 flex items-center justify-center z-20'>
      <div className='w-[600px] h-[600px] bg-yt-black text-yt-white p-5 flex flex-col gap-5 relative'>
        <div className='absolute top-4 right-4 cursor-pointer'
          onClick={() => setOpen(false)}>
          <AiOutlineClose />
        </div>
        <p className='text-center text-2xl font-semibold'>
          Upload a new Video
        </p>
        <div className='border-solid border-1 px-2 bg-transparent border-inherit flex flex-col '>
          <form action="/api/v1/upload" method="post" enctype="multipart/form-data"
           className='flex flex-col'>
            <div className='flex items-center font-medium'>
            <label htmlFor="">Video</label>
            <input type="file"  name="video" 
            className='rounded-md m-2 border-solid border-1 p-4 bg-transparent'/>
            </div>
            <input type="text"
              className='rounded-md m-2 border-solid border-1 p-4 bg- bg-yt-light-1 focus:outline-none'
              placeholder='Title' />
            <textarea type="text"
              className='rounded-md m-2 border-solid border-1 p-4 bg-yt-light-1 focus:outline-none'
              placeholder='Description'
              rows={8} />
            <button>Upload</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Upload