import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { userRegisterValidator } from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";

const router = express.Router();

router.route("/register").post(userRegisterValidator(), validate, register);

router.route("/login").post(login);

export default router;
