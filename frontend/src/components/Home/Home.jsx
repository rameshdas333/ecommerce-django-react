import React from 'react'
import {useState, useEffect} from 'react'
import BestSellingProduct from '../Home/BestSellingProduct.jsx';






const Home = () => {
  const [message, setMessage] = useState('');
  useEffect(() => {
    fetch('http://localhost:8000/api/')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error fetching data:', error));
  }, []);
  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
       <h1 className=''>Welcome to the React Frontend!</h1>
     <h1 className="">{message} || Loading...</h1>
     <BestSellingProduct/>
   
    </div>
  )
}

export default Home
