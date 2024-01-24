import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsersData,
  setMessageEmpty,
} from "../../features/user/userSlice.js";
import { useEffect } from "react";
import { createToast } from "../../utils/toast.js";
import { getAllUser } from "../../features/user/userApiSlice.js";
import TreeDot from "../../svgs/TreeDot.jsx";
import Edit from "../../svgs/Edit.jsx";
import Search from "../../svgs/Search.jsx";
import moment from "moment";
import UserAvatar from "../Avater/UserAvater.jsx";

const ChatUsers = ({ activeChat, setActiveChat, activeUserS }) => {
  const dispatch = useDispatch();

  const { error, message, users } = useSelector(getAllUsersData);

  // getAllUser
  useEffect(() => {
    dispatch(getAllUser());
  }, [dispatch]);

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
      <div className="chatUsers">
        <div className="chatUsersHeader">
          <div className="chatUsersHeaderTop">
            <h2>Chats</h2>
            <div className="buttons">
              <button>
                <TreeDot />
              </button>
              <button>
                <Edit />
              </button>
            </div>
          </div>
          <div className="chatUsersHeaderSearch">
            <input type="search" placeholder="Search Messenger" />
            <button className="search">
              <Search />
            </button>
          </div>
          <div className="chatUsersHeaderMenu">
            <button className="active">Inbox</button>
            <button>Communities</button>
          </div>
        </div>
        <div className="chatUsersList">
          {users?.map((item, index) => {
            return (
              <div
                className={`userItem ${
                  item?.userInfo?._id === activeChat?._id ? "active" : ""
                }`}
                key={index}
                onClick={() => setActiveChat(item?.userInfo)}
              >
                {activeUserS.some(
                  (data) => data.userId === item?.userInfo?._id
                ) && <div className="userStatus activeUser"></div>}

                {item?.userInfo?.photo ? (
                  <img src={item?.userInfo?.photo} alt="" />
                ) : (
                  <UserAvatar username={item?.userInfo?.name} />
                )}

                <div className="userDetails">
                  <span className="userName">{item?.userInfo?.name}</span>
                  <span className="userChatInfo">
                    <span className="chatShort">
                      {item?.lastMsg
                        ? item?.lastMsg?.message?.text.slice(0, 20)
                        : "Connected"}
                    </span>
                    <span className="chatTime">
                      {item?.lastMsg?.createdAt &&
                        moment(item?.lastMsg?.createdAt).startOf("").fromNow()}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ChatUsers;
