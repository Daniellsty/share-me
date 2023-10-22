import React from 'react'
import {BallTriangle} from 'react-loader-spinner';
const Spinner = ({message}) => {
  return (
    <div className='flex flex-col justify-center items-center w-full h-full mt-5'>
        <BallTriangle
        type='Circles'
        color="#00BFFF"
        height={50}
        width={200}
        ariaLabel='loading'
        />
        <p className='text-lg text-center px-2'>{message}</p>
    </div>
  )
}

export default Spinner