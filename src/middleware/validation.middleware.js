import { BadRequestException } from "../common/exceptions/app.exceptions.js";

function validation(schema) {
  return function (req, res, next) {
    const validateData = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!validateData.success) {
      throw BadRequestException({
        errMsg: "Validation Failed",
        cause: {
          issues: validateData.error.issues,
        },
      });
    }

    req.validateData = validateData.data;

    next();
  };
}

export default validation;
