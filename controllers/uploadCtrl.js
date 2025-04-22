const cloudinary = require("cloudinary");
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCtrl = {
  uploadAvatar: (req, res) => {
    try {
      const file = req.files.file;

      cloudinary.v2.uploader.upload(
        file.tempFilePath,
        {
          folder: "avatars",
          width: 150,
          height: 150,
          crop: "fill",
        },
        async (err, result) => {
          console.log("Error  :", err);

          removeTmp(file.tempFilePath);

          console.log(result);
          res.json({ url: result.secure_url });
        }
      );
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  uploadEvidence: async (req, res) => {
    try {
      if (!req.files || !req.files.evidence) {
        return res.status(400).json({ message: "No files were uploaded." });
      }

      const files = req.files.evidence;
      const fileArray = Array.isArray(files) ? files : [files];
      console.log("Files to process:", fileArray.length);

      if (fileArray.length > 3) {
        return res.status(400).json({ message: "Maximum 3 files allowed" });
      }

      const uploadPromises = fileArray.map((file) => {
        return new Promise((resolve, reject) => {
          if (!file) {
            return reject("Invalid file");
          }

          if (!file.mimetype || !file.mimetype.match(/image.*/)) {
            return reject("Only images are allowed");
          }

          if (file.size > 5 * 1024 * 1024) {
            return reject("File size too large (max 5MB)");
          }

          if (!file.tempFilePath) {
            return reject("Missing temp file path");
          }

          cloudinary.v2.uploader.upload(
            file.tempFilePath,
            {
              folder: "evidence",
              width: 1024,
              crop: "limit",
            },
            (err, result) => {
              if (err) {
                console.error("Cloudinary upload error:", err);
                return reject(err);
              }

              removeTmp(file.tempFilePath);
              resolve(result.secure_url);
            }
          );
        });
      });

      const evidenceUrls = await Promise.all(uploadPromises).catch((err) => {
        console.error("Upload promise error:", err);
        throw new Error(err);
      });

      res.json({ evidenceUrls });
    } catch (err) {
      console.error("Upload evidence error:", err);
      return res.status(500).json({ message: err.message });
    }
  },

  uploadReviewImages: async (req, res) => {
    try {
      if (!req.files || !req.files.images) {
        return res.status(400).json({ message: "No files were uploaded." });
      }

      const files = req.files.images;
      const fileArray = Array.isArray(files) ? files : [files];

      if (fileArray.length > 5) {
        return res.status(400).json({ message: "Maximum 5 files allowed" });
      }

      const uploadPromises = fileArray.map((file) => {
        return new Promise((resolve, reject) => {
          if (!file.mimetype.match(/image.*/)) {
            return reject("Only images are allowed");
          }

          if (file.size > 5 * 1024 * 1024) {
            return reject("File size too large (max 5MB)");
          }

          cloudinary.v2.uploader.upload(
            file.tempFilePath,
            {
              folder: "reviews",
              width: 1024,
              crop: "limit",
            },
            (err, result) => {
              if (err) return reject(err);

              removeTmp(file.tempFilePath);
              resolve(result.secure_url);
            }
          );
        });
      });

      const imageUrls = await Promise.all(uploadPromises).catch((err) => {
        throw new Error(err);
      });

      res.json({ imageUrls });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

module.exports = uploadCtrl;
