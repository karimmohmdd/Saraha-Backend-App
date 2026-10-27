import { readFile } from "fs/promises";
import { resolve } from "path";
import { fileTypeFromBuffer } from "file-type";
import { BadRequestException } from "../../exceptions/app.exceptions.js";

export function processFile(acceptedFileTypes = []) {
  return async (req, res, next) => {
    const filePath = req.file.path;

    const fileBuffer = await readFile(resolve(filePath));

    const actualFileType = await fileTypeFromBuffer(fileBuffer);

    if (!actualFileType || !acceptedFileTypes.includes(actualFileType.mime)) {
      throw BadRequestException({ errMsg: "Invalid Actual File Format" });
    }

    next();
  };
}
