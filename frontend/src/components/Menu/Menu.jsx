import { NavLink } from "react-router-dom";
import { useContext, useState, useEffect} from "react";
import { GlobalContext } from "../../contexts/GlobalContext.jsx";
import logo from "../../images/logo.png";
import "../Menu/menu.css"
import CartWidget from "../CartWidget.jsx";

// export default function Menu({ toggleCart }) {
//   const { user, logout, categories, loadingCategories } = useContext(GlobalContext);

//   // --- Utility to CLOSE mobile offcanvas ---
//   const closeOffcanvas = () => {
//     const el = document.getElementById("offcanvasNavbar");
//     if (!el || !window.bootstrap) return;
//     const instance = window.bootstrap.Offcanvas.getInstance(el);
//     if (instance) instance.hide();
//   };

//   // --- Logout ---
//   const handleLogout = () => {
//     logout();
//     closeOffcanvas();
//   };

//   // --- User display name ---
//   const getUserDisplayName = () => {
//     if (!user) return null;
//     if (user.role?.toUpperCase() === "ADMIN") {
//       return `ADMIN ${user.familyname ?? ""}`.trim();
//     }
//     const { gender, familyname, name } = user;
//     if (familyname && gender) {
//       if (gender === "female") return `Madame ${familyname}`;
//       if (gender === "male") return `Mr ${familyname}`;
//     }
//     return name || "Welcome";
//   };

//   // --- Reusable Category Links ---
//   const CategoryLinks = ({ mobile = false }) => {
//     if (loadingCategories) return <span className="dropdown-item disabled">Loading...</span>;
//     if (!categories.length) return <span className="dropdown-item disabled">No categories found</span>;

//     return categories.map(cat => (
//       mobile ? (
//         <li key={cat.category_id}>
//           <NavLink
//             className="dropdown-item"
//             to={`/products/category/${cat.category_id}`}
//             onClick={closeOffcanvas}
//           >
//             {cat.categoryName}
//           </NavLink>
//         </li>
//       ) : (
//         <div className="col-lg-4 col-md-6 mb-2" key={cat.category_id}>
//           <NavLink className="dropdown-item" to={`/products/category/${cat.category_id}`}>
//             {cat.categoryName}
//           </NavLink>
//         </div>
//       )
//     ));
//   };

//   return (
//     <div className="masthead_navbar_wrapper">
//       <nav className="navbar navbar-expand-lg book-navbar container-fluid">

//         {/* BRAND */}
//         <NavLink className="navbar-brand ms-5 d-flex align-items-center" to="/" onClick={closeOffcanvas}>
//           <img src={logo} alt="Site Logo" className="img-fluid" style={{ maxHeight: "70px", marginRight: "8px" }} />
//           <span>BookVami</span>
//         </NavLink>

//         {/* HAMBURGER */}
//         <button
//           className="navbar-toggler me-3"
//           type="button"
//           data-bs-toggle="offcanvas"
//           data-bs-target="#offcanvasNavbar"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         {/* DESKTOP NAVBAR */}
//         <div className="collapse navbar-collapse" id="navbarNav">
//           <ul className="navbar-nav ms-auto align-items-lg-center me-5">

//             {/* BOOKS DROPDOWN (desktop) */}
//             <li className="nav-item dropdown position-static">
//               <span
//                 className="nav-link dropdown-toggle"
//                 id="booksDropdown"
//                 role="button"
//                 data-bs-toggle="dropdown"
//               >
//                 Books
//               </span>

//               <div className="dropdown-menu dropdown-mega w-100" aria-labelledby="booksDropdown">
//                 <div className="container">
//                   <div className="row">
//                     <CategoryLinks />
//                   </div>
//                 </div>
//               </div>
//             </li>

//             {/* CART (not for ADMIN) */}
//             {user?.role?.toUpperCase() !== "ADMIN" && (
//               <li className="nav-item me-3">
//                 <CartWidget toggleCart={toggleCart} />
//               </li>
//             )}

//             {/* USER greeting & ADMIN LINKS */}
//             {user ? (
//               <>
//                 <li className="nav-item">
//                   <span className="nav-link disabled text-light fw-bold">
//                     👋 {getUserDisplayName()}
//                   </span>
//                 </li>

//                 {user.role?.toUpperCase() === "ADMIN" && (
//                   <>
//                     <li className="nav-item">
//                       <NavLink className="btn btn-outline-light ms-lg-2" to="/">Shop</NavLink>
//                     </li>
//                     <li className="nav-item">
//                       <NavLink
//                         className="btn btn-outline-light ms-lg-2 admin-btn"
//                         to="/admin/books"
//                         onClick={closeOffcanvas}
//                       >
//                         Books Board
//                       </NavLink>
//                     </li>
//                   </>
//                 )}

