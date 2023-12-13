const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  folder: "Blog Posts",
  allowedFormats: ["jpeg", "jpg", "png"],
});

const uploadVideoHandler = async (video) => {
  try {
    const uploadedVideo = await cloudinary.uploader.upload(video, {
      resource_type: "video",
    });
    return uploadedVideo;
  } catch (error) {
    return error;
  }
};

// const uploadImageHandler = async (image) => {
//   try {
//     const uploadedImage = await cloudinary.uploader.upload(image);
//     return uploadedImage;
//   } catch (error) {
//     return error;
//   }
// };

module.exports = {
  uploadVideoHandler,
  cloudinary,
  storage,
};
