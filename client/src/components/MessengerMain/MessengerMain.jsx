import "./MessengerMain.scss";
import { IoIosCall } from "react-icons/io";
import { FaVideo } from "react-icons/fa";
import { IoInformationCircle } from "react-icons/io5";
import Plus from "../../svgs/Plus.jsx";
import Gallery from "../../svgs/Gallery.jsx";
import Sticker from "../../svgs/Sticker.jsx";
import Gif from "../../svgs/Gif.jsx";
import Smile from "../../svgs/Smile.jsx";
import Like from "../../svgs/Like.jsx";
import EmojiPicker from "emoji-picker-react";
import useDropdownPopupControl from "../../hooks/useDropdownPopupControl.jsx";
import ProfileIcon from "../../svgs/ProfileIcon.jsx";
import Notification from "../../svgs/Notification.jsx";
import Search from "../../svgs/Search.jsx";
import Collapsible from "react-collapsible";
import ChatUsers from "../ChatUsers/ChatUsers.jsx";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createChats,
  getUserToUserChats,
} from "../../features/chat/chatApiSlice.js";
import {
  getAllChatsData,
  realTimeChatUpdate,
  setMessageEmpty,
} from "../../features/chat/chatSlice.js";
import useAuthUser from "../../hooks/useAuthUser.jsx";
import { io } from "socket.io-client";
import moment from "moment";
import { Link } from "react-router-dom";
import useSound from "use-sound";
import messengerNotification from "../../assets/messengerNotification.mp3";
import messageSendSound from "../../assets/happy-pop-3-185288.mp3";
import messageDotImage from "../../assets/typing-dots.gif";
import UserAvatar from "../Avater/UserAvater.jsx";

