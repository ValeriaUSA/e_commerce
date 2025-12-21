// import { NavLink } from "react-router-dom";
// import { useContext, useEffect, useState } from "react";
// import { GlobalContext } from "../../contexts/GlobalContext.jsx";
// import logo from "../../images/logo.png";
// import "./menu.css";
// import CartWidget from "../CartWidget.jsx"

// export default function Menu({ toggleCart }) {
//   const { user, logout, categories, loadingCategories } = useContext(GlobalContext);


//   const [loading, setLoading] = useState(true);

//   const handleLogout = () => logout();

//   const getUserDisplayName = () => {
//     if (!user) return null;

//     if (user.role?.toUpperCase() === "ADMIN") {
//       return `ADMIN ${user.familyname ?? ""}`.trim()
//     }

//     // for users

//     const { gender, familyname, name } = user;
//     if (familyname && gender) {
//       if (gender === "female") return `Madame ${familyname}`;
//       if (gender === "male") return `Mr ${familyname}`;
//     }
//     return name || "Welcome"

//   };

//   return (
//     <div className="masthead_navbar_wrapper">
//       <nav className="navbar navbar-expand-lg book-navbar container-fluid">
//         {/* Logo */}
//         <NavLink className="navbar-brand ms-5 d-flex align-items-center" to="/">
//           <img
//             src={logo}
//             alt="Site Logo"
//             className="img-fluid"
//             style={{ maxHeight: "120px", marginRight: "8px" }}
//           />
//           <span>BookVami</span>
//         </NavLink>

//         {/* Hamburger */}
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNav"
//           aria-controls="navbarNav"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         {/* Navbar links */}
//         <div className="collapse navbar-collapse" id="navbarNav">
//           <ul className="navbar-nav ms-auto align-items-lg-center me-5">

//             {/* Books mega dropdown */}
//             <li className="nav-item dropdown position-static">
//               <NavLink
//                 className="nav-link dropdown-toggle"
//                 to="#"
//                 id="booksDropdown"
//                 role="button"
//                 data-bs-toggle="dropdown"
//                 aria-expanded="false"
//               >
//                 Books
//               </NavLink>

//               <div className="dropdown-menu dropdown-mega w-100" aria-labelledby="booksDropdown">
//                 <div className="container">
//                   <div className="row">
//                     {loadingCategories ? (
//                       <div className="col-12">
//                         <span className="dropdown-item disabled">Loading...</span>
//                       </div>
//                     ) : categories.length > 0 ? (
//                       categories.map(cat => (
//                         <div className="col-lg-4 col-md-6 mb-2" key={cat.category_id}>
//                           <NavLink
//                             className="dropdown-item"
//                             to={`/products/category/${cat.category_id}`}
//                           >
//                             {cat.categoryName}
//                           </NavLink>
//                         </div>
//                       ))
//                     ) : (
//                       <div className="col-12">
//                         <span className="dropdown-item disabled">No categories found</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </li>

//             {/* remove cart from ADMIN menu, keep it on ly for user & visitor */}

//             {user?.role?.toUpperCase() !== "ADMIN" && (
//               <li className="nav-item me-3">
//                 <CartWidget toggleCart={toggleCart} />
//               </li>
//             )}




//             {/* User links */}
//             {user ? (
//               <>
//                 <li className="nav-item">
//                   <span className="nav-link disabled text-light fw-bold">👋 {getUserDisplayName()}</span>
//                 </li>

//                 {/* admin menu specific */}
//                 {user.role?.toUpperCase() === "ADMIN" ? (
             
//                   <>
//                   <li className="nav-item">
//                     <NavLink className="btn btn-outline-light ms-lg-2" to ="/">
//                     Shop
//                     </NavLink>
//                   </li>
//                    <li className="nav-item">
//                     <NavLink className="btn-online-light btn-sm ms-lf-3" to ="/admin/books">
//                     Books Board
//                     </NavLink>
//                   </li>
//                   </>
//                 ):null}
//                 <li className="nav-item">
//                   <NavLink
//                     className="btn btn-sm ms-lg-2 btn-primary-inverse" 
//                     to="/"
//                     onClick={handleLogout}
//                   >
//                     Logout
//                   </NavLink>
//                 </li>
//               </>
//             ) : (
//               <li className="nav-item">
//                 <NavLink className="btn btn-outline-light ms-lg-2"  to="/login">
//                   Login
//                 </NavLink>
//               </li>
//             )}

