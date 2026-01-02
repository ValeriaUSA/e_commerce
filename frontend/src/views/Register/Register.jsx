import { useState } from "react";
import axios from "../../../axios.config.js";
import { useNavigate } from "react-router-dom";
// import { validateRegisterForm, validateEmail } from "../Register/Register_validation.js";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema } from "../Register/Register.schema.js";
import "../Register/Register.css";

//VERSION W RFH
export default function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [apiErrors, setApiErrors] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm({
    resolver: yupResolver(userSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      familyname: "",
      email: "",
      password: "",
      password_confirmation: "",
      gender: "",
      role: "user"
    }
  });

  /* =======================
     PASSWORD LIVE RULES
  ======================= */
  const password = watch("password") || "";

  const passwordRules = [
    { test: (v) => v.length >= 6, message: "Password must be at least 6 characters" },
    { test: (v) => /[A-Z]/.test(v), message: "Password must contain an uppercase letter" },
    { test: (v) => /[0-9]/.test(v), message: "Password must contain a number" },
    { test: (v) => /[!@#$%^&*(),.?\":{}|<>]/.test(v), message: "Password must contain a special character" }
  ];

  const passwordErrors = password
    ? passwordRules.filter(r => !r.test(password)).map(r => r.message)
    : [];

  /* =======================
     FRONTEND ERRORS LIST
  ======================= */
  const frontendErrors = [];
  Object.values(errors).forEach(err => {
    if (err?.message) frontendErrors.push(err.message);
  });
  passwordErrors.forEach(err => {
    if (!frontendErrors.includes(err)) frontendErrors.push(err);
  });

  /* =======================
     SUBMIT
  ======================= */
  const onSubmit = async (data) => {
    if (frontendErrors.length > 0) return;

    setLoading(true);
    setApiErrors([]);
    setMessage(null);

    try {
      const res = await axios.post("/register", data);
      setMessage(res.data.message);

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setApiErrors(err.response?.data?.errors || ["Registration failed"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="register-card card shadow">
            <div className="card-body p-3">
              <h3 className="text-center mb-3">Create your account</h3>

              {/* SUCCESS */}
              {message && (
                <div className="alert alert-success">{message}</div>
              )}

              {/* FRONTEND ERRORS */}
              {frontendErrors.length > 0 && (
                <div className="alert alert-warning">
                  <ul className="mb-0">
                    {frontendErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* BACKEND ERRORS */}
              {apiErrors.length > 0 && (
                <div className="alert alert-danger">
                  <ul className="mb-0">
                    {apiErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* EMAIL */}
                <div className="mb-2">
                  <label className="form-label">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    autoFocus
                    {...register("email")}
                  />
                </div>

                {/* FIRST NAME */}
                <div className="mb-2">
                  <label className="form-label">
                    First name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    {...register("name")}
                  />
                </div>

                {/* FAMILY NAME */}
                <div className="mb-2">
                  <label className="form-label">Family name</label>
                  <input
                    type="text"
                    className="form-control"
                    {...register("familyname")}
                  />
                </div>

                {/* PASSWORD */}
                <div className="mb-2">
                  <label className="form-label">
                    Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    {...register("password")}
                  />
                </div>

                {/* PASSWORD CONFIRMATION */}
                <div className="mb-2">
                  <label className="form-label">
                    Confirm password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    {...register("password_confirmation")}
                  />
                </div>

                {/* GENDER */}
                <div className="mb-2">
                  <label className="form-label">Gender</label>
                  <select className="form-select" {...register("gender")}>
                    <option value="">Select gender (optional)</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <p className="text-muted small mb-2">
                  Fields with <span className="text-danger">*</span> are required
                </p>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading || frontendErrors.length > 0 || apiErrors.length > 0}
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


// VERSION W UseState
// export default function Register() {
//     const navigate = useNavigate();

//     const [form, setForm] = useState({
//         name: "",
//         familyname: "",
//         email: "",
//         password: "",
//         password_confirmation: "",
//         gender: "",
//         role: "user",
//     });

//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState(null);
//     const [frontendErrors, setFrontendErrors] = useState([]);
//     const [apiErrors, setApiErrors] = useState([]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;

//         const updatedForm = { ...form, [name]: value };
//         setForm(updatedForm);

//         let errors = [];
//         // Only validate the password when the password field is being updated
//         if (name === "password" || name === "password_confirmation") {
//             errors = validateRegisterForm(updatedForm);
//         }
//         // Email validation on change
//         if (name === "email") {
//             const emailError = validateEmail(value);
//             if (emailError) errors.push(emailError);
//         }
//         setFrontendErrors(errors);

//         if (apiErrors.length > 0) setApiErrors([]);
//     };


//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         //  Prevent API call if fe validation fails
//         if (frontendErrors.length > 0) return;

//         setLoading(true);
//         setApiErrors([]);
//         setMessage(null);

//         try {
//             const res = await axios.post("/register", form);
//             setMessage(res.data.message);

//             setTimeout(() => {
//                 navigate("/login");
//             }, 20000);
//         } catch (err) {
//             const errors =
//                 err.response?.data?.errors || ["Registration failed"];
//             setApiErrors(errors);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="register-page container">
//             <div className="row justify-content-center">
//                 <div className="col-md-6 col-lg-5">
//                     <div className="register-card card shadow">
//                         <div className="card-body p-3">
//                             <h3 className="text-center mb-3">Create your account</h3>


//                             {/* Success message */}
//                             {message && (
//                                 <div className="alert alert-success">{message}</div>
//                             )}

//                             {/* Frontend validation errors */}
//                             {frontendErrors.length > 0 && (
//                                 <div className="alert alert-warning">
//                                     <ul className="mb-0">
//                                         {frontendErrors.map((err, i) => (
//                                             <li key={i}>{err}</li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             )}

//                             {/* API errors */}
//                             {apiErrors.length > 0 && (
//                                 <div className="alert alert-danger">
//                                     <ul className="mb-0">
//                                         {apiErrors.map((err, i) => (
//                                             <li key={i}>{err}</li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             )}

//                             <form onSubmit={handleSubmit}>
//                                 <div className="mb-2">
//                                     <label className="form-label">Email <span className="text-danger">*</span></label>
//                                     <input
//                                         type="email"
//                                         name="email"
//                                         className="form-control"
//                                         value={form.email}
//                                         onChange={handleChange}
//                                         required
//                                         autoFocus
//                                     />
//                                 </div>
//                                 <div className="mb-2">
//                                     <label className="form-label">First name <span className="text-danger">*</span></label>
//                                     <input
//                                         type="text"
//                                         name="name"
//                                         className="form-control"
//                                         value={form.name}
//                                         onChange={handleChange}
//                                         required
//                                     />
//                                 </div>

//                                 <div className="mb-2">
//                                     <label className="form-label">Family name <span className="text-danger">*</span></label>
//                                     <input
//                                         type="text"
//                                         name="familyname"
//                                         className="form-control"
//                                         value={form.familyname}
//                                         onChange={handleChange}
//                                     />
//                                 </div>


//                                 <div className="mb-2">
//                                     <label className="form-label">Password <span className="text-danger">*</span> </label>
//                                     <input
//                                         type="password"
//                                         name="password"
//                                         className="form-control"
//                                         value={form.password}
//                                         onChange={handleChange}
//                                         required
//                                     />
//                                 </div>

//                                 <div className="mb-2">
//                                     <label className="form-label">Confirm password <span className="text-danger">*</span></label>
//                                     <input
//                                         type="password"
//                                         name="password_confirmation"
//                                         className="form-control"
//                                         value={form.password_confirmation}
//                                         onChange={handleChange}
//                                         required
//                                     />
//                                 </div>

//                                 <div className="mb-2">
//                                     <label className="form-label">Gender</label>
//                                     <select
//                                         name="gender"
//                                         className="form-select"
//                                         value={form.gender}
//                                         onChange={handleChange}
//                                     >
//                                         <option value="">Select gender (optional)</option>
//                                         <option value="male">Male</option>
//                                         <option value="female">Female</option>
//                                     </select>
//                                 </div>
//                                 <p className="text-muted small text-left mb-2">
//                                     Fields  with <span className="text-danger">*</span> are required
//                                 </p>

//                                 <button
//                                     type="submit"
//                                     disabled={
//                                         loading ||
//                                         frontendErrors.length > 0 ||
//                                         apiErrors.length > 0 ||
//                                         !form.name ||
//                                         !form.email ||
//                                         !form.password ||
//                                         !form.password_confirmation
//                                     }
//                                     className="btn btn-primary w-100"
//                                 >
//                                     {loading ? "Registering..." : "Register"}
//                                 </button>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

