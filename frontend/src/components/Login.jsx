import React from 'react'
import {FcGoogle} from 'react-icons/fc';
import sharemeVideo from '../assets/share.mp4';
import { GoogleLogin } from '@react-oauth/google';
import logo from '../assets/logowhite.png';
import jwt_decode from "jwt-decode";
import { client } from '../client';
import { useNavigate } from 'react-router-dom';
 

const Login = () => {

  const navigate= useNavigate()
  

  return (
    <div className='flex justify-start items-center flex-col '>
      <div className='relative w-full h-full'>
      <video 
      src={sharemeVideo}
      typeof='video/mp4'
      loop
      controls={false}
      muted
      autoPlay
      className='w-full h-full object-cover'
      />
  <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
    <div className='p-5'>
    <img src={logo} alt="" width='130px'  />
    </div>
    <div className='shadow-2xl'>
      <GoogleLogin
      
      render={(renderProps)=> (
          <button
          type='button'
          disabled={renderProps.disabled}
          onClick={renderProps.onClick}
          className='bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none'
          >
            <FcGoogle className='mr-4' /> Sign in with Google
          </button>
      ) }
      onSuccess={(credentialResponse)=>{

        const decode = jwt_decode(credentialResponse.credential)
        
        localStorage.setItem('user',JSON.stringify(decode))

        const {aud , name , picture} = decode

        const doc ={
          _id:aud,
          _type:'user',
          userName:name,
          image:picture,

        }

        client.createIfNotExists(doc).then((res)=>{
          navigate('/', {replace:true} )
        })

      }}
      onError={()=>{
        console.log('error');
      }}
      cookiePolicy='single_host_origin'
      

      />
      
      
      
      

    </div>
  </div>
      </div>
    </div>
  )
}

export default Login