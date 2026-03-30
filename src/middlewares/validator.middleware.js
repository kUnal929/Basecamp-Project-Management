import { validationResult } from "express-validator";
import { apiError } from "../utils/api-error";
import { errorMonitor } from "nodemailer/lib/xoauth2";

export const validate = (req, res, next) => {
   const error = validationResult(req);
   if (!error.isEmpty()) {
      return next();
   }

   const extractedErrors = [];
   error.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

   throw new apiError(422, "received data is not valid", extractedErrors);
};
