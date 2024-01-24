import { Link } from "react-router-dom";

const AuthHeader = ({ title, para }) => {
  return (
    <>
      <div className="auth_header">
        <Link to="/auth">
          <img
            src="https://static-00.iconduck.com/assets.00/messenger-icon-512x512-5pi1qivq.png"
            alt=""
          />
        </Link>
        <h1>{title}</h1>
        <p>{para}</p>
      </div>
    </>
  );
};

export default AuthHeader;
