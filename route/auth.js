import express from "express";
import {
  login,
  logout,
  register,
  loggedInUser,
  makeHashPass,
  accountVerificationByOTP,
  accountVerificationByURL,
  resendAccountVerification,
  forgotPasswordReset,
  resetPassword,
  uploadProfilePhoto,
} from "../controllers/authController.js";
import tokenVerify from "../middlewares/verifyToken.js";
import { userProfilePhoto } from "../utils/multer.js";

const router = express.Router();

// create route
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/hash").post(makeHashPass);
router.route("/register").post(register);
router.route("/verifyByOTP/:token").post(accountVerificationByOTP);
router.route("/verifyByURL/:token").post(accountVerificationByURL);
router.route("/resendVerificationCode/:auth").get(resendAccountVerification);
router.route("/forgotPassReset").post(forgotPasswordReset);
router.route("/resetPass/:token").post(resetPassword);
router
  .route("/profilePhotoUpload/:id")
  .post(userProfilePhoto, uploadProfilePhoto);

router.get("/me", tokenVerify, loggedInUser);

// export default router
export default router;
