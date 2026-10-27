import multer from "multer";
import { mkdir } from "fs/promises";
import { randomUUID } from "crypto";
import { resolve } from "path";

const localUpload = ({
  acceptedFileTypes = [],
  fileSize = 5,
  folderName = "General",
}) => {
  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      const dist = `./assets/${folderName}`;
      await mkdir(resolve(dist), { recursive: true });
      cb(null, dist);
    },
    filename: (req, file, cb) => {
      cb(null, randomUUID() + file.originalname);
    },
  });

  //   const storage = multer.memoryStorage();

  const fileFilter = (req, file, cb) => {
    if (!acceptedFileTypes.includes(file.mimetype)) {
      cb(new Error("Invalid File Format", { cause: { statusCode: 400 } }));
      return;
    }
    cb(null, true);
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: fileSize * 1024 * 1024 },
  });
};

export default localUpload;
