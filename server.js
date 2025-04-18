require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const { errorHandler } = require("./errorHandler");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(fileUpload({ useTempFiles: true }));

mongoose.connect(
  process.env.MONGODB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.error("Can not to mongodb!");
      console.error(err);
    } else {
      console.log("Connected to MongoDB!");
    }
  }
);

// Routes
app.use("/api/auth", require("./router/userRouter"));
app.use("/api", require("./router/roomRouter"));
app.use("/api", require("./router/bookingRouter"));
app.use("/api", require("./router/upload"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

app.use(errorHandler);

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Sever is running port at`, PORT);
});
