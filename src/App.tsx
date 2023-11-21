
import MemberRegister from "./components/MemberRegister"
import BusinessRegister from "./pages/BusinessRegister"
import NavBar from "./components/NavBar"
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import supabase from "./config/supabaseClient"
import { useState, useEffect } from "react"
import ManageListings from "./pages/ManageListings"
import About from "./pages/About"





function App() {
  const [session, setSession] = useState<any>("")

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // // Listen for changes in authentication state
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });


  }, [])

  return (
    <>

      <NavBar session={session} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="business-register" element={<BusinessRegister />} />
        <Route path="member-register" element={<MemberRegister />} />
        <Route path="login" element={<Login />} />
        <Route path="manage-listings" element={<ManageListings />} />
        <Route path="about" element={<About />} />
      </Routes>
    </>
  )
}

export default App
