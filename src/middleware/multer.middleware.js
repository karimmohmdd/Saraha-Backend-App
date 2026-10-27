import localUpload from "../common/utils/multer/multer.config";
import {
  processFields,
  processFile,
  processFiles,
} from "../common/utils/multer/multer.service";

export async function checkFileContent({
  req,
  acceptedFileTypes = [],
  folderName,
}) {
  if (req.file) {
    await processFile({ file: req.file, acceptedFileTypes, folderName });
  } else if (Array.isArray(req.files)) {
    await processFiles({ files: req.files, acceptedFileTypes, folderName });
  } else if (typeof req.files === "object") {
    await processFields({ fields: req.files, acceptedFileTypes, folderName });
  }
}

export function handelFileMiddleware({
  multerMiddleware,
  folderName,
  acceptedFileTypes,
} = {}) {
  return async (req, res, next) => {
    const customNext = async (error) => {
      if (error) {
        next(error);
        return;
      }

      try {
        await checkFileContent({
          req,
          folderName,
          acceptedFileTypes,
        });
        next();
      } catch (error) {
        next(error);
      }
    };

    return multerMiddleware(req, res, customNext);
  };
}
