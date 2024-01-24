import cloudinary from "cloudinary";
import fs from "fs";

// config cloudinary
cloudinary.v2.config({
  cloud_name: "dairwhedy",
  api_key: "133861414556387",
  api_secret: "VXfHSyH06s7z1XjH7dBxhMEid2Q",
});

export const cloudUpload = async (req) => {
  // upload brand logo
  const data = await cloudinary.v2.uploader.upload(req.file.path);
  return data;
};

export const cloudUploads = async (path) => {
  // upload brand logo
  const data = await cloudinary.v2.uploader.upload(path);
  return data.secure_url;
};

export const cloudDelete = async (publicId) => {
  // delete brand logo
  await cloudinary.v2.uploader.destroy(publicId);
};
