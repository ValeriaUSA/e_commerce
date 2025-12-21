import * as yup from 'yup';
import bcrypt from 'bcrypt';
import userRepository from '../repositories/user.repository.js';
import cartRepository from '../repositories/cart.repository.js';

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
    .matches(/^[A-Z]{1}.{2,19}$/, "Last name must start with a capital letter (3-20 chars)")
    .notRequired(),
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must contain least 6 characters ")
    .matches(/[A-Z]/, "Password must contain uppercase")
    .matches(/[0-9]/, "Password must contain number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain special character"),
  gender: yup.string().nullable().notRequired()
  
});

// Register function
export const register = async (req, res) => {
  try {
  // Check if password confirmation corresponds
    if (req.body.password !== req.body.password_confirmation) {
      return res.status(400).json({ 
        message: "Passwords do not match" });
    }
    // Validate input
    await userSchema.validate(req.body, { abortEarly: false });
  // Check if email already exists
  const existingUser = await userRepository.findByEmail(req.body.email);
  if (existingUser) {
    return res.status(400).json({
      message: "Registration failled",
      errors: ["Email is already registed"]
    });
  }
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

    //Creat Active cart for the new created user
    const customerId = savedUser.customerId;
    const newCartId = await cartRepository.createCart(customerId)
    if (!newCartId) {
      console.error(`User ${customerId} registed, but default cart was not created`);

    }


    // Respond with saved user data
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        customerId: savedUser.customerId,
        name: savedUser.name,
        familyname: savedUser.familyname,
        email: savedUser.email,
        role: savedUser.role,
        gender: savedUser.gender,
        activeCartId: newCartId
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

//LOGIN and USER data collect
export const login = async (req, res) => {
  try {
    const user = await userRepository.findByEmail(req.body.email)
    //Case: User's email is not found in db
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        errors: ["The provided email does not exist"],
      });
    }

    //Case: email is found-> check password match

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
        errors: ["Password is incorrect"]
      })
    }
    
    // 🛑 FIX: Determine the correct customer ID property. 
    // It is often named 'customerId' or 'id' depending on the repository result structure.
    const customerId = user.id || user.customerId; 

    if (!customerId) {
        // Handle critical failure if the user object is malformed
        console.error("User object missing required ID property:", user);
        return res.status(500).json({ message: "Server error: User ID could not be determined for cart lookup." });
    }
    
    // 🛑 DEBUGGING: Log the ID being used
    console.log(`[LOGIN] Determined Customer ID: ${customerId}`); 

    let activeCartContent;

    try {
        //Here fetch CART data
        activeCartContent = await cartRepository.findOrCreatCart(customerId);
        
        // 🛑 DEBUGGING: Log the raw result from the repository
        console.log("[LOGIN] Repository Cart Content:", activeCartContent);
        
    } catch (cartErr) {
        // Log the specific cart error to the server console
        console.error("[LOGIN] CRITICAL CART REPOSITORY ERROR:", cartErr);
        // Throw it up to the main catch block to return 500
        throw cartErr; 
    }


    return res.status(200).json({
      message: "Login successful",
      user: {
        id: customerId, // Use the determined ID for the response
        name: user.name,
        email: user.email,
        role: user.role,
        familyname: user.familyname,
        gender: user.gender,
        cartId: activeCartContent.cartId,
        cartProducts: activeCartContent.books,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}


// export const login = async (req, res) => {

//   try {
//     const user = await userRepository.findByEmail(req.body.email)
//     //Case: User's email is not found in db
//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//         errors: ["The provided email does not exist"],
//       });
//     }

//     //Case: email is found-> check password match

//     const isMatch = await bcrypt.compare(req.body.password, user.password);

//     if (!isMatch) {
//       return res.status(401).json({
//         message: "Invalid credentials",
//         errors: ["Password is incorrect"]
//       })
//     }

//     //Here fetch CART data
//     const activeCartContent = await cartRepository.findOrCreatCart(user.id)

//     return res.status(200).json({
//       message: "Login successful",
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         familyname: user.familyname,
//         gender: user.gender,
//         cartId: activeCartContent.cartId,
//         cartProducts: activeCartContent.books,
//       }
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// }



export default {
  register,
  login

};