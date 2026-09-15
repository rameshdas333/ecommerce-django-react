import React from 'react';
import BannerLeft from './BannerLeft.jsx';
import BannerRight from './BannerRight.jsx';

const Banner = () => {
    return (
       <section>
    
        <div className='lg:flex'>
           <div className='lg:w-[20%]'>
            <BannerLeft/>
           </div>
           <div className='pt-5 lg:w-[80%]'>
            <BannerRight/>
           </div>
        </div>
       
       </section>
    );
};

export default Banner;