
import { useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../contexts/GlobalContext";
import { toast } from "react-toastify";

export default function ProtectedAdmin({ children }) {
  const { user, loadingUser } = useContext(GlobalContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Only show toast if the user exists but is not an admin
    if (!loadingUser && user && user.role?.toUpperCase() !== "ADMIN") {
      toast.error("You are not authorized to access this page!");
      // Wait a short time before redirecting so toast can appear
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 500);
    }
  }, [user, loadingUser, navigate]);

  if (loadingUser) return <div>Loading...</div>;

  // Not logged in → redirect to login without showing toast
  if (!user) return <Navigate to="/login" replace />;

  // Logged in but not admin → return null, toast handled in useEffect
  if (user.role?.toUpperCase() !== "ADMIN") return null;

  // Admin → render children (protected content)
  return children;
}