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

const login = asyncHandler(async (req, res) => {
   const { email, password, username } = req.body;
   if (!email && !username) {
      throw new apiError(400, "Please provide email or username");
   }
   await user.findOne({ email });
   if (!user) {
      throw new apiError(400, "User does not exist");
   }
   const isPasswordCorrect = await user.comparePassword(password);

   if (!isPasswordCorrect) {
      throw new apiError(400, "Invalid credentials");
   }

   const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
   );

   const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry "
   );

   const options = {
      httpOnly: true,
      secure: true,
   };

   return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
         new ApiResponse(
            200,
            {
               user: loggedInUser,
               accessToken,
               refreshToken,
            },
            "User logged in successfully"
         )
      );
});

export { register,login };
