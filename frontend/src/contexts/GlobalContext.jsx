// // This context lets any component access:

// // *  Current logged-in user
// // *  Product categories
// // *  Login/logout functions


import { createContext, useEffect, useState } from "react";
import axios from "../../axios.config";

export const GlobalContext = createContext();

export default function GlobalProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true); // true while checking localStorage
  
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("[GlobalContext] Failed to parse stored user:", err);
        localStorage.removeItem("user");
      }
    }
    setLoadingUser(false); // done checking localStorage
  }, []);

  // LOGIN function
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // LOGOUT function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Fetch categories once
  useEffect(() => {
    axios
      .get("/products/category")
      .then((res) => {
        setCategories(res.data);
        setLoadingCategories(false);
      })
      .catch((err) => {
        console.error("[GlobalContext] Error fetching categories:", err);
        setLoadingCategories(false);
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        user,
        login,
        logout,
        loadingUser,
        categories,
        loadingCategories,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}