import { Link, useNavigate, useParams } from "react-router-dom";
import AuthHeader from "../../components/AuthHeader/AuthHeader.jsx";
import HelmetTitle from "../../components/HelmetTitle/HelmetTitle.jsx";
import "./auth.scss";
import Cookie from "js-cookie";
import { useEffect } from "react";
import useFormFields from "../../hooks/useFormFields.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  verifyUserByOTP,
  verifyUserByURL,
} from "../../features/auth/authApiSlice.js";
import { dotsToHyphens } from "../../helpers/helpers.js";
import { createToast } from "../../utils/toast.js";
import { setMessageEmpty } from "../../features/auth/authSlice.js";

const VerifyEmailPhn = () => {
  const title = "Active Your Account";

  const navigate = useNavigate();

  // get token from url

  const { tokenURL } = useParams();

  const { input, resetForm, handleInputChange } = useFormFields({
    otp: "",
  });

  const { error, message } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const token = Cookie.get("verifyToken");

  // handle Verify Form

  const handleVerifyForm = (e) => {
    e.preventDefault();

    dispatch(verifyUserByOTP({ otp: input.otp, token: dotsToHyphens(token) }));
  };

  // token na thakle login a pathaia dibe

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // verify by URL
  useEffect(() => {
    if (tokenURL) {
      dispatch(verifyUserByURL(tokenURL));
    }
  }, [tokenURL, dispatch]);

  // message handler
  useEffect(() => {
    if (error) {
      createToast(error);
      dispatch(setMessageEmpty());
    }
    if (message) {
      createToast(message, "success");
      dispatch(setMessageEmpty());
      resetForm();
      navigate("/login");
    }
  }, [dispatch, error, message, resetForm, navigate]);

  return (
    <>
      <HelmetTitle title={title} />

      <div className="auth_container">
        <div className="auth_wrapper">
          <div className="auth_top">
            <AuthHeader title="Active Your Account" />

            <div className="auth_form">
              <form onSubmit={handleVerifyForm}>
                <input
                  type="text"
                  placeholder="Activation OTP"
                  value={input.otp}
                  onChange={handleInputChange}
                  name="otp"
                />
                <button className="bg_fb" type="submit">
                  Active Now
                </button>
              </form>
              <div className="verifyBtn">
                <a href="">Resent OTP</a>
                <a href="">Resent Link To g*********1@gmail.com</a>
              </div>
            </div>
          </div>
          <div className="auth_bottom">
            <Link to="/login" className="bg_fb">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyEmailPhn;
