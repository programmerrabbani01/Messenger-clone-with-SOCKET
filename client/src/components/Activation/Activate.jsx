import { useNavigate } from "react-router-dom";
import "./Activate.scss";
import AuthHeader from "../AuthHeader/AuthHeader.jsx";
import HelmetTitle from "../HelmetTitle/HelmetTitle.jsx";
import useFormFields from "../../hooks/useFormFields.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { createToast } from "../../utils/toast.js";
import { setMessageEmpty } from "../../features/auth/authSlice.js";
import useAuthUser from "../../hooks/useAuthUser.jsx";
import {
  dotsToHyphens,
  hideEmailMiddle,
  hideMobileMiddle,
} from "../../helpers/helpers.js";
import {
  resendActivation,
  verifyUserByOTP,
} from "../../features/auth/authApiSlice.js";
import Cookie from "js-cookie";

const Activate = () => {
  const title = "Active Your Account";

  const { input, resetForm, handleInputChange } = useFormFields({
    otp: "",
  });

  const token = Cookie.get("verifyToken");

  const { user } = useAuthUser();
  const { error, message } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  // handle Resend Activation Code

  const handleResendActivationCode = (e, auth) => {
    e.preventDefault();

    dispatch(resendActivation(auth));
  };

  // handle Verify Form

  const handleResendOTPForm = (e) => {
    e.preventDefault();

    dispatch(verifyUserByOTP({ otp: input.otp, token: dotsToHyphens(token) }));
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
  }, [dispatch, error, message, resetForm, navigate]);

  return (
    <>
      <HelmetTitle title={title} />

      <div className="auth_container" style={{ height: "90vh" }}>
        <div className="auth_wrapper" style={{ height: "400px" }}>
          <div className="auth_top">
            <AuthHeader
              title={` Hello ${user.name}, Please Active Your Account. `}
            />

            <div className="auth_form">
              <form onSubmit={handleResendOTPForm}>
                <input
                  type="text"
                  placeholder="Activation By OTP"
                  value={input.otp}
                  onChange={handleInputChange}
                  name="otp"
                />
                <button className="bg_fb" type="submit">
                  Active Now
                </button>
              </form>

              {user.phone && (
                <a
                  className="activeBtnMargin"
                  href=""
                  onClick={(e) => handleResendActivationCode(e, user?.phone)}
                >
                  Resent OTP To {hideMobileMiddle(user?.phone)}
                </a>
              )}
              {user.email && (
                <a
                  className="activeBtnMargin"
                  href=""
                  onClick={(e) => handleResendActivationCode(e, user?.email)}
                >
                  Resent Link {hideEmailMiddle(user?.email)}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Activate;
