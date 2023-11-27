
import MemberRegister from "./components/MemberRegister"
import BusinessRegister from "./pages/BusinessRegister"
import NavBar from "./components/NavBar"
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import ManageListings from "./pages/ManageListings"
import About from "./pages/About"
import Specials from "./pages/Specials"
import { useUser } from "@supabase/auth-helpers-react"


function App() {

  const user = useUser()

  // console.log(user);

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="business-register" element={<BusinessRegister />} />
        <Route path="member-register" element={<MemberRegister />} />
        <Route path="login" element={<Login />} />
        <Route path="manage-listings" element={<ManageListings />} />
        <Route path="about" element={<About />} />
        <Route path="specials" element={<Specials />} />
      </Routes>
    </>
  )
}

export default App
