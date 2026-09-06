import React from 'react'
import {useState, useEffect} from 'react'
import BestSellingProduct from '../Home/BestSellingProduct.jsx';
import MusicExperience from './MusicExprience.jsx';
import NewArrival from './NewArrival.jsx';
import OurProducts from './OurProducts.jsx';
import BrowseCategory from './BrowseCategory.jsx';
import Banner from './Banner.jsx';






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
     <Banner/>
     <BrowseCategory/>
     <BestSellingProduct/>
     <MusicExperience/>
      <OurProducts/>
     <NewArrival/>
    
    </div>
  )
}

export default Home
