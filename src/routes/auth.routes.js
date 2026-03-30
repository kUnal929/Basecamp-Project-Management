import express from "express";
import { register } from "../controllers/auth.controller.js";
import { userRegisterValidator } from "../validators/index.js"; 
import { validate } from "../middlewares/validator.middleware.js";

const router = express.Router();

router.route("/register").post(userRegisterValidator(), validate,register);

export default router;
