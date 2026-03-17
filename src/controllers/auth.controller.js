import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { apiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.js";

const generateAccessAndRefreshTokens = async (userID) => {
   try {
      const user = await User.findById(userID);
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
      return { accessToken, refreshToken };
   } catch (error) {
      throw new apiError("Error generating tokens", 500);
   }
};

const register = asyncHandler(async (req, res) => {
   const { email, username, password, role } = req.body;
   const existingUser = await User.findOne({
      $or: [{ email }, { username }],
   });
   if (existingUser) {
      throw new apiError("User with email or username  already exists", 409);
   }
   const user = await User.create({
      email,
      username,
      password,
      role,
      isEmailVerified: false,
   });

   const { unHashedToken, hashedToken, tokenExpiry } =
      user.generateTemporaryToken();
   user.emailVerificationToken = hashedToken;
   user.emailVerificationTokenExpiry = tokenExpiry;

   await user.save({ validateBeforeSave: false });

   await sendEmail({
      to: user.email,
      subject: "Email Verification",
      mailgenContent: emailVerificationMailgenContent(
         user.username,
         `${req.protocol}://${req.get("host")}/api/v1/users/verify-email${unHashedToken}`
      ),
   });

   const createdUser = await User.findById(user._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry "
   );

   if (!createdUser) {
      throw new apiError("Something went wrong while registering user", 404);
   }

   res.status(201).json(
      new ApiResponse(
         true,
         "User registered successfully and verification email has been sent to your email",
         {
            user: createdUser,
         }
      )
   );
});

export { register };
