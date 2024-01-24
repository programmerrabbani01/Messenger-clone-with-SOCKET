import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Chat from "../models/Chat.js";

/**
 * @DESC Get all users data
 * @ROUTE /api/v1/user
 * @method GET
 * @access public
 */
export const getAllUser = asyncHandler(async (req, res) => {
  const loginUser = req.me._id;

  const users = await User.find({
    $and: [{ accessToken: null }, { _id: { $ne: req.me._id } }],
  }).select("-password");

  // get new data

  let userWithLastMsg = [];

  // get last message information

  for (let i = 0; i < users.length; i++) {
    const lastMsg = await Chat.findOne({
      $or: [
        {
          $and: [
            { senderID: { $eq: loginUser } },
            { receiverID: { $eq: users[i]._id } },
          ],
        },
        {
          $and: [
            { senderID: { $eq: users[i]._id } },
            { receiverID: { $eq: loginUser } },
          ],
        },
      ],
    }).sort({
      createdAt: -1,
    });

    userWithLastMsg = [
      ...userWithLastMsg,
      {
        userInfo: users[i],
        lastMsg: lastMsg,
      },
    ];
  }

  if (users.length > 0) {
    res.status(200).json({ users: userWithLastMsg });
  } else {
    res.status(404).json({ message: "User Not Found" });
  }
});

/**
 * @DESC Get Single users data
 * @ROUTE /api/v1/user/:id
 * @method GET
 * @access public
 */
export const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User data not found" });
  }

  res.status(200).json(user);
});

/**
 * @DESC Create new User
 * @ROUTE /api/v1/user
 * @method POST
 * @access public
 */
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // check user email
  const userEmailCheck = await User.findOne({ email });

  if (userEmailCheck) {
    return res.status(400).json({ message: "Email already exists" });
  }

  // password hash
  const hashPass = await bcrypt.hash(password, 10);

  // create new user
  const user = await User.create({
    name,
    email,
    password: hashPass,
    role,
  });

  // send user access to email
  sendMail({
    to: email,
    sub: "Account Access Info",
    msg: `Your account login access is email : ${email} & password : ${password}`,
  });

  res.status(200).json({ user, message: `${name} user created successful` });
});

/**
 * @DESC Delete User
 * @ROUTE /api/v1/user/:id
 * @method DELETE
 * @access public
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);

  res.status(200).json(user);
});

/**
 * @DESC Update User
 * @ROUTE /api/v1/user/:id
 * @method PUT/PATCH
 * @access public
 */
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { name, email, mobile, password, gender } = req.body;

  if (!name || !email || !mobile || !password || !gender) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findByIdAndUpdate(
    id,
    {
      name,
      email,
      mobile,
      password,
      gender,
    },
    { new: true }
  );

  res.status(200).json(user);
});