//                 <li className="nav-item">
//                   <button className="btn btn-sm ms-lg-2 btn-primary-inverse" onClick={handleLogout}>
//                     Logout
//                   </button>
//                 </li>
//               </>
//             ) : (
//               <li className="nav-item">
//                 <NavLink className="btn btn-outline-light ms-lg-2" to="/login">Login</NavLink>
//               </li>
//             )}
//           </ul>
//         </div>

//         {/* MOBILE OFFCANVAS MENU */}
//         <div className="offcanvas offcanvas-start" id="offcanvasNavbar">
//           <div className="offcanvas-header book-offcanvas-header">
//             <h5 className="offcanvas-title">BookVami Menu</h5>
//             <button className="btn-close text-reset" data-bs-dismiss="offcanvas"></button>
//           </div>

//           <div className="offcanvas-body book-offcanvas-body">
//             <ul className="navbar-nav">

//               {/* BOOKS DROPDOWN (mobile) */}
//               <li className="nav-item">
//                 <button
//                   className="nav-link btn-mobile w-100 d-flex justify-content-between align-items-center"
//                   type="button"
//                   data-bs-toggle="collapse"
//                   data-bs-target="#mobileBooksCollapse"
//                   aria-expanded="false"
//                   aria-controls="mobileBooksCollapse"
//                 >
//                   Books
//                   <span className="dropdown-caret">▾</span>
//                 </button>

//                 <ul className="collapse list-unstyled ps-3" id="mobileBooksCollapse">
//                   {categories.map(cat => (
//                     <li key={cat.category_id}>
//                       <NavLink
//                         className="dropdown-item"
//                         to={`/products/category/${cat.category_id}`}
//                         onClick={() => {
//                           // Close mobile offcanvas
//                           closeOffcanvas();

//                           // Hide submenu properly
//                           const el = document.getElementById("mobileBooksCollapse");
//                           if (el) {
//                             const instance = window.bootstrap.Collapse.getInstance(el);
//                             if (instance) instance.hide();
//                           }
//                         }}
//                       >
//                         {cat.categoryName}
//                       </NavLink>
//                     </li>
//                   ))}
//                 </ul>
//               </li>
//               {/* USER greeting */}
//               {user && (
//                 <li className="nav-item">
//                   <span className="nav-link disabled fw-bold">👋 {getUserDisplayName()}</span>
//                 </li>
//               )}

//               {/* CART (mobile) */}
//               {user?.role?.toUpperCase() !== "ADMIN" && (
//                 <li className="nav-item">
//                   <button
//                     className="nav-link btn-mobile"
//                     onClick={() => {
//                       closeOffcanvas();
//                       toggleCart();
//                     }}
//                   >
//                     Cart
//                   </button>
//                 </li>
//               )}

//               {/* ADMIN LINKS (mobile) */}
//               {user?.role?.toUpperCase() === "ADMIN" && (
//                 <>
//                   <li className="nav-item">
//                     <NavLink className="nav-link btn-mobile" to="/" onClick={closeOffcanvas}>
//                       Shop
//                     </NavLink>
//                   </li>
//                   <li className="nav-item">
//                     <NavLink className="nav-link btn-mobile" to="/admin/books" onClick={closeOffcanvas}>
//                       Books Board
//                     </NavLink>
//                   </li>
//                 </>
//               )}

//               {/* LOGIN / LOGOUT */}
//               {user ? (
//                 <li className="nav-item">
//                   <button className="nav-link btn-mobile" onClick={handleLogout}>
//                     Logout
//                   </button>
//                 </li>
//               ) : (
//                 <li className="nav-item">
//                   <NavLink className="nav-link btn-mobile" to="/login" onClick={closeOffcanvas}>
//                     Login
//                   </NavLink>
//                 </li>
//               )}

//             </ul>
//           </div>
//         </div>
//       </nav>
//     </div>
//   );
// }



