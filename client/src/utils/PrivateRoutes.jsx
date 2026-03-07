import { useAuth } from '../../context/authContext.jsx';
import React from 'react'
import {Navigate} from "react-router-dom"

const PrivateRoutes = ({children}) => {
    const {user,loading} = useAuth();
 if(loading){
    return <div>
      <OrbitProgress variant="track-disc" dense color={["","","",""]} size="medium" text="" textColor="" />
    </div>
 }
 return user?children:<Navigate to="/"/>
}

export default PrivateRoutes
