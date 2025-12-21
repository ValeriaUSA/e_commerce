// import { Route, Routes } from "react-router-dom"
// import Home from "../views/Home"
// import Register from "../views/Register"
// import Login from "../views/Login"
// import AdminBooks from "../views/AdminBooks"

// const AppRoutes = () => {
//   return (

//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/register" element={<Register />}/>
//       <Route path="/login" element={<Login />}/>
//        {/* ADMIN ROUTES */}
//       <Route path="/admin/books" element={<AdminBooks />} />

//     </Routes>
//   )
// }

// export default AppRoutes


import { Route, Routes } from "react-router-dom";
import Home from "../views/Home";
import Register from "../views/Register";
import Login from "../views/Login";
import AdminBooks from "../views/AdminBooks";

import ProtectedAdmin from "../components/ProtectedAdmin";

const AppRoutes = () => {
  return (
    <Routes>
      
      {/* PUBLIC ROUTES - ANYONE CAN SEE */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />}/>
      <Route path="/login" element={<Login />}/>
      
      {/* ADMIN PROTECTED ROUTES */}
      <Route 
        path="/admin/books" 
        element={
          <ProtectedAdmin>
            <AdminBooks />
          </ProtectedAdmin>
        } 
      />

    </Routes>
  );
};

export default AppRoutes;