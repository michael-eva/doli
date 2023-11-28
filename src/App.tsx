
import MemberRegister from "./components/MemberRegister"
import BusinessRegister from "./pages/BusinessRegister"
import NavBar from "./components/NavBar"
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import ManageListings from "./pages/ManageListings"
import About from "./pages/About"
import Specials from "./pages/Specials"
import AddPost from "./pages/AddPost"


function App() {

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="business-register" element={<AddPost />} />
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
