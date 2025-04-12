import React from 'react'
import Navbar from '../navbar/landing/Navbar'
import FooterSection from '../footer/Footer'

const Layout = ({children}) => {
  return (
    <>
    <Navbar/>
    {children}
    <FooterSection/>
    </>
  )
}

export default Layout
