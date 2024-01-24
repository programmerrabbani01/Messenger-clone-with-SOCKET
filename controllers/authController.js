import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {
  createOTP,
  dotsToHyphens,
  hyphensToDots,
  isEmail,
  isMobile,
  isUserName,
} from "../helpers/helpers.js";
import { sendSMS } from "../utils/sendSMS.js";
import { AccountActivationEmail } from "../mails/AccountActivationMail.js";
import { cloudUpload } from "../utils/cloudinary.js";

/**
 * @DESC User Login
 * @ROUTE /api/v1/auth/login
 * @method POST
 * @access public
 */
export const login = asyncHandler(async (req, res) => {
  const { auth, password } = req.body;

  // validation
  if (!auth || !password)
    return res.status(404).json({ message: "All fields are required" });

  // find login user

  let loginUserData = null;

  if (isMobile(auth)) {
    loginUserData = await User.findOne({ phone: auth });

    // user not found
    if (!loginUserData)
      return res.status(404).json({ message: "User not found" });
  } else if (isEmail(auth)) {
    loginUserData = await User.findOne({ email: auth });

    // user not found
    if (!loginUserData)
      return res.status(404).json({ message: "User not found" });
  } else {
    return res.status(404).json({
      message: "Login User Must Have A Mobile Number Or Email Address",
    });
  }

  // password check
  const passwordCheck = await bcrypt.compare(password, loginUserData.password);

  // password check
  if (!passwordCheck)
    return res.status(404).json({ message: "Wrong password" });

  // create access token
  const token = jwt.sign({ auth: auth }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN,
  });

  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.APP_ENV == "Development" ? false : true,
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    token,
    user: loginUserData,
    message: "User Login Successful",
  });
});

/**
 * @DESC User Login
 * @ROUTE /api/v1/auth/login
 * @method POST
 * @access public
 */
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken");
  res.status(200).json({ message: "Logout successful" });
});

/**
 * @DESC Create new User
 * @ROUTE /api/v1/auth/user
 * @method POST
 * @access public
 */

export const register = asyncHandler(async (req, res) => {
  const { name, userName, auth, password } = req.body;

  if (!name || !userName || !auth || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate user name
  if (!isUserName(userName)) {
    return res.status(400).json({ message: "Invalid userName format" });
  }

  // User name check
  const userNameCheck = await User.findOne({ userName });

  if (userNameCheck) {
    return res.status(400).json({ message: "User Name already exists" });
  }

  // auth value manage

  let authEmail = null;
  let authPhone = null;

  //  create a access token for account activation

  const activationCode = createOTP();

  if (isEmail(auth)) {
    authEmail = auth;

    // user email check
    const userEmailCheck = await User.findOne({ email: authEmail });

    if (userEmailCheck) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // create verification token

    const verifyToken = jwt.sign(
      { auth: auth },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    res.cookie("verifyToken", verifyToken);

    // activation link

    const activationLink = `http://localhost:3000/verify/${dotsToHyphens(
      verifyToken
    )}`;
    // send Email

    await AccountActivationEmail(auth, {
      name,
      code: activationCode,
      link: activationLink,
    });
  } else if (isMobile(auth)) {
    authPhone = auth;

    // user phone number check
    const userPhoneCheck = await User.findOne({ phone: authPhone });

    if (userPhoneCheck) {
      return res.status(400).json({ message: "Phone already exists" });
    }

    // create verification token

    const verifyToken = jwt.sign(
      { auth: auth },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    res.cookie("verifyToken", verifyToken);

    // send otp

    await sendSMS(
      auth,
      `Hello , ${name}, Your Account Activation Code is ${activationCode}`
    );
  } else {
    return res
      .status(400)
      .json({ message: "You Must Use Email Or Phone Number For Registration" });
  }

  // password hash
  const hashPass = await bcrypt.hash(password, 10);

  // create new user
  const user = await User.create({
    name,
    userName,
    email: authEmail,
    phone: authPhone,
    password: hashPass,
    accessToken: activationCode,
  });

  res.status(200).json({
    user,
    message: "User Created successful",
  });
});

/**
 * @DESC Create new User
 * @ROUTE /api/v1/auth/user
 * @method POST
 * @access public
 */
export const loggedInUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.me);
});

