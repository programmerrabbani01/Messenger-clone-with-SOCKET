import { Link } from "react-router-dom";
import TopBar from "../../components/TopBar/TopBar.jsx";
import HelmetTitle from "../../components/HelmetTitle/HelmetTitle.jsx";
import { Avatar } from "@chakra-ui/avatar";
import useAuthUser from "../../hooks/useAuthUser.jsx";
import { useDispatch, useSelector } from "react-redux";
import { uploadUserProfilePhoto } from "../../features/auth/authApiSlice.js";
import { useEffect } from "react";
import { getAuthData, setMessageEmpty } from "../../features/auth/authSlice.js";
import { createToast } from "../../utils/toast.js";

const Profile = () => {
  const title = "Edit Profile";

  const { user } = useAuthUser();

  const dispatch = useDispatch();

  const { error, message } = useSelector(getAuthData);

  // upload file

  const handleFileUpload = (e) => {
    const profilePhoto = e.target.files[0];

    const formData = new FormData();

    formData.append("profilePhoto", profilePhoto);

    dispatch(uploadUserProfilePhoto({ data: formData, id: user._id }));
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

  // message handler

  useEffect(() => {
    if (error) {
      createToast(error);
      dispatch(setMessageEmpty());
    }
    if (message) {
      createToast(message, "success");
      dispatch(setMessageEmpty());
    }
  }, [dispatch, error, message]);

  return (
    <>
      <TopBar />
      <HelmetTitle title={title} />

      <div className="auth_container">
        <div className="auth_wrapper">
          <div className="auth_top">
            <div
              className="profilePhotoWrap"
              style={{ background: randomColor }}
            >
              <Avatar src={user.photo} name={user.name} />

              <label className="profilePhotoUpload">
                upload a photo
                <input type="file" onChange={handleFileUpload} />
              </label>
            </div>
          </div>
          <div className="auth_bottom">
            <Link to="/" className="bg_fb">
              Back To Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
