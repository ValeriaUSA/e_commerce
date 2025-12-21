import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { GlobalContext } from "../contexts/GlobalContext";

export default function ProtectedAdmin({ children }) {
  const { user, loadingUser } = useContext(GlobalContext);

  if (loadingUser) {
    // show nothing or a loader while context initializes
    return <div>Loading...</div>;
  }

  // not logged in at all
  if (!user) return <Navigate to="/login" />;

  // logged in but not admin

  if (user.role?.toUpperCase() !== "ADMIN") return <Navigate to="/" />

  // access granted
  return children;
}

