
import { Route, Routes } from "react-router-dom";
import Home from "../views/Home";
import Register from "../views/Register";
import Login from "../views/Login";
import BooksAdmin from "../views/BooksAdmin";
import ProtectedAdmin from "../components/admin/ProtectedAdmin";

const AppRoutes = () => {
  return (
    <Routes>

      {/* ALL PUBLIC ROUTES */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* ADMIN PROTECTED ROUTES */}
      <Route
        path="/admin/books"
        element={
          <ProtectedAdmin>
            <BooksAdmin />
          </ProtectedAdmin>
        }
      />

    </Routes>
  );
};

export default AppRoutes;