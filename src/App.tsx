
import SignUp from "./components/SignUp"
import NavBar from "./components/NavBar"
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import ManageListings from "./pages/ManageListings"
import About from "./pages/About"
import Specials from "./pages/Specials"
import PostForm from "./pages/PostForm"
import AuthRequired from "./Auth/AuthRequired"
import Validation from "./Jod/Validation"
import JodRequired from "./Jod/JodRequired"
import NotFound from "./pages/NotFound"
import EditPost from "./pages/EditPost"
import Wholesale from "./pages/Wholesale"
import SeedForm from "./seed/seedForm"



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
        <Route path="*" element={<NotFound />} />
        <Route path="seed" element={<SeedForm />} />
      </Routes>
    </>
  )
}

export default App
