// import BusinessRegister from "./components/BusinessRegister"
// import MemberRegister from "./components/MemberRegister"
import BusinessRegister from "./pages/BusinessRegister"
import NavBar from "./components/NavBar"
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"


function App() {


  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="register" element={<BusinessRegister />} />
      </Routes>
      {/* <BusinessRegister /> */}
      {/* <MemberRegister /> */}
      {/* <Card /> */}
    </>
  )
}

export default App
