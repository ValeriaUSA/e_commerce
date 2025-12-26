
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from "../../contexts/GlobalContext.jsx";
import logo from "../../images/logo.png";
import "./menu.css";
import CartWidget from "../CartWidget.jsx";

export default function Menu({ toggleCart }) {
  const { user, logout, categories, loadingCategories } = useContext(GlobalContext);

  // --- Utility to CLOSE mobile offcanvas ---
  const closeOffcanvas = () => {
    const el = document.getElementById("offcanvasNavbar");
    if (!el || !window.bootstrap) return;
    const instance = window.bootstrap.Offcanvas.getInstance(el);
    if (instance) instance.hide();
  };

  // --- Logout ---
  const handleLogout = () => {
    logout();
    closeOffcanvas();
  };

  // --- User display name ---
  const getUserDisplayName = () => {
    if (!user) return null;

    if (user.role?.toUpperCase() === "ADMIN") {
      return `ADMIN ${user.familyname ?? ""}`.trim();
    }

    const { gender, familyname, name } = user;
    if (familyname && gender) {
      if (gender === "female") return `Madame ${familyname}`;
      if (gender === "male") return `Mr ${familyname}`;
    }
    return name || "Welcome";
  };

  return (
    <div className="masthead_navbar_wrapper">
      <nav className="navbar navbar-expand-lg book-navbar container-fluid">

        {/* BRAND */}
        <NavLink className="navbar-brand ms-5 d-flex align-items-center" to="/" onClick={closeOffcanvas}>
          <img src={logo} alt="Site Logo" className="img-fluid" style={{ maxHeight: "70px", marginRight: "8px" }} />
          <span>BookVami</span>
        </NavLink>

        {/* HAMBURGER */}
        <button
          className="navbar-toggler me-3"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* DESKTOP NAVBAR */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center me-5">

            {/* BOOKS DROPDOWN */}
            <li className="nav-item dropdown position-static">
              <span
                className="nav-link dropdown-toggle"
                id="booksDropdown"
                role="button"
                data-bs-toggle="dropdown"
              >
                Books
              </span>

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
                          <NavLink className="dropdown-item" to={`/products/category/${cat.category_id}`}>
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

            {/* CART (not for ADMIN) */}
            {user?.role?.toUpperCase() !== "ADMIN" && (
              <li className="nav-item me-3">
                <CartWidget toggleCart={toggleCart} />
              </li>
            )}

            {/* USER ACCOUNT */}
            {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link disabled text-light fw-bold">
                    👋 {getUserDisplayName()}
                  </span>
                </li>

                {/* ADMIN LINKS */}
                {user.role?.toUpperCase() === "ADMIN" && (
                  <>
                    <li className="nav-item">
                      <NavLink className="btn btn-outline-light ms-lg-2" to="/">Shop</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="btn-online-light btn-sm ms-lg-3" to="/admin/books">Books Board</NavLink>
                    </li>
                  </>
                )}

                <li className="nav-item">
                  <button className="btn btn-sm ms-lg-2 btn-primary-inverse" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <NavLink className="btn btn-outline-light ms-lg-2" to="/login">Login</NavLink>
              </li>
            )}
          </ul>
        </div>

        {/* MOBILE OFFCANVAS MENU */}
        <div className="offcanvas offcanvas-start" id="offcanvasNavbar">

          <div className="offcanvas-header book-offcanvas-header">
            <h5 className="offcanvas-title">BookVami Menu</h5>
            <button className="btn-close text-reset" data-bs-dismiss="offcanvas"></button>
          </div>

          <div className="offcanvas-body book-offcanvas-body">
            <ul className="navbar-nav">

              {/* BOOKS LIST (mobile) */}
              <li className="nav-item dropdown">
                <span className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                  Books
                </span>
                <ul className="dropdown-menu">
                  {loadingCategories ? (
                    <li><span className="dropdown-item disabled">Loading...</span></li>
                  ) : categories.length > 0 ? (
                    categories.map(cat => (
                      <li key={cat.category_id}>
                        <NavLink
                          className="dropdown-item"
                          to={`/products/category/${cat.category_id}`}
                          onClick={closeOffcanvas}
                        >
                          {cat.categoryName}
                        </NavLink>
                      </li>
                    ))
                  ) : (
                    <li><span className="dropdown-item disabled">No categories found</span></li>
                  )}
                </ul>
              </li>

              {/* USER GREETING */}
              {user && (
                <li className="nav-item">
                  <span className="nav-link disabled fw-bold">👋 {getUserDisplayName()}</span>
                </li>
              )}

              {/* CART (mobile) */}
              {user?.role?.toUpperCase() !== "ADMIN" && (
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link text-start w-100"
                    onClick={() => {
                      closeOffcanvas();
                      toggleCart();
                    }}
                  >
                    Cart
                  </button>
                </li>
              )}

              {/* ADMIN LINKS (mobile) */}
              {user?.role?.toUpperCase() === "ADMIN" && (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/" onClick={closeOffcanvas}>Shop</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/books" onClick={closeOffcanvas}>Books Board</NavLink>
                  </li>
                </>
              )}

              {/* LOGIN / LOGOUT */}
              {user ? (
                <li className="nav-item">
                  <button className="nav-link btn btn-link text-start" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              ) : (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login" onClick={closeOffcanvas}>Login</NavLink>
                </li>
              )}

            </ul>
          </div>
        </div>

      </nav>
    </div>
  );
}




