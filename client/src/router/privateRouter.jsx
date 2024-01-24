import Profile from "../pages/Auth/Profile.jsx";
import Messenger from "../pages/Messenger/Messenger.jsx";
import PrivateGard from "./PrivateGard.jsx";

// create Private router
const privateRouter = [
  {
    element: <PrivateGard />,
    children: [
      {
        path: "/",
        element: <Messenger />,
      },
      {
        path: "/profileEdit",
        element: <Profile />,
      },
    ],
  },
];

// export router
export default privateRouter;
