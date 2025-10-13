import { useState } from "react";
import axios from "../../axios.config.js";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        familyname: "",
        email: "",
        password: "",
        password_confirmation: "",
        gender: "",
        role: "user",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [errors, setErrors] = useState([]);



    const validatePassword = (password) => {
        const newErrors = [];
        if (password.length < 6) newErrors.push(" At least 6 characters");
        if (!/[A-Z]/.test(password)) newErrors.push("At least one uppercase letter");
        if (!/[0-9]/.test(password)) newErrors.push("At least one number");
        if (!/[!@#$%^&*]/.test(password)) newErrors.push("At least one special character (!@#$%^&*)");

        setErrors(newErrors);
    };

    const handleChange = (e) => {
    const { name, value } = e.target;

    // Get updated form values
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    let newErrors = [];

    // Password strength validation
    if (name === "password") {
        if (value.length < 6) newErrors.push("At least 6 characters");
        if (!/[A-Z]/.test(value)) newErrors.push("At least one uppercase letter");
        if (!/[0-9]/.test(value)) newErrors.push("At least one number");
        if (!/[!@#$%^&*]/.test(value)) newErrors.push("At least one special character (!@#$%^&*)");
    }

    // Password match validation
    if (updatedForm.password && updatedForm.password_confirmation) {
        if (updatedForm.password !== updatedForm.password_confirmation) {
            newErrors.push("Passwords are not the same");
        }
    }

    setErrors(newErrors);
};


const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setErrors([]);

    try {
        const res = await axios.post("/register", form);
        setMessage(res.data.message);

        // Redirect after 2s
        setTimeout(() => {
            navigate("/login");
        }, 2000);
    } catch (err) {
        const apiErrors = err.response?.data?.errors || ["Registration failed"];
        setErrors(apiErrors);
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
                        <h2 className="mb-4 text-center">Register</h2>

                        {/* Success Message */}
                        {message && (
                            <div className="alert alert-success" role="alert">
                                {message}
                            </div>
                        )}

                        {/* Error Messages */}
                        {errors.length > 0 && (
                            <div className="alert alert-danger" role="alert">
                                <ul className="mb-0">
                                    {errors.map((err, idx) => (
                                        <li key={idx}>{err}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">First Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    placeholder="Enter first name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Family Name</label>
                                <input
                                    type="text"
                                    name="familyname"
                                    className="form-control"
                                    placeholder="Enter family name (optional)"
                                    value={form.familyname}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    placeholder="Enter email"
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
                                    placeholder="Creat password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Confirm Password</label>
                                <input
                                    type="password"
                                    name="password_confirmation"
                                    className="form-control"
                                    placeholder="Confirm password"
                                    value={form.password_confirmation}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Gender</label>
                                <select
                                    name="gender"
                                    className="form-select"
                                    value={form.gender}
                                    onChange={handleChange}
                                >
                                    <option value="">Select gender (optional)</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-100"
                            >
                                {loading ? "Registering..." : "Register"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
}
