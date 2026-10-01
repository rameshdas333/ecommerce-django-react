import React from 'react'
import {useState, useEffect} from 'react'
import BestSellingProduct from './BestSellingProduct.jsx';
import MusicExperience from './MusicExprience.jsx';
import NewArrival from './NewArrival.jsx';
import OurProducts from './OurProducts.jsx';
import BrowseCategory from './BrowseCategory.jsx';
import Banner from './Banner.jsx';






const BASEURL = (
  import.meta.env.VITE_DJANGO_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

const Home = () => {
  const [message, setMessage] = useState('');
  useEffect(() => {
    fetch(`${BASEURL}/api/`)
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
