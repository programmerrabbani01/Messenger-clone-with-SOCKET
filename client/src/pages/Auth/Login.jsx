import { Link, useNavigate } from "react-router-dom";
import AuthHeader from "../../components/AuthHeader/AuthHeader.jsx";
import HelmetTitle from "../../components/HelmetTitle/HelmetTitle.jsx";
import { useEffect } from "react";
import { createToast } from "../../utils/toast.js";
import { setMessageEmpty } from "../../features/auth/authSlice.js";
import useFormFields from "../../hooks/useFormFields.jsx";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/authApiSlice.js";

const Login = () => {
  const title = "Sign In";

  const navigate = useNavigate();

  const { input, resetForm, handleInputChange } = useFormFields({
    auth: "",
    password: "",
  });

  const { error, message, user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  // handle LogIn Form Submit

  const handleLogInFormSubmit = (e) => {
    e.preventDefault();

    dispatch(loginUser(input));
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
      navigate("/");
    }
    if (user) {
      navigate("/");
    }
  }, [dispatch, error, message, resetForm, navigate, user]);

  return (
    <>
      <HelmetTitle title={title} />

      <div className="auth_container">
        <div className="auth_wrapper">
          <div className="auth_top">
            <AuthHeader title="log in to get started" />

            <div className="auth_form">
              <form onSubmit={handleLogInFormSubmit}>
                <input
                  type="text"
                  placeholder="Email Or Phone number"
                  name="auth"
                  value={input.auth}
                  onChange={handleInputChange}
                />
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={input.password}
                  onChange={handleInputChange}
                />
                <button className="bg_fb" type="submit">
                  Log In
                </button>
              </form>
              <Link to="/forgotPassword" className="forgot">
                Forgot Your Password ?
              </Link>
            </div>
          </div>
          <div className="auth_bottom">
            <Link to="/register" className="bg_fb2">
              create new account
            </Link>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default Login;
