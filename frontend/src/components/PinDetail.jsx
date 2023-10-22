import React, { useEffect, useState } from 'react'
import { MdDownloadForOffline } from 'react-icons/md'
import {v4 as uuidv4} from 'uuid';
import { client , urlFor } from '../client';
import Spinner from './Spinner';
import { NavLink, useParams } from 'react-router-dom';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import { BsDownload } from 'react-icons/bs';
import MasonryLayout from './MasonryLayout'

const PinDetail = ({user}) => {

  const [pins, setPins] = useState(null);
  const [pinDetails, setPinDetails] = useState(null);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);



  const {pinId} = useParams();

  const fetchDetails =()=>{
    
    let query = pinDetailQuery(pinId);
  
    if(query){
      client.fetch(query)
      .then((data)=>{
        
        setPinDetails(data[0]);

        if(data[0]){
          query = pinDetailMorePinQuery(data[0]);

          client.fetch(query)
          .then((res)=> setPins(res));
        };
      });
    };

  }

  const addComment=()=>{

    if(comment){
      setAddingComment(true)
      client.patch(pinId)
      .setIfMissing({comments:[]})
      .insert('after','comments[-1]',[{
        comment,
        _key:uuidv4(),
        postedBy:{
          _type:'postedBy',
          _ref:user._id
        }
      }])
      .commit()
      .then(()=>{
        fetchDetails()
        setComment('');
        setAddingComment(false)
      })
    }

  }

  useEffect(() => {
   fetchDetails()
  }, [pinId]);

  if (!pinDetails) return <Spinner message='Loading pin.'/>;


  return (
    <div
     style={{maxWidth:'1500px',borderRadius:'320px'}}
     className='flex flex-col xl-flex-row m-auto bg-white mt-5 '>
      <div className='flex justify-center items-center md:items-start flex-initial'>
      <img 
      
      src={pinDetails?.image && urlFor(pinDetails.image).url() } alt="user-post" />
      </div>
      <div className='w-full p-5 flex justify-between xl:min-w-620'>
        <div className='flex gap-2 items-center '>
        <a 
             href={`${pinDetails.image?.asset?.url}?dl=`}
             download
             onClick={(e)=> e.stopPropagation() }
             className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
             >
              <BsDownload/>
             </a>
        </div>
        <a 
        href={pinDetails.destination}
        target='_blank'
        rel='noreferrer'
        >
        {pinDetails.destination}

        </a>

      </div>
      <div>
        <h1 className='text-4xl font-bold break-words mt-3'> {pinDetails.title} </h1>
        <p className='mt-3'>{pinDetails.about}</p>
      </div>
      <NavLink to={`user-profile/${pinDetails.postedBy._id}`} className='flex gap-2 mt-5 items-center rounded-lg'>
                    <img
                     className='w-8 rounded-full '
                     src={pinDetails.postedBy.image}
                     alt='user-profile'
                     />
                     <p className='font-semibold capitalize'>{pinDetails.postedBy?.userName}</p>
        </NavLink>
        <h2 className='mt-5 text-2xl' >Comments</h2>
        <div className='max-h-3770 overflow-y-auto'>
          {pinDetails?.comments?.map((item,i)=>{
            return(
              <div className='flex gap-2 mt-5 items-center '>
                  <img
                   src={item.postedBy.image} alt="user-profile" 
                   className='w-10 h-10 rounded-full cursor-pointer'
                  />
                  <div className='flex flex-col '>
                  <p className='font-bold '>{item.postedBy.userName}</p>
                  <p >{item.comment}</p>
                  </div>
              </div>
            )
          })}
        </div>
          <div className='flex flex-wrap my-8 gap-3'>
          <NavLink to={`user-profile/${pinDetails.postedBy._id}`} className='flex gap-2 mt-5 items-center rounded-lg'>
                    <img
                     className='w-10 rounded-full h-10 cursor-pointer'
                     src={pinDetails.postedBy.image}
                     alt='user-profile'
                     />
        </NavLink>
        <input type="text"
        placeholder='Add a comment'
        value={comment}
        onChange={(e)=> setComment(e.target.value) }
        className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-500'
        />
        <button
        type='button'
        onClick={addComment}
        className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
        >
            {addingComment? 'Posting the comment ...' : 'Post' }
        </button>
          </div>

      

    {pins?.length > 0 ? 
    
    (
      <>
        <h2 className='text-center font-bold text-2x mt-8 mb-4'>
        more like this
        </h2>
        <MasonryLayout pins={pins} />
        </>
      ):(
        <Spinner message='Loading like this'/>
        )
        
      }
      </div>
  )
  
}

export default PinDetail;