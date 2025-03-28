import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const Protected = ({children}) => {
    const {token} = useSelector((state)=> state.auth)
    const isAuthenticated = token || localStorage.getItem('token')

    if(!isAuthenticated){
        return <Navigate to= "/Login" />
    }else{
        return( <>{children}</>)
             
    }
}

export default Protected
