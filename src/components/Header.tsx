import React from 'react'

const Header = () => {
  return (
    <header className='px-8 py-5'>
        <h1 className='text-4xl flex items-end mb-2'>Md Editor <span className='text-xl ml-2 font-extralight'>with Web Workers</span></h1>
        <p className='text font-light'>Real-time Markdown Parsing using Web Workers</p>
    </header>
  )
}

export default Header