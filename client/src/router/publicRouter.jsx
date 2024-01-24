import Forgot from "../pages/Auth/Forgot.jsx";
import Home from "../pages/Auth/Home.jsx";
import Login from "../pages/Auth/Login.jsx";
import Profile from "../pages/Auth/Profile.jsx";
import Register from "../pages/Auth/Register.jsx";
import Reset from "../pages/Auth/Reset.jsx";
import VerifyEmailPhn from "../pages/Auth/VerifyEmailPhn.jsx";
import PublicGard from "./PublicGard.jsx";

// create public router
const publicRouter = [
  {
    element: <PublicGard />,
    children: [
      {
        path: "/auth",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/forgotPassword",
        element: <Forgot />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/resetPassword",
        element: <Reset />,
      },
      {
        path: "/verify",
        element: <VerifyEmailPhn />,
      },
      {
        path: "/verify/:tokenURL",
        element: <VerifyEmailPhn />,
      },
    ],
  },
];

// export router
export default publicRouter;
