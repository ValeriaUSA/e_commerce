import { useState } from "react";

export default function RegisterForm() {
  const [form, setForm] = useState({
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password") {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    const newErrors = [];
    if (password.length < 8) newErrors.push("At least 8 characters");
    if (!/[A-Z]/.test(password)) newErrors.push("At least one uppercase letter");
    if (!/[0-9]/.test(password)) newErrors.push("At least one number");
    if (!/[!@#$%^&*]/.test(password)) newErrors.push("At least one special character (!@#$%^&*)");

    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (errors.length > 0) {
      alert("Fix password issues before submitting!");
      return;
    }
    if (form.password !== form.password_confirmation) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Submitting form:", form);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <div className="mb-3">
        <label className="form-label">Password</label>
        <input
          type="password"
          name="password"
          className="form-control"
          placeholder="Create password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <ul className="text-sm mt-2">
          {errors.map((err, i) => (
            <li key={i} className="text-red-500">⚠ {err}</li>
          ))}
        </ul>
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

      <button type="submit" className="btn btn-primary" disabled={errors.length > 0}>
        Register
      </button>
    </form>
  );
}
