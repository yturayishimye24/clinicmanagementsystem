import React from "react";
import { createContext, useState, useContext,useEffect } from "react";
import {useNavigate} from "react-router-dom"
import axios from "axios"
const userContext = createContext();

export const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading,setLoading] = useState(false);
   useEffect(()=>{
    const verfifyUser = async()=>{
      const token = localStorage.getItem('token')
      
      try{
       if(token){
       const response = await axios.get("http://localhost:4000/api/verify",{
         headers:{
        "Authorization": `Bearer ${token}`
         }
       })
       if(response.data.success){
        setLoading(true);
        setUser(response.data.user)
       }
      }else{
        setUser(null)
      }
      }catch(error){
        if(error.response && !error.response.data.error){
          setUser(null)
        }
      }
    }
    verfifyUser();
   },[])

  const login = (user) => {
    setUser(user);
  };

  const logout = () => {
    setLoading(true)
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("username")
  };
  
  return (
    <userContext.Provider value={{ user, login, logout,loading}}>
      {children}
    </userContext.Provider>
  );
};

export const useAuth = () => useContext(userContext);
