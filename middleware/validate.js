import { body } from "express-validator";

const nameRegex = /^[A-Za-z ]+$/;
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

export const createUserValidation = [
  body("firstName").notEmpty().withMessage("First name is required").matches(nameRegex).withMessage("First name must contain only alphabetic characters"),
  body("lastName").notEmpty().withMessage("Last name is required").matches(nameRegex).withMessage("Last name must contain only alphabetic characters"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  body("favoriteSport").notEmpty().withMessage("Favorite sport is required"),
  body("role").optional().isIn(["admin", "user", "analyst"]).withMessage("Invalid role"),
];

export const editUserValidation = [
  // A user can only edit their own profile, identified by JWT.
  body("firstName").optional().notEmpty().withMessage("First name cannot be empty").matches(nameRegex).withMessage("First name must contain only alphabetic characters"),
  body("lastName").optional().notEmpty().withMessage("Last name cannot be empty").matches(nameRegex).withMessage("Last name must contain only alphabetic characters"),
  body("favoriteSport").optional().notEmpty().withMessage("Favorite sport cannot be empty"),
  body("password").optional().isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
];

export const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").exists().withMessage("Password is required")
];
