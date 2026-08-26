import React from 'react'
import {useState, useEffect} from 'react'





const Home = () => {
  const [message, setMessage] = useState('');
  useEffect(() => {
    fetch('http://localhost:8000/api/')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error fetching data:', error));
  }, []);
  return (
    <div className="">
       <h1 className=''>Welcome to the React Frontend!</h1>
     <h1 className="">{message} || Loading...</h1>
    </div>
  )
}

export default Home
