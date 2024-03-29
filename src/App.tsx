
import SignUp from "./pages/SignUp/SignUp"
import NavBar from "./components/NavBar"
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home/Home"
import Login from "./pages/Login"
import ManageListings from "./pages/ManageListings/ManageListings"
import About from "./pages/About"
import Specials from "./pages/Specials"
import PostForm from "./components/PostForm/PostForm"
import AuthRequired from "./Auth/AuthRequired"
import JodRequired from "./Jod/JodRequired"
import NotFound from "./pages/NotFound"
import EditPost from "./pages/EditPost/EditPost"
import Wholesale from "./pages/Wholesale"
import SeedForm from "./seed/SeedForm"
import ResetPassword from "./components/ResetPassword"
import Validation from "./Jod/Validation"
import { ClaimedOwnership } from "./Jod/ClaimedOwnership"
import UpdateEmail from "./components/Modals/UpdateEmail"
import { MdOutlineEmail } from "react-icons/md";
import Footer from "./components/Footer"
import Dashboard from "./Jod/Dashboard"
import { Helmet } from "react-helmet"
import { HelmetProvider } from 'react-helmet-async';



function App() {
  return (
    <>
      <HelmetProvider>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <div className=" flex items-center justify-center md:justify-end md:pr-10 border-b gap-2 p-2">
            <MdOutlineEmail />
            Get in touch with us -{' '}
            <a href="mailto:admin@doli.com.au" className="font-bold" style={{ color: "#4d9da8" }} >
              admin@doli.com.au
            </a>
          </div>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/update-email" element={<UpdateEmail />} />
            <Route element={<AuthRequired />}>
              <Route path="post-listing" element={<PostForm postData={undefined} name={""} description={""} />} />
              <Route path="manage-listings" element={<ManageListings />} />
              <Route path="update-details" element={<SignUp />} />
              <Route path="manage-listings" element={<ManageListings />} />
              <Route path="edit-post/:postId" element={<EditPost />} />
              <Route element={<JodRequired />} >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="dashboard/validate" element={<Validation />} />
                <Route path="dashboard/unclaimed-posts" element={<ClaimedOwnership />} />
              </Route>
              <Route path="seed" element={<SeedForm />} />
            </Route>
            <Route path="member-register" element={<SignUp />} />
            <Route path="login" element={<Login />} />
            <Route path="about" element={<About />} />
            <Route path="specials" element={<Specials />} />
            <Route path="wholesale" element={<Wholesale />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div >
      </HelmetProvider>
    </>
  )
}

export default App
