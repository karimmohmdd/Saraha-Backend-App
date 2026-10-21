function notFoundMiddleware(req, res) {
  res.status(404).json({ msg: `INVALID URL ${req.url} OR METHOD` });
}

export default notFoundMiddleware;
