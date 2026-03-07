import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/authContext.jsx'
import React from 'react'

const RoleBasedRoutes = ({children,requiredRole}) => {
    const {user,loading} = useAuth()
if(loading){
    return <div>
        
        <OrbitProgress variant="track-disc" dense color="#32cd32" size="medium" text="" textColor="" />
        
    </div>
}
if(!user){
    return <Navigate to="/login"/>
}
if(!requiredRole.includes(user.role)){
    return <Navigate to="/unauthorized"/>
}
 return children
}

export default RoleBasedRoutes
 
