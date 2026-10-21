export const successResponse = ({ res, data, msg = "done", statusCode = 200 }) => {
  return res.status(statusCode).json({ status: "success", msg, data });
};
