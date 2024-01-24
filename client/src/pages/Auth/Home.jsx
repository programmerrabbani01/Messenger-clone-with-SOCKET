import "./auth.scss";
import { Link } from "react-router-dom";
import AuthHeader from "../../components/AuthHeader/AuthHeader.jsx";
import HelmetTitle from "../../components/HelmetTitle/HelmetTitle.jsx";

const Home = () => {
  const title = "Welcome To Messenger";

  return (
    <>
      <HelmetTitle title={title} />

      <div className="auth_container">
        <div className="auth_wrapper">
          <div className="auth_top">
            <AuthHeader
              title="welcome to messenger"
              para="the simple way to text, call and video chat right from your desktop."
            />
          </div>
          <div className="auth_bottom">
            <Link to="" className="bg_fb">
              log in with facebook
            </Link>
            <Link to="/login">log in with phone or email</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
