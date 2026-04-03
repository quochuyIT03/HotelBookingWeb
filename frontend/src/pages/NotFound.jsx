import React from 'react'
import notfoundimg from '../assets/notfound.jpg'

const NotFound = () => {
  return (
    <div className='items-center justify-center text-center flex flex-col min-h-screen w-full'>
      <img className='max-w-full mb-6 w-96' src={notfoundimg} alt="notfound" />
        <h1> Page Not Found </h1>
        <a href='/' className='inline-block px-6 py-3 mt-6 font-medium transition shadow-md bg-primary-foreground'>  Return Home Page </a>
    </div>
  )
}

export default NotFound