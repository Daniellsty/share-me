import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from "./components/Login"
import Home from "./container/Home"
import { Routes , Route , useNavigate } from "react-router-dom"
import fetchUser from './utils/fetchUser';
import { useEffect } from 'react';

function App() {

  const navigte = useNavigate();
  useEffect(() => {
   const user = fetchUser();
   if(!user) navigte('/login')
  }, []);
 
  return (
    <GoogleOAuthProvider  clientId={import.meta.env.VITE_API_GOOGLE_TOKEN}>

    <Routes>
     <Route  path="/login" element={<Login/>} />
     <Route  path="/*" element={<Home/>} />
    </Routes>
     </GoogleOAuthProvider>
  )
}

export default App
