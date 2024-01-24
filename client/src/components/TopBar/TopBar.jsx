import "./TopBar.scss";
import { Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { CiLock } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { CiLogout } from "react-icons/ci";
import { MdDarkMode } from "react-icons/md";
import useDropdownPopupControl from "../../hooks/useDropdownPopupControl.jsx";
import useAuthUser from "../../hooks/useAuthUser.jsx";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authApiSlice.js";
import Home from "../../svgs/Home.jsx";
import Video from "../../svgs/Video.jsx";
import MarketPlace from "../../svgs/MarketPlace.jsx";
import Group from "../../svgs/Group.jsx";
import FaceBookLogo from "../../svgs/FaceBookLogo.jsx";
import { Avatar } from "@chakra-ui/avatar";
import { io } from "socket.io-client";
import { useEffect, useRef } from "react";

const TopBar = () => {
  const { isOpen, toggleMenu } = useDropdownPopupControl();
  const { user } = useAuthUser();
  const dispatch = useDispatch();

  const socket = useRef();

    // user connection with socket start

    useEffect(() => {
      socket.current = io("ws://localhost:8000/");
  
    }, []);

  // handle User Log Out

  const handleUserLogOut = () => {
    socket.current.emit('removeLogOutUser', user._id)
    dispatch(logoutUser());

  };

  // Function to generate a random color
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Generate a random color for each avatar
  const randomColor = getRandomColor();

  return (
    <>
      <div className="topBar">
        <div className="topBarContainer">
          <div className="topBarSearch">
            <Link to="/">
              <FaceBookLogo />
            </Link>
            <div className="searchBox">
              <input type="text" placeholder="Search Messenger" />

              <CiSearch />
            </div>
          </div>
          <div className="topBarMenu">
            <ul>
              <li>
                <Link to="/">
                  <Home />
                </Link>
              </li>
              <li>
                <Link to="/">
                  <Video />
                </Link>
              </li>

              <li>
                <Link to="/">
                  <MarketPlace />
                </Link>
              </li>
              <li>
                <Link to="/">
                  <Group />
                </Link>
              </li>
            </ul>
          </div>
          <div className="topBarUser">
            <button onClick={toggleMenu}>
              <Avatar
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  fontSize: "20px",
                }}
                src={user?.photo}
                name={user.name}
                bg={randomColor}
              />
            </button>
            {isOpen && (
              <div className="dropDownMenu">
                <ul>
                  <li>
                    <Link to="">
                      <MdDarkMode />
                      Dark Mode
                    </Link>
                  </li>
                  <li>
                    <Link to="">
                      <CiLock />
                      Password Change
                    </Link>
                  </li>
                  <li>
                    <Link to="/profileEdit">
                      <CgProfile />
                      Edit Profile
                    </Link>
                  </li>
                  <li>
                    <Link onClick={handleUserLogOut}>
                      <CiLogout />
                      Log Out
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TopBar;
