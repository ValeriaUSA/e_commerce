// import React from "react";
// import { Link } from "react-router-dom";

// function Header() {
//   return (
//     <header>
//       <h1>Bookvami</h1>
//       <nav>
//         <Link to="/">Home</Link>
//         <Link to="/books">Books</Link>
//         <Link to="/register">Sign Up</Link>
//       </nav>
//     </header>
//   );
// }

// export default Header;


import { NavLink } from "react-router-dom"
import { useEffect } from "react"
import "./Header.css"
import initSubmenu from "./Header.js"

import logo from "../../images/logo.png" // adjust
import background from "../../images/backboard4.png"

const Header = () => {
  useEffect(() => {
    initSubmenu()
  }, [])

  return (
    <div className="masthead" style={{ backgroundImage: `url(${background})` }}>
      <nav className="navbar navbar-expand-lg navbar-dark container-fluid">
        <NavLink className="navbar-brand ms-5" to="/">
          <img src={logo} alt="Site Logo" className="img-fluid" style={{ maxHeight: "200px" }} />
        </NavLink>

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

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-3 mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link active" to="/">Home</NavLink>
            </li>

            {/* Books Dropdown */}
            <li className="nav-item dropdown">
              <NavLink
                className="nav-link dropdown-toggle"
                to="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Books
              </NavLink>
              <ul className="dropdown-menu">
                {/* Fiction */}
                <li className="dropdown-submenu dropend">
                  <NavLink className="dropdown-item dropdown-toggle" to="#">Fiction</NavLink>
                  <ul className="dropdown-menu">
                    <li><NavLink className="dropdown-item" to="#">Arts & Photography</NavLink></li>
                    <li><NavLink className="dropdown-item" to="#">Comics</NavLink></li>
                    <li><NavLink className="dropdown-item" to="#">Education & Teaching</NavLink></li>
                    <li><NavLink className="dropdown-item" to="#">History</NavLink></li>
                    <li><NavLink className="dropdown-item" to="#">Literature & Fiction</NavLink></li>
                    <li><NavLink className="dropdown-item" to="#">Mystery Thriller & Suspense</NavLink></li>
                    <li><NavLink className="dropdown-item" to="#">Romance</NavLink></li>
                    <li><NavLink className="dropdown-item" to="#">Science Fiction & Fantasy</NavLink></li>
                    <li><NavLink className="dropdown-item" to="#">Humor & Entertainment</NavLink></li>
                  </ul>
                </li>

                {/* Non-Fiction */}
                <li className="dropdown-submenu dropend">
                  <NavLink className="dropdown-item dropdown-toggle" to="#">Non-Fiction</NavLink>
                  <ul className="dropdown-menu">
                    <li><NavLink className="dropdown-item" to="#">Biographies & Memoirs</NavLink></li>
                    <li><NavLink className="dropdown-item" to="#">Business & Money</NavLink></li>
                    <li><NavLink className="dropdown-item" to="#">Computers & Technology</NavLink></li>
                    <li><NavLink className="dropdown-item" to="#">Cookbooks, Food & Wine</NavLink></li>
                    <li><NavLink className="dropdown-item" to="#">Crafts, Hobbies & Home</NavLink></li>
                    <li><NavLink className="dropdown-item" to="#">Engineering & Transportation</NavLink></li>
                    <li><NavLink className="dropdown-item" to="#">Foreign Language</NavLink></li>
                    <li><NavLink className="dropdown-item" to="#">Health, Fitness & Dieting</NavLink></li>
                    <li><NavLink className="dropdown-item" to="#">Law</NavLink></li>
                    <li><NavLink className="dropdown-item" to="#">Medical</NavLink></li>
                    <li><NavLink className="dropdown-item" to="#">Nonfiction</NavLink></li>
                    <li><NavLink className="dropdown-item" to="#">Parenting & Relationships</NavLink></li>
                    <li><NavLink className="dropdown-item" to="#">Politics & Social Sciences</NavLink></li>
                    <li><NavLink className="dropdown-item" to="#">Reference</NavLink></li>
                    <li><NavLink className="dropdown-item" to="#">Religion & Spirituality</NavLink></li>
                    <li><NavLink className="dropdown-item" to="#">Science & Math</NavLink></li>
                  </ul>
                </li>

                {/* Children */}
                <li className="dropdown-submenu dropend">
                  <NavLink className="dropdown-item dropdown-toggle" to="#">Children</NavLink>
                  <ul className="dropdown-menu">
                    <li><NavLink className="dropdown-item" to="#">Children's eBooks</NavLink></li>
                    <li><NavLink className="dropdown-item" to="#">Teen & Young Adult</NavLink></li>
                  </ul>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/about">About</NavLink>
            </li>
          </ul>

          {/* Search + Login/Cart */}
          <form className="d-flex me-3">
            <input className="form-control me-2" type="search" placeholder="Search books" aria-label="Search" />
            <button className="btn btn-outline-light" type="submit">Search</button>
          </form>
          <div>
            <NavLink to="/login" className="btn btn-outline-light me-2">
              <i className="bi bi-person"></i> Login
            </NavLink>
            <NavLink to="/cart" className="btn btn-outline-light">
              <i className="bi bi-cart"></i> Cart
            </NavLink>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Header

