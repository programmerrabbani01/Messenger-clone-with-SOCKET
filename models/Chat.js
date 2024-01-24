import mongoose from "mongoose";

const chatSchema = mongoose.Schema(
  {
    senderID: {
      type: String,
      required: true,
    },
    receiverID: {
      type: String,
      default: null,
    },
    message: {
      text: {
        type: String,
        default: "",
      },
      photo: {
        type: String,
        default: "",
      },
      emo: {
        type: String,
        default: "",
      },
      gallery: {},
    },
    theme: {
      type: String,
      default: "",
    },
    emoji: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["seen", "sent"],
      default: "sent",
    },
    trash: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Chat", chatSchema);
