import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import Chat from "../models/Chat.js";
import { cloudUpload } from "../utils/cloudinary.js";

/**
 * @DESC Get all chat
 * @ROUTE /api/v1/chat
 * @method GET
 * @access public
 */
export const getAllChat = asyncHandler(async (req, res) => {
  const senderId = req.me._id;
  const receiverId = req.params.id;

  // get chats

  const getAllChats = await Chat.find({
    $or: [
      {
        $and: [
          { senderID: { $eq: senderId } },
          { receiverID: { $eq: receiverId } },
        ],
      },
      {
        $and: [
          { senderID: { $eq: receiverId } },
          { receiverID: { $eq: senderId } },
        ],
      },
    ],
  });

  res.status(200).json({ chat: getAllChats });
});

/**
 * @DESC create a chat
 * @ROUTE /api/v1/chat
 * @method POST
 * @access public
 */
export const createChat = asyncHandler(async (req, res) => {
  const { chat, receiverID } = req.body;

  const senderID = req.me._id;

  // cloud Upload

  let createImage = null;

  if (req.file) {
    const logo = await cloudUpload(req);
    createImage = logo?.secure_url;
  }

  const chatMsg = await Chat.create({
    message: {
      text: chat,
      photo: createImage ? createImage : "",
    },
    senderID,
    receiverID,
  });

  res.status(201).json({
    chat: chatMsg,
  });
});
