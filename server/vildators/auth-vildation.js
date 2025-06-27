
const { z } = require("zod");

// Zod schema for Register
const singupSchema = z.object({
  firstName: z
  .string({require_error:"First Name is required"})
  .trim()
  .min(3, "First name is must be at lest of 3 characters")
  .max(15, "First name is must be at lest of 15 characters")
  .refine(
      (val) => /^[A-Z]/.test(val),
      { message: "First Name must start with an uppercase letter" }
    ),

  lastName: z
  .string({require_error:"Last Name is required"})
  .trim()
  .min(3, "Last name is must be at lest of 3 characters")
  .max(15, "Last name is must be at lest of 5 characters")
  .refine(
      (val) => /^[A-Z]/.test(val),
      { message: "First Name must start with an uppercase letter" }
    ),

  email: z
  .string({require_error:"Email is required"})
  .trim()
  .toLowerCase()
  .refine(
    (val) =>
      /^[a-zA-Z0-9](\.?[a-zA-Z0-9]){5,29}@(?:gmail\.com|googlemail\.com)$/.test(val),
    {
      message:
        "Email must be a valid Gmail address (e.g. yourname@gmail.com), 6–30 characters, no special characters or consecutive dots",
    }
  ),


    password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must be at most 20 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&#]/, { message: "Password must contain at least one special character (@$!%*?&#)" }),

  confirmPassword: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must be at most 20 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&#]/, { message: "Password must contain at least one special character (@$!%*?&#)" }),


  role: z
  .enum(["admin", "manager", "user"], "Invalid role"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});


// Zod schema for Login
const loginSchema = z.object({
  email: z
  .string({require_error:"Email is required"})
  .trim()
  .toLowerCase()
  .refine(
    (val) =>
      /^[a-zA-Z0-9](\.?[a-zA-Z0-9]){5,29}@(?:gmail\.com|googlemail\.com)$/.test(val),
    {
      message:
        "Email must be a valid Gmail address (e.g. yourname@gmail.com), 6–30 characters, no special characters or consecutive dots",
    }
  ),


    password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must be at most 20 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&#]/, { message: "Password must contain at least one special character (@$!%*?&#)" }),

});

module.exports = { singupSchema, loginSchema };
