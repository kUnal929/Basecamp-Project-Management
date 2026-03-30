import { body } from "express-validator";

const userRegisterValidator = () => {
   return [
      body("email")
         .trim()
         .isEmail()
         .withMessage("email is required ")
         .isEmail()
         .withMessage("email is not valid"),

      body("username")
         .trim()
         .notEmpty()
         .withMessage("username is required ")
         .isLowercase()
         .withMessage("username must be in lowercase")
         .isLength({ min: 3 })
         .withMessage("username must be at least 3 characters long"),

      body("password").trim().notEmpty().withMessage("password is required "),
      body("fullName").optional().trim(),
   ];
};

const userLoginValidator = () => {
   return [
      body("email").optional().isEmail().withMessage("email is required "),

      body("password").notEmpty().withMessage("password is required "),
   ];
};

export { userRegisterValidator, userLoginValidator };
