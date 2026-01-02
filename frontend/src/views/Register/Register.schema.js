import * as yup from "yup";

export const userSchema = yup.object({
  name: yup
    .string()
    .min(3)
    .max(20)
    .required("First name is required"),

  familyname: yup.string().nullable(),

  email: yup
  .string()
  .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Invalid email")
  .required("Email is required"),

  password: yup.string().required("Password is required"),

  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Password confirmation is required"),

  gender: yup.string().nullable(),
});


