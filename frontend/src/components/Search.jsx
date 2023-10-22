import React, { useEffect, useState } from 'react'
import Spinner from './Spinner';
import MasonryLayout from './MasonryLayout';
import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';

const Search = ({searchTerm,setSearchTerm}) => {

  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if(searchTerm){
      setLoading(true);
      const query = searchQuery(searchTerm.toLowerCase())
      client.fetch(query)
      .then((data)=>{
        setLoading(false)
        setPins(data)
      })
    }else{
      client.fetch(feedQuery)
      .then((data)=>{
        setLoading(false)
        setPins(data)
      })
    }

   
  }, [searchTerm]);

  return (
    <div>
      {loading && <Spinner message='Searching for pins' /> }
      {pins?.length !== 0 && <MasonryLayout pins={pins} />  }
      {pins?.length === 0 && searchTerm !== '' && !loading && (
        <div className='mt-10 text-center text-xl '>No pins</div>
      ) }
    </div>
  )
}

export default Search