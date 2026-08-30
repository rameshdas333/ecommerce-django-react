import React from 'react'
import Navbar from '../navbar/Navbar'
import Footer from '../footer/Footer.jsx'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
   <>
     <Navbar />
     <main>
       <Outlet />
     </main>
     <Footer />
   
   
   </>
  )
}

export default Layout
