import { Link, useNavigate } from "react-router-dom";
import AuthHeader from "../../components/AuthHeader/AuthHeader.jsx";
import HelmetTitle from "../../components/HelmetTitle/HelmetTitle.jsx";
import useFormFields from "../../hooks/useFormFields.jsx";
import { useDispatch, useSelector } from "react-redux";
import { createUser } from "../../features/auth/authApiSlice.js";
import { useEffect } from "react";
import { createToast } from "../../utils/toast.js";
import { setMessageEmpty } from "../../features/auth/authSlice.js";

const Register = () => {
  const title = "Sign Up";

  const { error, message, loader } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // form fields manage

  const { input, handleInputChange, resetForm } = useFormFields({
    name: "",
    userName: "",
    auth: "",
    password: "",
  });

  // handle Registration

  const handleRegistration = (e) => {
    e.preventDefault();

    dispatch(createUser(input));

    // toster er kahini na thakle eivabe
    // dispatch(createUser({ input, resetForm }));
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
      navigate("/verify");
    }
  }, [dispatch, error, message, resetForm, navigate]);

  return (
    <>
      <HelmetTitle title={title} />

      <div className="auth_container">
        <div className="auth_wrapper">
          <div className="auth_top">
            <AuthHeader title="create your Account" />

            <div className="auth_form">
              <form onSubmit={handleRegistration}>
                <input
                  type="text"
                  placeholder="Type Your Name"
                  value={input.name}
                  name="name"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  placeholder="Type Your User Name"
                  value={input.userName}
                  name="userName"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  placeholder="Email Or Phone number"
                  value={input.auth}
                  name="auth"
                  onChange={handleInputChange}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={input.password}
                  name="password"
                  onChange={handleInputChange}
                />

                <button className="bg_fb2" type="submit">
                  {loader ? "User Creating . . . ." : "Create Now "}
                </button>
              </form>
            </div>
          </div>
          <div className="auth_bottom">
            <Link to="/login" className="bg_fb">
              Log In Now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
