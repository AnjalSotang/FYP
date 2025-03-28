import React from 'react'
import Navbar from '../navbar/Navbar'
import FooterSection from '../navbar/Footer'

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
