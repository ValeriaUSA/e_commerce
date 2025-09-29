import * as yup from 'yup';
import bcrypt from 'bcrypt';
import userRepository from '../repositories/user.repository.js';

// Validation schema
const userSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, "First name must be at least 3 characters")
    .max(20, "First name must be at most 20 characters")
    .required("First name is required"),
  familyname: yup
    .string()
    .nullable()
    .matches(/^[A-Z]{1}.{2,19}$/, "Last name must start with a capital letter (3–20 chars)")
    .notRequired(),
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "At least 6 characters")
    .matches(/[A-Z]/, "Must contain uppercase")
    .matches(/[0-9]/, "Must contain number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Must contain special character"),
  gender: yup.string().nullable().notRequired(),
  role: yup.string().nullable().notRequired()
});

// Register function
export const register = async (req, res) => {
  try {
    // Validate input
    await userSchema.validate(req.body, { abortEarly: false });

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Prepare user object for saving
    const userToSave = {
      name: req.body.name,
      familyname: req.body.familyname || null,
      email: req.body.email,
      password: hashedPassword,
      gender: req.body.gender || null,
      role: req.body.role || "user" // default role
    };

    // Save user in database
    const savedUser = await userRepository.save(userToSave);
    if (!savedUser) return res.status(500).json({ message: "Problem inserting user" });

    // Respond with saved user data
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        customerId: savedUser.customerId,
        name: savedUser.name,
        familyname: savedUser.familyname,
        email: savedUser.email,
        role: savedUser.role,
        gender: savedUser.gender
      }
    });

  } catch (err) {
    // Return validation or other errors
    return res.status(400).json({
      message: "Validation failed",
      errors: err.errors || [err.message]
    });
  }
};

export default {
  register

};