//           </ul>
//         </div>
//       </nav>
//     </div>
//   );
// }


// import { NavLink } from "react-router-dom";
// import { useContext, useEffect, useState } from "react";
// import { GlobalContext } from "../../contexts/GlobalContext.jsx";
// import logo from "../../images/logo.png";
// import "./menu.css";
// import CartWidget from "../CartWidget.jsx"

// export default function Menu({ toggleCart }) {
//   const { user, logout, categories, loadingCategories } = useContext(GlobalContext);

//   const [loading, setLoading] = useState(true);

//   // We are removing the JS closeOffcanvas function and using data-bs-dismiss="offcanvas" instead.
//   // We keep the logic for logout, but it needs to trigger the offcanvas dismiss.
//   const handleLogout = () => {
//     logout();
    
//     // Manual check to hide offcanvas after logout if data-bs-dismiss fails
//     const offcanvasElement = document.getElementById('offcanvasNavbar');
//     if (offcanvasElement && window.bootstrap) {
//         const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasElement);
//         if (bsOffcanvas) {
//             bsOffcanvas.hide();
//         }
//     }
//   }

//   const getUserDisplayName = () => {
//     if (!user) return null;

//     if (user.role?.toUpperCase() === "ADMIN") {
//       return `ADMIN ${user.familyname ?? ""}`.trim()
//     }

//     const { gender, familyname, name } = user;
//     if (familyname && gender) {
//       if (gender === "female") return `Madame ${familyname}`;
//       if (gender === "male") return `Mr ${familyname}`;
//     }
//     return name || "Welcome"
//   };

//   return (
//     <div className="masthead_navbar_wrapper">
//       <nav className="navbar navbar-expand-lg book-navbar container-fluid">
//         {/* Logo */}
//         <NavLink className="navbar-brand ms-5 d-flex align-items-center" to="/">
//           <img
//             src={logo}
//             alt="Site Logo"
//             className="img-fluid"
//             style={{ maxHeight: "120px", marginRight: "8px" }}
//           />
//           <span>BookVami</span>
//         </NavLink>

//         {/* Hamburger Button */}
//         <button
//           className="navbar-toggler me-3" 
//           type="button"
//           data-bs-toggle="offcanvas"
//           data-bs-target="#offcanvasNavbar"
//           aria-controls="offcanvasNavbar"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         {/* Navbar links (DESKTOP ONLY) */}
//         <div className="collapse navbar-collapse" id="navbarNav">
//           <ul className="navbar-nav ms-auto align-items-lg-center me-5">

//             {/* Books mega dropdown */}
//             <li className="nav-item dropdown position-static">
//               <NavLink
//                 className="nav-link dropdown-toggle"
//                 to="#"
//                 id="booksDropdown"
//                 role="button"
//                 data-bs-toggle="dropdown"
//                 aria-expanded="false"
//               >
//                 Books
//               </NavLink>

//               <div className="dropdown-menu dropdown-mega w-100" aria-labelledby="booksDropdown">
//                 <div className="container">
//                   <div className="row">
//                     {loadingCategories ? (
//                       <div className="col-12">
//                         <span className="dropdown-item disabled">Loading...</span>
//                       </div>
//                     ) : categories.length > 0 ? (
//                       categories.map(cat => (
//                         <div className="col-lg-4 col-md-6 mb-2" key={cat.category_id}>
//                           <NavLink
//                             className="dropdown-item"
//                             to={`/products/category/${cat.category_id}`}
//                           >
//                             {cat.categoryName}
//                           </NavLink>
//                         </div>
//                       ))
//                     ) : (
//                       <div className="col-12">
//                         <span className="dropdown-item disabled">No categories found</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </li>

//             {/* remove cart from ADMIN menu, keep it on ly for user & visitor */}
//             {user?.role?.toUpperCase() !== "ADMIN" && (
//               <li className="nav-item me-3">
//                 <CartWidget toggleCart={toggleCart} />
//               </li>
//             )}

//             {/* User links */}
//             {user ? (
//               <>
//                 <li className="nav-item">
//                   <span className="nav-link disabled text-light fw-bold">👋 {getUserDisplayName()}</span>
//                 </li>

//                 {/* admin menu specific */}
//                 {user.role?.toUpperCase() === "ADMIN" ? (
                  