export default function Menu({ toggleCart }) {
  const { user, logout, categories, loadingCategories } = useContext(GlobalContext);

  // State to handle the mobile submenu toggle independently of Bootstrap's JS
  const [isBooksOpen, setIsBooksOpen] = useState(false);
  
 
  // --- Utility to CLOSE mobile offcanvas ---
const closeOffcanvas = () => {
  const el = document.getElementById("offcanvasNavbar");
  if (!el || !window.bootstrap) return;

  const instance =
    window.bootstrap.Offcanvas.getInstance(el) ||
    new window.bootstrap.Offcanvas(el);

  instance.hide();
  setIsBooksOpen(false);
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

  // --- Reusable Category Links (Desktop) ---
  const CategoryLinks = () => {
    if (loadingCategories) return <span className="dropdown-item disabled">Loading...</span>;
    if (!categories.length) return <span className="dropdown-item disabled">No categories found</span>;

    return categories.map(cat => (
      <div className="col-lg-4 col-md-6 mb-2" key={cat.category_id}>
        <NavLink className="dropdown-item" to={`/products/category/${cat.category_id}`}>
          {cat.categoryName}
        </NavLink>
      </div>
    ));
  };

  return (
    <div className="masthead_navbar_wrapper">
      <nav className="navbar navbar-expand-lg book-navbar container-fluid">

        {/* BRAND */}
        <NavLink className="navbar-brand ms-5 d-flex align-items-center" to="/" onClick={closeOffcanvas}>
          <img
            src={logo}
            alt="Site Logo"
            className="img-fluid"
            style={{ maxHeight: "70px", marginRight: "60px" }}
          />
          <span className="d-flex align-items-center">
            <i className="bi bi-house-door-fill me-2"></i>
            BookVami
          </span>
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

            {/* BOOKS DROPDOWN (desktop) */}
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
                    <CategoryLinks />
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

            {/* USER greeting & ADMIN LINKS */}
            {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link disabled text-light fw-bold">
                    👋 {getUserDisplayName()}
                  </span>
                </li>

                {user.role?.toUpperCase() === "ADMIN" && (
                  <>
                    <li className="nav-item">
                      <NavLink className="btn btn-outline-light ms-lg-2" to="/">Shop</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className="btn btn-outline-light ms-lg-2 admin-btn"
                        to="/admin/books"
                        onClick={closeOffcanvas}
                      >
                        Books Board
                      </NavLink>
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
        <div
  className="offcanvas offcanvas-start"
  id="offcanvasNavbar"
  data-bs-scroll="true"
  data-bs-backdrop="true"
>
          
          <div className="offcanvas-header book-offcanvas-header">

            <button className="btn-close text-reset" data-bs-dismiss="offcanvas"></button>
          </div>

          <div className="offcanvas-body book-offcanvas-body">
            <ul className="navbar-nav">
              {/* USER greeting (mobile) */}
              {user && (
                <li className="nav-item">
                  <span className="nav-link disabled fw-bold">👋 {getUserDisplayName()}</span>
                </li>
              )}

              {/* ADMIN LINKS (mobile) */}
              {user?.role?.toUpperCase() === "ADMIN" && (
                <>

                  <li className="nav-item">
                    <NavLink className="nav-link btn-mobile" to="/admin/books" onClick={closeOffcanvas}>
                      Admin Board
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link btn-mobile" to="/" onClick={closeOffcanvas}>
                      Shop
                    </NavLink>
                  </li>

                </>
              )}
              {/* Home for USER */}
              {user?.role?.toUpperCase() !== "ADMIN" && (
                <li className="nav-item">
                  <NavLink className="nav-link btn-mobile home-mobile-link" to="/" onClick={closeOffcanvas}>
                    <span className="home-house-container">
                      <i className="bi bi-house-door-fill"></i> {/* The House Icon */}
                      <span className="ms-2">Shop</span>
                    </span>
                  </NavLink>
                </li>
              )}



              {/* BOOKS SUBMENU (mobile) - STATE CONTROLLED */}
              <li className="nav-item">
                <button
                  className="nav-link btn-mobile w-100 d-flex justify-content-between align-items-center"
                  type="button"
                  onClick={() => setIsBooksOpen(!isBooksOpen)}
                >
                  Books by category
                  <span className={`dropdown-caret ${isBooksOpen ? 'is-open' : ''}`}>▾</span>
                </button>

                <div className={`collapse ${isBooksOpen ? 'show' : ''}`} id="mobileBooksCollapse">
                  <ul className="list-unstyled ps-3">
                    {loadingCategories ? (
                      <li className="dropdown-item disabled">Loading...</li>
                    ) : (
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
                    )}
                  </ul>
                </div>
              </li>


              {/* CART (mobile) */}
              {user?.role?.toUpperCase() !== "ADMIN" && (
                <li className="nav-item">
                  <button
                    className="nav-link btn-mobile"
                    onClick={() => {
                      closeOffcanvas();
                      toggleCart();
                    }}
                  >
                    Cart
                  </button>
                </li>
              )}



              {/* LOGIN / LOGOUT (mobile) */}
              {user ? (
                <li className="nav-item">
                  <button className="nav-link btn-mobile" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              ) : (
                <li className="nav-item">
                  <NavLink className="nav-link btn-mobile" to="/login" onClick={closeOffcanvas}>
                    Login
                  </NavLink>
                </li>
              )}

            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}