const MessengerMain = () => {
  const { isOpen, toggleMenu } = useDropdownPopupControl();

  const dispatch = useDispatch();

  const { chats, chatSuccess } = useSelector(getAllChatsData);

  const { user } = useAuthUser();

  const [activeChat, setActiveChat] = useState(false);

  const [chatImage, setChatImage] = useState(null);

  const [chat, setChat] = useState("");
  const [chatSoundNotification, setChatSoundNotification] = useState(false);

  const scrollChat = useRef();

  const [notification] = useSound(messengerNotification);

  const [sendMessageSound] = useSound(messageSendSound);

  const socket = useRef();

  const [activeUserS, setActiveUserS] = useState([]);

  // user connection with socket start

  useEffect(() => {
    socket.current = io("ws://localhost:8000/");

    // send loggedIn user to socket as active user
    socket.current.emit("setActiveUser", user);

    // get active users data

    socket.current.on("getActiveUsers", (data) => {
      setActiveUserS(data);
    });

    // get real time messages from socket

    socket.current.on("realTimeMsgGet", (data) => {
      dispatch(realTimeChatUpdate(data));
      setChatSoundNotification(true);
    });
  }, []);

  // get message sound notification
  useEffect(() => {
    if (chatSoundNotification) {
      notification();
      setChatSoundNotification(false);
    }
  }, [chatSoundNotification, setChatSoundNotification, notification]);

  // user connection with socket end

  // handle Emoji Select

  const handleEmojiSelect = (emojiObject, event) => {
    setChat((prevState) => prevState + " " + emojiObject.emoji);
  };

  // send message

  const handleMessageSent = (e) => {
    if (e.key === "Enter") {
      const form_data = new FormData();

      form_data.append("chat", chat);
      form_data.append("receiverID", activeChat._id);
      form_data.append("chatImage", chatImage);

      dispatch(createChats(form_data));
      setChat("");
      setChatImage(null);
      sendMessageSound();
    }
  };

  // real time msg send to socket

  useEffect(() => {
    if (chatSuccess) {
      socket.current.emit("realTimeMsgSend", chatSuccess);
    }

    dispatch(setMessageEmpty());
  }, [chatSuccess, dispatch]);

  // get notification sound
  useEffect(() => {
    if (
      chatSuccess &&
      chatSuccess.senderID !== activeUserS._id &&
      chatSuccess.receiverID == user._id
    ) {
      notification();
    }
  }, [chatSuccess, notification, activeUserS._id, user._id]);

  //get User To User Chats

  useEffect(() => {
    dispatch(getUserToUserChats(activeChat._id));
  }, [activeChat, dispatch]);

  // scrolling chats

  useEffect(() => {
    scrollChat.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  // handle Change Image

  const handleChangeImage = (e) => {
    setChatImage(e.target.files[0]);
  };

  return (
    <>
      <div className="chatContainer">
        <ChatUsers
          activeChat={activeChat}
          setActiveChat={setActiveChat}
          scrollChat={scrollChat}
          activeUserS={activeUserS}
        />

        <div className="chatBody">
          {activeChat ? (
            <>
              <div className="chatBodyActiveUser">
                <div className="chatActiveUserDetails">
                  {activeUserS.some(
                    (data) => data.userId === activeChat._id
                  ) && <div className="userStatusHeader activeUser"></div>}

                  {activeChat?.photo ? (
                    <img
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        fontSize: "20px",
                      }}
                      src={activeChat?.photo}
                      alt=""
                    />
                  ) : (
                    <UserAvatar
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        fontSize: "20px",
                      }}
                      username={activeChat?.name}
                    />
                  )}

                  <span className="chatUserName">{activeChat?.name}</span>
                </div>
                <div className="chatActiveUserMenu">
                  <button>
                    <IoIosCall />
                  </button>
                  <button>
                    <FaVideo />
                  </button>
                  <button>
                    <IoInformationCircle />
                  </button>
                </div>
              </div>

              <div className="chatBodyMessages">
                <div className="chatMsgProfile">
                  {activeUserS.some(
                    (data) => data.userId === activeChat._id
                  ) && <div className="userStatusBody activeUser"></div>}

                  {activeChat?.photo ? (
                    <img
                      className="bodyAvatar"
                      src={activeChat?.photo}
                      alt=""
                    />
                  ) : (
                    <UserAvatar
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "50%",
                        fontSize: "20px",
                      }}
                      username={activeChat?.name}
                    />
                  )}

                  <span className="chatUserName">{activeChat?.name}</span>
                </div>

                <div className="chatMsgList">
                  {chats.length > 0
                    ? chats.map((chat, index) => {
                        return (
                          <div key={index}>
                            {chat.senderID === user._id ? (
                              <div className="myMsg">
                                {chat?.message?.text && (
                                  <div className="msgText">
                                    {chat?.message?.text}
                                  </div>
                                )}
                                {chat?.message?.photo && (
                                  <div className="msgPhoto">
                                    <img src={chat?.message?.photo} alt="" />
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="friendMsg">
                                <div className="avatar">
                                  {activeChat?.photo ? (
                                    <img src={activeChat?.photo} alt="" />
                                  ) : (
                                    <UserAvatar
                                      style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                        fontSize: "20px",
                                      }}
                                      username={activeChat?.name}
                                    />
                                  )}
                                </div>
                                <div className="friendMsgDetails">
                                  {chat?.message?.text && (
                                    <div className="msgText">
                                      {chat.message.text}
                                    </div>
                                  )}

                                  {chat?.message?.photo && (
                                    <div className="msgPhoto">
                                      <img src={chat?.message?.photo} alt="" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="msgTime">
                              <span>
                                {moment(chat?.createdAt).startOf("").fromNow()}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    : ""}

                  <div className="friendMsg">
                    <div className="avatar">
                      {activeChat?.photo ? (
                        <img src={activeChat?.photo} alt="" />
                      ) : (
                        <UserAvatar
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            fontSize: "20px",
                          }}
                          username={activeChat?.name}
                        />
                      )}
                    </div>
                    <div className="friendMsgDetails">
                      <img
                        style={{
                          width: "70px",
                          transform: "translate(-16px,0px)",
                        }}
                        src={messageDotImage}
                        alt=""
                      />
                    </div>
                  </div>

                  <div ref={scrollChat}></div>
                </div>
              </div>
              <div className="chatBodyForm">
                <div className="chatFormIcons">
                  <ul>
                    <li>
                      <Plus />
                    </li>
                    <li>
                      <label>
                        <Gallery />
                        <input
                          id="chatImage"
                          type="file"
                          style={{ display: "none" }}
                          onChange={handleChangeImage}
                        />
                      </label>
                    </li>
                    <li>
                      <Sticker />
                    </li>
                    <li>
                      <Gif />
                    </li>
                  </ul>
                </div>
                <div className="chatFormInput">
                  <input
                    type="text"
                    placeholder="Aa"
                    value={chat}
                    onChange={(e) => setChat(e.target.value)}
                    onKeyDown={handleMessageSent}
                  />

                  {isOpen && (
                    <div className="chatEmojiPiker">
                      <EmojiPicker
                        previewConfig={{ showPreview: false }}
                        skinTonesDisabled={true}
                        onEmojiClick={handleEmojiSelect}
                      />
                    </div>
                  )}

                  <button className="emojiButton" onClick={toggleMenu}>
                    <Smile />
                  </button>
                </div>
                <div className="chatEmoji">
                  <Like />
                </div>
              </div>
            </>
          ) : (
            <div className="noChat">
              <h3 className="noChatSelect">
                <div className="noChatImg"></div>
                No Chat Selected
              </h3>
            </div>
          )}
        </div>

        {activeChat ? (
          <>
            <div className="chatProfile">
              <div className="profileInfo">
                <div className="profileInfoDetails">
                  {activeUserS.some(
                    (data) => data.userId === activeChat._id
                  ) && <div className="userStatusProfile activeUser"></div>}

                  {activeChat?.photo ? (
                    <img src={activeChat?.photo} alt="" />
                  ) : (
                    <UserAvatar
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        fontSize: "20px",
                      }}
                      username={activeChat?.name}
                    />
                  )}

                  <div className="profileDetails">
                    <Link className="chatUserName">{activeChat?.name}</Link>
                    {activeUserS.some(
                      (data) => data.userId === activeChat._id
                    ) ? (
                      <p>Active Now</p>
                    ) : (
                      ""
                      // <p>
                      //   Active
                      //   {moment(chat?.createdAt).startOf("").fromNow()}
                      // </p>
                    )}
                  </div>
                </div>

                <ul>
                  <li>
                    <button>
                      <ProfileIcon />
                    </button>
                    <span>Profile</span>
                  </li>
                  <li>
                    <button>
                      <Notification />
                    </button>
                    <span>Mute</span>
                  </li>
                  <li>
                    <button>
                      <Search />
                    </button>
                    <span>Search</span>
                  </li>
                </ul>
              </div>

              <div className="collapseOptions">
                <Collapsible trigger="Chat info">
                  <p>
                    This is the collapsible content. It can be any element or
                    React component you like.
                  </p>
                  <p>
                    It can even be another Collapsible component. Check out the
                    next section!
                  </p>
                </Collapsible>

                <Collapsible trigger="Customize chat">
                  <p>
                    This is the collapsible content. It can be any element or
                    React component you like.
                  </p>
                  <p>
                    It can even be another Collapsible component. Check out the
                    next section!
                  </p>
                </Collapsible>

                <Collapsible trigger="Media, files and links">
                  <p>
                    This is the collapsible content. It can be any element or
                    React component you like.
                  </p>
                  <p>
                    It can even be another Collapsible component. Check out the
                    next section!
                  </p>
                </Collapsible>

                <Collapsible trigger="Privacy & support">
                  <p>
                    This is the collapsible content. It can be any element or
                    React component you like.
                  </p>
                  <p>
                    It can even be another Collapsible component. Check out the
                    next section!
                  </p>
                </Collapsible>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default MessengerMain;
