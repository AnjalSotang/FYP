const multer = require("multer");

// Defining the storage configuration for uploaded files using multer.diskStorage()
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads"); // Files are saved in the "uploads" folder
  },
  filename: function (req, file, cb) {
    return cb(null, Date.now() + file.originalname); // Prefixes filename with the current timestamp
  },
});

// Defining the file filter to accept image, video, and GIF types
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/avif" || // Accept AVIF images|
    file.mimetype === "image/gif" || // Accept GIFs
    file.mimetype === "video/mp4" ||  // Accept MP4 videos
    file.mimetype === "video/avi" ||  // Accept AVI videos
    file.mimetype === "video/mkv" ||  // Accept MKV videos
    file.mimetype === "image/webp"

  ) {
    return cb(null, true); // Accepts the file if it's one of the allowed types
  } else {
    return cb(null, false); // Rejects the file if it's not an allowed type
  }
};

// Initializing multer with the storage and fileFilter configurations
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 50 }, // Limiting file size to 50MB (increase for videos)
  fileFilter: fileFilter, // Applying the file filter
});

module.exports = upload;
