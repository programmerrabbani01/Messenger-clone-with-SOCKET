import Activate from "../../components/Activation/Activate.jsx";
import MessengerMain from "../../components/MessengerMain/MessengerMain.jsx";
import TopBar from "../../components/TopBar/TopBar.jsx";
import useAuthUser from "../../hooks/useAuthUser.jsx";

const Messenger = () => {
  const { user } = useAuthUser();
  return (
    <>
      <TopBar />

      {user.accessToken ? <Activate /> : <MessengerMain />}
    </>
  );
};

export default Messenger;
