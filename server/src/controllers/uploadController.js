import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Validasi tipe file
const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

// Storage Cloudinary (tanpa fs)
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "berita",
    resource_type: "image",
    public_id: (req, file) => {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      return unique;
    },
  },
});

// Filter file
function fileFilter(req, file, cb) {
  if (!allowedTypes.includes(file.mimetype)) {
    cb(new Error("Format gambar tidak didukung"), false);
  } else {
    cb(null, true);
  }
}

// Middleware upload (single image)
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter,
}).single("image");

// Controller upload image
export const uploadImage = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        message: err.message || "Gagal upload gambar",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Tidak ada file yang diupload",
      });
    }

    return res.status(200).json({
      message: "Upload berhasil",
      url: req.file.path, // URL Cloudinary
      public_id: req.file.filename,
    });
  });
};
