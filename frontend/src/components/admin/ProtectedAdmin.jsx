// import { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { GlobalContext } from "../../contexts/GlobalContext";

// export default function ProtectedAdmin({ children }) {
//   const { user, loadingUser } = useContext(GlobalContext);

//   if (loadingUser) {
//     // show nothing or a loader while context initializes
//     return <div>Loading...</div>;
//   }

//   // not logged in at all
//   if (!user) return <Navigate to="/login" />;

//   // logged in but not admin

//   if (user.role?.toUpperCase() !== "ADMIN") return <Navigate to="/" />

//   // access granted
//   return children;
// }

// import { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { GlobalContext } from "../contexts/GlobalContext";

// import { toast } from 'react-toastify';

import { useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../contexts/GlobalContext";
import { toast } from "react-toastify";

export default function ProtectedAdmin({ children }) {
  const { user, loadingUser } = useContext(GlobalContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("ProtectedAdmin useEffect triggered", { user, loadingUser });

    if (!loadingUser) {
      if (!user) {
        console.log("User not logged in, redirecting to /login");
        toast.warning("Vous devez vous connecter pour accéder à cette page !");
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 300); // délai pour que le toast apparaisse
      } else if (user.role?.toUpperCase() !== "ADMIN") {
        console.log("User is not admin, redirecting to /");
        toast.error("Vous n'êtes pas autorisé à accéder à cette page !");
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 500); // délai pour que le toast apparaisse
      }
    }
  }, [user, loadingUser, navigate]);

  if (loadingUser) {
    console.log("Loading user data...");
    return <div>Chargement...</div>;
  }

  if (!user || user.role?.toUpperCase() !== "ADMIN") {
    // pendant le délai du toast
    return null;
  }

  // accès autorisé
  return children;
}