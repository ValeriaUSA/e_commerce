import { NavLink } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../contexts/GlobalContext.jsx";
import logo from "../../images/logo.png";
import "./menu.css";
import CartWidget from "../CartWidget.jsx"

export default function Menu({ toggleCart }) {
  const { user, logout, categories, loadingCategories } = useContext(GlobalContext);


  const [loading, setLoading] = useState(true);

  const handleLogout = () => logout();

  const getUserDisplayName = () => {
    if (!user) return null;
    const { gender, familyname, name } = user;
    if (familyname && gender) {
      if (gender === "female") return `Madame ${familyname}`;
      if (gender === "male") return `Mr ${familyname}`;
    }
    return name || "User";
  };



  return (
    <div className="masthead_navbar_wrapper">
      <nav className="navbar navbar-expand-lg book-navbar container-fluid">
        {/* Logo */}
        <NavLink className="navbar-brand ms-5 d-flex align-items-center" to="/">
          <img
            src={logo}
            alt="Site Logo"
            className="img-fluid"
            style={{ maxHeight: "120px", marginRight: "8px" }}
          />
          <span>BookVami</span>
        </NavLink>

        {/* Hamburger */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center me-5">

            {/* Books mega dropdown */}
            <li className="nav-item dropdown position-static">
              <NavLink
                className="nav-link dropdown-toggle"
                to="#"
                id="booksDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Books
              </NavLink>

              <div className="dropdown-menu dropdown-mega w-100" aria-labelledby="booksDropdown">
                <div className="container">
                  <div className="row">
                    {loadingCategories ? (
                      <div className="col-12">
                        <span className="dropdown-item disabled">Loading...</span>
                      </div>
                    ) : categories.length > 0 ? (
                      categories.map(cat => (
                        <div className="col-lg-4 col-md-6 mb-2" key={cat.category_id}>
                          <NavLink
                            className="dropdown-item"
                            to={`/products/category/${cat.category_id}`}
                          >
                            {cat.categoryName}
                          </NavLink>
                        </div>
                      ))
                    ) : (
                      <div className="col-12">
                        <span className="dropdown-item disabled">No categories found</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
            <li className="nav-item me-3">

              <CartWidget toggleCart={toggleCart} />
            </li>



            {/* User links */}
            {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link disabled text-light fw-bold">👋 {getUserDisplayName()}</span>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="btn btn-outline-light btn-sm ms-lg-2"
                    to="/"
                    onClick={handleLogout}
                  >
                    Logout
                  </NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <NavLink className="btn btn-outline-light btn-sm ms-lg-2" to="/login">
                  Login
                </NavLink>
              </li>
            )}

          </ul>
        </div>
      </nav>
    </div>
  );
}