/**
 * @DESC Create new User
 * @ROUTE /api/v1/auth/user
 * @method POST
 * @access public
 */
export const makeHashPass = asyncHandler(async (req, res) => {
  const { password } = req.body;
  // password hash
  const hashPass = await bcrypt.hash(password, 10);
  res.status(200).json({ hashPass });
});

/**
 * @DESC account Verification By OTP
 * @ROUTE /api/v1/auth/verifyByOTP/:token
 * @method POST
 * @access public
 */
export const accountVerificationByOTP = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { otp } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Invalid token" });
  }
  if (!otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  const verifyToken = hyphensToDots(token);

  // verify the token

  const tokenCheck = jwt.verify(verifyToken, process.env.ACCESS_TOKEN_SECRET);

  if (!tokenCheck) {
    return res.status(400).json({ message: " Invalid Active Request " });
  }

  // activate account now

  let activateUser = null;

  if (isMobile(tokenCheck.auth)) {
    activateUser = await User.findOne({ phone: tokenCheck.auth });
    if (!activateUser) {
      return res.status(400).json({ message: "User not found" });
    }
  } else if (isEmail(tokenCheck.auth)) {
    activateUser = await User.findOne({ email: tokenCheck.auth });
    if (!activateUser) {
      return res.status(400).json({ message: "User not found" });
    }
  } else {
    return res.status(400).json({ message: " Auth is Undefined" });
  }

  if (otp !== activateUser.accessToken) {
    return res.status(400).json({ message: " OTP Doesn't Match " });
  }

  activateUser.accessToken = null;
  activateUser.save();

  // clear token
  res.clearCookie("verifyToken");

  return res
    .status(200)
    .json({ message: " User Activation Successful", user: activateUser });
});

/**
 * @DESC account Verification By URL
 * @ROUTE /api/v1/auth/verifyByURL/:tokenURL
 * @method POST
 * @access public
 */
export const accountVerificationByURL = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ message: "Invalid token" });
  }

  const verifyToken = hyphensToDots(token);

  // verify the token

  const tokenCheck = jwt.verify(verifyToken, process.env.ACCESS_TOKEN_SECRET);

  if (!tokenCheck) {
    return res.status(400).json({ message: " Invalid Active Request " });
  }

  // activate account now

  let activateUser = null;

  if (isEmail(tokenCheck.auth)) {
    activateUser = await User.findOne({ email: tokenCheck.auth });

    if (!activateUser) {
      return res.status(400).json({ message: "User not found" });
    }
  } else {
    return res.status(400).json({ message: " Auth is Undefined" });
  }

  activateUser.accessToken = null;
  activateUser.save();

  // clear token
  res.clearCookie("verifyToken");

  return res
    .status(200)
    .json({ message: " User Activation Successful", user: activateUser });
});

/**
 * @DESC resend account Verification By OTP
 * @ROUTE /api/v1/auth/resendVerification/:auth
 * @method POST
 * @access public
 */
