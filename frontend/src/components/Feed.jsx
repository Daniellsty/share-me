import React, { useEffect, useState } from 'react'
import Spinner from './Spinner';
import { feedQuery, searchQuery } from '../utils/data';
import { useParams } from 'react-router-dom';
import { client } from '../client';
import MasonryLayout from './MasonryLayout';

const Feed = () => {

  const [loading,setLoading] = useState(false);
  const [pins,setPins] = useState([]);
  const {categoryId} = useParams();

  
  useEffect(() => {
  
    setLoading(true)
    if(categoryId){
      const query = searchQuery(categoryId);
     
      client.fetch(query).then((data)=>{
        setPins(data)
        setLoading(false)
    
      })

    }else{
        client.fetch(feedQuery).then((data)=>{
          setPins(data);   
          setLoading(false);
      
        })
    }
  
  }, [categoryId]);

  if(loading) return <Spinner message='we are adding new ideas to your feed!' />

  if(!pins?.length)  return <h2>No pins available</h2>
  return (
    <div>
      {pins && <MasonryLayout pins={pins} /> }
    </div>
  )
}

export default Feed