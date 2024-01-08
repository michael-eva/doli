
import SignUp from "./pages/SignUp"
import NavBar from "./components/NavBar"
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import ManageListings from "./pages/ManageListings"
import About from "./pages/About"
import Specials from "./pages/Specials"
import PostForm from "./pages/PostForm"
import AuthRequired from "./Auth/AuthRequired"
import ResetPassword from "./components/ResetPassword"
import Validation from "./Jod/Validation"
import JodRequired from "./Jod/JodRequired"
import NotFound from "./pages/NotFound"
import EditPost from "./pages/EditPost"
import Wholesale from "./pages/Wholesale"


function App() {

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<AuthRequired />}>
          <Route path="post-listing" element={<PostForm postData={undefined} />} />
          <Route path="manage-listings" element={<ManageListings />} />
          <Route path="update-details" element={<SignUp />} />
          <Route path="manage-listings" element={<ManageListings />} />
          <Route path="edit-post/:postId" element={<EditPost />} />
          <Route element={<JodRequired />} >
            <Route path="validate-updates" element={<Validation />} />
          </Route>
        </Route>
        <Route path="member-register" element={<SignUp />} />
        <Route path="login" element={<Login />} />
        <Route path="about" element={<About />} />
        <Route path="specials" element={<Specials />} />
        <Route path="wholesale" element={<Wholesale />} />
        < Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
