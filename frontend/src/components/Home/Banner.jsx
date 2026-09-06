import React from 'react';
import BannerLeft from '../Home/BannerLeft.jsx';
import BannerRight from '../Home/BannerRight.jsx';

const Banner = () => {
    return (
       <section>
    
        <div className='lg:flex'>
           <div className='lg:w-[20%]'>
            <BannerLeft/>
           </div>
           <div className='pt-10 lg:w-[80%]'>
            <BannerRight/>
           </div>
        </div>
       
       </section>
    );
};

export default Banner;