//                   <>
//                   <li className="nav-item">
//                     <NavLink className="btn btn-outline-light ms-lg-2" to ="/">
//                     Shop
//                     </NavLink>
//                   </li>
//                     <li className="nav-item">
//                     <NavLink className="btn-online-light btn-sm ms-lf-3" to ="/admin/books">
//                     Books Board
//                     </NavLink>
//                   </li>
//                   </>
//                 ):null}
//                 <li className="nav-item">
//                   <NavLink
//                     className="btn btn-sm ms-lg-2 btn-primary-inverse" 
//                     to="/"
//                     onClick={handleLogout}
//                   >
//                     Logout
//                   </NavLink>
//                 </li>
//               </>
//             ) : (
//               <li className="nav-item">
//                 <NavLink className="btn btn-outline-light ms-lg-2"  to="/login">
//                   Login
//                 </NavLink>
//               </li>
//             )}

//           </ul>
//         </div>
        
//         {/* OFF-CANVAS CONTAINER FOR MOBILE SIDEBAR */}
//         <div 
//           className="offcanvas offcanvas-start" 
//           tabIndex="-1"
//           id="offcanvasNavbar" 
//           aria-labelledby="offcanvasNavbarLabel"
//         >
//           <div className="offcanvas-header book-offcanvas-header">
//             {/* Added ms-2 and me-2 for spacing the header title and close button */}
//             <h5 className="offcanvas-title ms-2" id="offcanvasNavbarLabel">BookVami Menu</h5>
//             <button type="button" className="btn-close text-reset me-2" data-bs-dismiss="offcanvas" aria-label="Close"></button>
//           </div>
//           <div className="offcanvas-body book-offcanvas-body">
            
//             {/* Menu content for mobile sidebar */}
//             <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              
//               {/* BOOKS CATEGORIES (SIMPLIFIED FOR MOBILE - NO MEGA DROPDOWN) */}
//               <li className="nav-item dropdown">
//                 <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
//                   Books
//                 </span>
//                 <ul className="dropdown-menu">
//                   {loadingCategories ? (
//                       <li><span className="dropdown-item disabled">Loading...</span></li>
//                   ) : categories.length > 0 ? (
//                       categories.map(cat => (
//                           <li key={cat.category_id}>
//                             {/* FIX: Using data-bs-dismiss to close the offcanvas automatically */}
//                             <NavLink 
//                               className="dropdown-item" 
//                               to={`/products/category/${cat.category_id}`} 
//                               data-bs-dismiss="offcanvas" 
//                             >
//                               {cat.categoryName}
//                             </NavLink>
//                           </li>
//                       ))
//                   ) : (
//                       <li><span className="dropdown-item disabled">No categories found</span></li>
//                   )}
//                 </ul>
//               </li>
              
//               {/* USER GREETING */}
//               <li className="nav-item">
//                 <span className="nav-link disabled fw-bold">👋 {getUserDisplayName()}</span>
//               </li>
              
//               {/* CART WIDGET (MOBILE - Simple link) */}
//               {user?.role?.toUpperCase() !== "ADMIN" && (
//                   <li className="nav-item">
//                       {/* FIX: Using data-bs-dismiss */}
//                       <NavLink className="nav-link" to="/cart" data-bs-dismiss="offcanvas">Cart</NavLink>
//                   </li>
//               )}

//               {/* ADMIN LINKS (MOBILE) */}
//               {user?.role?.toUpperCase() === "ADMIN" && (
//                 <>
//                   <li className="nav-item">
//                     {/* FIX: Using data-bs-dismiss */}
//                     <NavLink className="nav-link" to="/" data-bs-dismiss="offcanvas">Shop</NavLink>
//                   </li>
//                   <li className="nav-item">
//                     {/* FIX: Using data-bs-dismiss */}
//                     <NavLink className="nav-link" to="/admin/books" data-bs-dismiss="offcanvas">Books Board</NavLink>
//                   </li>
//                 </>
//               )}

//               {/* LOGIN/LOGOUT */}
//               {user ? (
//                 <li className="nav-item">
//                   <NavLink className="nav-link" to="/" onClick={handleLogout} data-bs-dismiss="offcanvas">Logout</NavLink>
//                 </li>
//               ) : (
//                 <li className="nav-item">
//                   <NavLink className="nav-link" to="/login" data-bs-dismiss="offcanvas">Login</NavLink>
//                 </li>
//               )}
//             </ul>
//           </div>
//         </div>
//       </nav>
//     </div>
//   );
// }

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