export const resendAccountVerification = asyncHandler(async (req, res) => {
  const { auth } = req.params;

  //  create a access token for account activation

  const activationCode = createOTP();

  // auth value manage

  let authEmail = null;
  let authPhone = null;
  let authUser = null;

  if (isEmail(auth)) {
    authEmail = auth;

    //  check authUser
    authUser = await User.findOne({ email: authEmail });

    // create verification token

    const verifyToken = jwt.sign(
      { auth: auth },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    res.cookie("verifyToken", verifyToken);

    // activation link

    const activationLink = `http://localhost:3000/verify/${dotsToHyphens(
      verifyToken
    )}`;
    // send Email

    await AccountActivationEmail(auth, {
      name: authUser.name,
      code: activationCode,
      link: activationLink,
    });
  } else if (isMobile(auth)) {
    authPhone = auth;

    //  check authUser
    authUser = await User.findOne({ phone: authPhone });

    // create verification token

    const verifyToken = jwt.sign(
      { auth: auth },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    res.cookie("verifyToken", verifyToken);

    // send otp

    await sendSMS(
      auth,
      `Hello , ${authUser.name}, Your Account Activation Code is ${activationCode}`
    );
  }

  authUser.accessToken = activationCode;
  authUser.save();

  res.status(200).json({
    user: authUser,
    message: "Activation Code Send successful",
  });
});

/**
 * @DESC forgot Password Reset
 * @ROUTE /api/v1/auth/forgotPassReset
 * @method POST
 * @access public
 */
export const forgotPasswordReset = asyncHandler(async (req, res) => {
  const { auth } = req.body;

  //  create a access token for account activation

  const activationCode = createOTP();

  // reset password user

  let resetPassUser = null;

  if (isEmail(auth)) {
    // user email check
    resetPassUser = await User.findOne({ email: auth });

    if (!resetPassUser) {
      return res.status(400).json({ message: "No User Found" });
    }

    // create verification token

    const verifyToken = jwt.sign(
      { auth: auth },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    res.cookie("verifyToken", verifyToken);

    // activation link

    const activationLink = `http://localhost:3000/verify/${dotsToHyphens(
      verifyToken
    )}`;
    // send Email

    await AccountActivationEmail(auth, {
      name: resetPassUser.name,
      code: activationCode,
      link: activationLink,
    });
  } else if (isMobile(auth)) {
    // user phone number check
    resetPassUser = await User.findOne({ phone: auth });

    if (!resetPassUser) {
      return res.status(400).json({ message: "User Not Found" });
    }

    // create verification token

    const verifyToken = jwt.sign(
      { auth: auth },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    res.cookie("verifyToken", verifyToken);

    // send otp

    await sendSMS(
      auth,
      `Hello , ${resetPassUser.name}, Your Password Reset Code is ${activationCode}`
    );
  } else {
    return res
      .status(400)
      .json({ message: "You Must Use Email Or Phone Number For Registration" });
  }

  resetPassUser.accessToken = activationCode;
  resetPassUser.save();

  res.status(200).json({ message: "User Reset Password Code Send Successful" });
});

/**
 * @DESC Reset Password
 * @ROUTE /api/v1/auth/resetPass/:token
 * @method POST
 * @access public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const { newPass, confPass, otp } = req.body;

  if (!newPass) {
    return res.status(400).json({ message: "New Password is Required" });
  }
  if (!confPass) {
    return res.status(400).json({ message: "Confirm Password is Required" });
  }
  if (!token) {
    return res.status(400).json({ message: "Token Not Found" });
  }

  if (!otp) {
    return res.status(400).json({ message: "OTP Not Found" });
  }

  if (newPass !== confPass) {
    return res.status(400).json({ message: "Password Not Match" });
  }

  const verifyToken = hyphensToDots(token);

  // verify the token

  const tokenCheck = jwt.verify(verifyToken, process.env.ACCESS_TOKEN_SECRET);

  if (!tokenCheck) {
    return res.status(400).json({ message: " Invalid Active Request" });
  }

  // activate account now

  let resetPassUser = null;

  if (isMobile(tokenCheck.auth)) {
    resetPassUser = await User.findOne({ phone: tokenCheck.auth });

    if (!resetPassUser) {
      return res.status(400).json({ message: "User not found" });
    }
  } else if (isEmail(tokenCheck.auth)) {
    resetPassUser = await User.findOne({ email: tokenCheck.auth });

    if (!resetPassUser) {
      return res.status(400).json({ message: "User not found" });
    }
  } else {
    return res.status(400).json({ message: " Auth is Undefined" });
  }

  if (otp !== resetPassUser.accessToken) {
    return res.status(400).json({ message: " OTP Doesn't Match " });
  }

  // password hash
  const hashPass = await bcrypt.hash(newPass, 10);

  resetPassUser.password = hashPass;
  resetPassUser.accessToken = null;
  resetPassUser.save();

  // clear token
  res.clearCookie("verifyToken");

  return res.status(200).json({ message: " Password Reset Successful" });
});

/**
 * @DESC upload Profile Photo
 * @ROUTE /api/v1/auth/resetPass/:token
 * @method POST
 * @access public
 */
export const uploadProfilePhoto = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // upload file

  const file = await cloudUpload(req);

  // find user

  const user = await User.findByIdAndUpdate(
    id,
    {
      photo: file.secure_url,
    },
    {
      new: true,
    }
  );

  res
    .status(200)
    .json({ user: user, message: "Profile Photo Upload Successful" });
});
