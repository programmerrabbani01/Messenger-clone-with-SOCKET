import { Link, useNavigate } from "react-router-dom";
import AuthHeader from "../../components/AuthHeader/AuthHeader.jsx";
import HelmetTitle from "../../components/HelmetTitle/HelmetTitle.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getAuthData, setMessageEmpty } from "../../features/auth/authSlice.js";
import { useEffect } from "react";
import { createToast } from "../../utils/toast.js";
import useFormFields from "../../hooks/useFormFields.jsx";
import { forgotPassword } from "../../features/auth/authApiSlice.js";

const Forgot = () => {
  const title = "Forgot Password";

  const { error, message } = useSelector(getAuthData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // form fields manage

  const { input, handleInputChange, resetForm } = useFormFields({
    auth: "",
  });

  // handle Form Submit

  const handleFormSubmit = (e) => {
    e.preventDefault();

    dispatch(forgotPassword(input));
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
      navigate("/resetPassword");
    }
  }, [dispatch, error, message, resetForm, navigate]);

  return (
    <>
      <HelmetTitle title={title} />

      <div className="auth_container">
        <div className="auth_wrapper">
          <div className="auth_top">
            <AuthHeader
              title="Forgot Your Password"
              para="Give Email Or Phone Number For Get Reset OTP"
            />

            <div className="auth_form">
              <form onSubmit={handleFormSubmit}>
                <input
                  type="text"
                  placeholder="Email Or Phone number"
                  value={input.auth}
                  name="auth"
                  onChange={handleInputChange}
                />
                <button className="bg_fb" type="submit">
                  Send Now
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

export default Forgot;
