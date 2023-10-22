import React from 'react'
import {RiHomeFill} from 'react-icons/ri';
import {IoIosArrowForward} from 'react-icons/io';
import logo from '../assets/logo.png'
import { NavLink } from 'react-router-dom';
import { categories } from '../utils/data';
const Sidebar = ({user,closeToggle}) => {

  const isNotActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize';
  const isActiveStyle = 'flex  items-center px-5 gap-3 font-extrabold border-r-2 border-black  transition-all duration-200 ease-in-out capitalize';
  
  

  


  const handleCloseSideBar=()=>{
    if(closeToggle){
      closeToggle(false)
    }
  }

  return (
    <div className='flex flex-column    h-full overflow-y-scrikk min-w-210 hide-scrollbar'>
      <div className='flex-flex-col w-full '>
      <NavLink to='/' className='flex px-5 gap-2 my-6 pt-1 w-190 items-center' onClick={handleCloseSideBar}>
        <img src={logo} alt="logo" className='w-full ' />


      </NavLink>
      <div className='flex flex-col   gap-5'>
        <NavLink to='/' className={({isActive})=> isActive ? isActiveStyle : isNotActiveStyle }>
        <RiHomeFill />
        Home
        </NavLink>
        <h3 className='mt-2 px-5 text-base 2xl:text-xl'>Discover categories</h3>
        {categories.slice(0,categories.length -1).map((item)=>(
          <NavLink to={`/category/${item.name}`} className={({isActive})=> isActive ? isActiveStyle : isNotActiveStyle } 
        
          key={item.name} >
            <img src={item.image} alt="category" 
            className='w-8 h-8 rounded-full shadow-sm '
            />
            {item.name}
          </NavLink>
        ))}
      </div>
      </div>
    

    </div>
  )
}

export default Sidebar