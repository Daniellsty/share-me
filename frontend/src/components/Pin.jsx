import React, { useState } from 'react'
import { client, urlFor } from '../client';
import {v4 as uuidv4 } from 'uuid';
import {BsDownload} from 'react-icons/bs';
import { AiTwotoneDelete } from 'react-icons/ai';
import {BsFillArrowUpRightCircleFill} from  'react-icons/bs';
import { NavLink, useNavigate } from 'react-router-dom';
import fetchUser from '../utils/fetchUser';
const Pin = ({pin:{postedBy,_id,image,save,destination}}) => {

  
  const navigate= useNavigate()
  const [postHover, setPostHover] = useState(true);
  const [savingPost, setSavingPost] = useState(false);
  const userInfo = fetchUser();
  const savePosts = !!(save?.filter((item)=> item.postedBy._id === userInfo.aud ))?.length
  

  const savePin=(id)=>{


    if(!savePosts){
      setSavingPost(true)

      client.patch(id)
      .setIfMissing({save:[]})
      .insert('after','save[-1]',[{
        _key:uuidv4(),
        userId:userInfo?.aud,
        postedBy:{
          _type:'postedBy',
          _ref:userInfo?.aud
        }
      }])
      .commit()
      .then(()=>{
        window.location.reload();
        setSavingPost(false);
      })
    }

  }

  const deletePin=(id)=>{

    client.delete(id)
    .then(()=>{
      window.location.reload();
    })

  }


  return (
    <div className='mt-5'>
       
        <div 
        onMouseEnter={()=> setPostHover(false) }
        onMouseLeave={()=> setPostHover(true) }
        className='relative cursor-zoom-in w-auto hover:shadow-lg m-4 rounded-lg overflow-hidden transition-all duration-500 ease-in-out '
        onClick={()=> navigate(`/pin-detail/${_id}`)}
        >
      <img src={urlFor(image).width(250).url()} alt="user-post" className='rounded-lg w-full ' />
        {!postHover && (
          <div
           style={{height:'100%'}}
           className='absolute top-0 w-full h-full flex flex-col   justify-between p-1 pr-2 pt-2 pb-2 z-50' >
            <div className='flex justify-between gap-5 ' >
             <a 
             href={`${image?.asset?.url}?dl=`}
             download
             onClick={(e)=> e.stopPropagation() }
             className='bg-white w-9 h-9 rounded-full flex  items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
             >
              <BsDownload/>
             </a>

            {savePosts ? (
              <button 
              type='button'
              className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none '  
              >
               {save?.length} Saved</button>
              ): (

                <button 
                className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none' 
                 type='button'
                 onClick={(e)=>{

                   e.stopPropagation() 
                   savePin(_id)
                 }
                }
                 >
                {savingPost ? 'saving' : 'save' }
              </button>

            ) }

                </div>
                <div className='flex justify-between items-center gap-2 w-full'>
                  {destination && (
                    <a href={destination}
                    target='_blank'
                    rel='noreferrer'
                    className='bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:100 hover:shadow-md'
                    >
                      <BsFillArrowUpRightCircleFill/>
                      {destination.slice(8,16)}
                    </a>
                  ) }
                  {postedBy?._id === userInfo.aud && (
                    <button type='button'
                    onClick={(e)=>{

                      e.stopPropagation() 
                      deletePin(_id)
                      }}
                      className='bg-white opacity-70 hover:opacity-100 text-dark font-bold px-2 py-2 text-base rounded-3xl hover:shadow-md outline-none' 
                    >
                      <AiTwotoneDelete/>
                    </button>
                  ) }

                </div>
          </div>
        ) }
        </div>
        <NavLink to={`user-profile/${postedBy._id}`} className='flex gap-2 mt-2 items-center'>
                    <img
                     className='w-8 rounded-full '
                     src={postedBy.image}
                     alt='user-profile'
                     />
                     <p className='font-semibold capitalize'>{postedBy?.userName}</p>
        </NavLink>
    </div>
  )
}

export default Pin