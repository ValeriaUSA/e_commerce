import axios from "../../axios.config.js";
import { useState, useContext } from "react"; //hooks managin state and acccessing context
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../contexts/GlobalContext.jsx";
import { Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate(); //hook allowing programmatic navigation btw roots
  const { login } = useContext(GlobalContext);

  const [form, setForm] = useState({ email: "", password: "" }); //stores form input values
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false); //to indicate when login request is in progress


  //Handle typing in input fields
  const handleChange = (e) => {

    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //Handle form submission:
  const handleSubmit = async (e) => {
    e.preventDefault(); //prevents page reload
    setLoading(true);
    setErrors([]);
    setMessage(null);

    try {
      const apiRes = await axios.post("/login", form);
      const user = apiRes.data.user; // server should return full user object

      console.log("🟢 [Login] API response:", apiRes.data);
      console.log("🟢 [Login] user to context:", user);
      console.log("🛒 [Login CartId] user to context:", user.cartId);
      console.log("🛒 [Login CartContent] user to context:", user.cartProducts);



      login(user); //  update context and localStorage
      setMessage(apiRes.data.message || "Login successful");

      if (user.role === "ADMIN") navigate("/admin");
      else navigate("/");

    } catch (err) {
      console.error(" [Login] Error:", err);
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      else if (err.response?.data?.message) setErrors([err.response.data.message]);
      else setErrors(["Server error"]);
    } finally {
      setLoading(false);
    }
  };


  //LOGIN FORM
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="mb-4 text-center">Login</h2>

              {message && <div className="alert alert-success">{message}</div>}

              {/* List of Errors messages in alert box */}
              {errors.length > 0 && (
                <div className="alert alert-danger">
                  <ul className="mb-0">
                    {errors.map((err, idx) =>
                      <li key={idx}>{err}</li>)}</ul>
                </div>
              )}

              {/* Login Form starts : */}
              <form onSubmit={handleSubmit}>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email" //must match the key in form State
                    className="form-control" //Bootstrap (full width) input
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              {/* Registration link */}

              <div className="text-center mt-3">
                <p className="mb-0">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-primary fw-bold">
                    Register here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
