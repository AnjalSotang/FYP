import React from 'react'
import Navbar from '../Navbar'
import FooterSection from '../Footer'

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
