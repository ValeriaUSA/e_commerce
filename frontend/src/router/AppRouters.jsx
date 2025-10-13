import { Route, Routes } from "react-router-dom"
import Home from "../views/Home"
import Register from "../views/Register"
import Login from "../views/Login"

const AppRoutes = () => {
  return (

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />}/>
      <Route path="/login" element={<Login />}/>

    </Routes>
  )
}

export default AppRoutes