import axios from "../../axios.config.js";
import { useState, useContext } from "react";
import { GlobalContext } from "../contexts/GlobalContext.jsx";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(GlobalContext);

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const location = useLocation(); // 🔹 get current location
  const from = location.state?.from || "/"; // 🔹 fallback to home if nothing provided


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    setMessage(null);

    try {
      const apiRes = await axios.post("/login", form);

      // NORMALIZE THE ROLE HERE ALWAYS!
      const user = {
        ...apiRes.data.user,
        role: apiRes.data.user.role.toUpperCase(),
        token: apiRes.data.token,
      };

      login(user);
      setMessage(apiRes.data.message || "Login successful");

      if (user.role === "ADMIN") {
        navigate("/admin/books"); // admin always goes to admin dashboard
      } else {
        navigate(from, { replace: true }); // 🔹 redirect visitor to original page
      }

    } catch (err) {
      console.error(" [Login] Error:", err);
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      else if (err.response?.data?.message) setErrors([err.response.data.message]);
      else setErrors(["Server error"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="mb-4 text-center">Login</h2>

              {message && <div className="alert alert-success">{message}</div>}
              {errors.length > 0 && (
                <div className="alert alert-danger">
                  <ul className="mb-0">
                    {errors.map((err, idx) => <li key={idx}>{err}</li>)}
                  </ul>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" name="email" className="form-control"
                    placeholder="Enter your email"
                    value={form.email} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input type="password" name="password" className="form-control"
                    placeholder="Enter your password"
                    value={form.password} onChange={handleChange} required />
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <div className="text-center mt-3">
                <p className="mb-0">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-primary fw-bold">Register here</Link>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}