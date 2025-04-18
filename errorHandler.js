exports.errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (err.code === 11000) {
    err.statusCode = 400;
    for (let p in err.keyValue) {
      err.message = `${p} have to be unique`;
    }
  }

  if (err.kind === "ObjectId") {
    err.statusCode = 404;
    err.message = `The ${req.originalUrl} is not found because of wrong ID`;
  }

  if (err.errors) {
    err.statusCode = 400;
    err.message = [];
    for (let p in err.errors) {
      err.message.push(err.errors[p].properties.message);
    }
  }

  if (err.name === "ValidationError") {
    err.statusCode = 400;
    err.message = Object.values(err.errors).map((value) => value.message);
  }

  res.status(err.statusCode).json({
    status: false,
    message: err.message,
  });
};
