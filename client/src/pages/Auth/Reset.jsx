import { Link, useNavigate } from "react-router-dom";
import AuthHeader from "../../components/AuthHeader/AuthHeader.jsx";
import HelmetTitle from "../../components/HelmetTitle/HelmetTitle.jsx";
import useFormFields from "../../hooks/useFormFields.jsx";
import { useEffect } from "react";
import { createToast } from "../../utils/toast.js";
import { getAuthData, setMessageEmpty } from "../../features/auth/authSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../features/auth/authApiSlice.js";
import Cookie from "js-cookie";

const Reset = () => {
  const title = "Reset Password";

  const { error, message } = useSelector(getAuthData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = Cookie.get("verifyToken");

  // form fields manage

  const { input, handleInputChange, resetForm } = useFormFields({
    newPass: "",
    confPass: "",
    otp: "",
  });

  // handle Form Submit

  const handleFormSubmit = (e) => {
    e.preventDefault();

    dispatch(resetPassword({ input, token }));
  };

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
            <AuthHeader title="Reset Your Password" />

            <div className="auth_form">
              <form onSubmit={handleFormSubmit}>
                <input
                  type="password"
                  placeholder="Enter Your New Password"
                  value={input.newPass}
                  name="newPass"
                  onChange={handleInputChange}
                />

                <input
                  type="password"
                  placeholder="Enter Your Confirm Password"
                  value={input.confPass}
                  name="confPass"
                  onChange={handleInputChange}
                />

                <input
                  type="number"
                  placeholder="Enter Your OTP"
                  value={input.otp}
                  name="otp"
                  onChange={handleInputChange}
                />

                <button className="bg_fb" type="submit">
                  Reset Now
                </button>
              </form>
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

export default Reset;
