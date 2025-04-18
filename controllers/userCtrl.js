const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("./sendMail");

const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const fetch = require("node-fetch");

const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID);

const { CLIENT_URL } = process.env;

const userCtrl = {
  // api/auth/register
  register: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Please enter all fields 😢" });
      }
      if (!validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email" });
      }

      const user = await Users.findOne({ email });
      if (user)
        return res
          .status(400)
          .json({ message: "This email already exists 😢" });

      if (password.length < 6)
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters 😢" });

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = {
        name,
        email,
        password: passwordHash,
      };
      const activation_token = createActivationToken(newUser);

      const url = `${CLIENT_URL}/api/auth/activate/${activation_token}`;
      const message = `<div style="max-width: 700px; margin:auto; border: 10px solid gray; padding: 50px 20px; font-size: 110%;">
      <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to Booking App.</h2>
      <p>Congratulations! You're about to start using BOOKING APP.
       Just click the button below to verify your email address.
      </p>

      <a href=${url} style="background: #333; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">Verify Email Address</a>

      <p>If the button doesn't work for any reason, you can also click on the link below:</p>

      <div>${url}</div>
      </div>`;

      // send email via /api/auth/activate/${activation_token}
      await sendMail({
        email: newUser.email,
        subject: "Booking App Password Recovery",
        message,
      });

      res.status(200).json({
        message: "Registration successful! Please check your email to activate",
      });
    } catch (err) {
      next(err);
    }
  },
  activateEMail: async (req, res, next) => {
    try {
      const { activation_token } = req.body;
      // Decode token to verify if it's valid
      const user = jwt.verify(
        activation_token,
        process.env.ACTIVATION_TOKEN_SECRET
      );
      const { name, email, password } = user;

      const check = await Users.findOne({ email });
      if (check)
        return res.status(400).json({ message: "Email already exists. 😢" });

      const newUser = new Users({
        name,
        email,
        password,
      });

      await newUser.save();

      res.status(201).json({
        message: "Account has been activated 😇",
      });
    } catch (err) {
      next(err);
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const formatedEmail = String(email).trim().toLowerCase();
      if (!formatedEmail || !password)
        return res
          .status(400)
          .json({ message: "Please enter email or password 😢" });

      const user = await Users.findOne({ email: formatedEmail });
      if (!user)
        return res.status(400).json({ message: "Email does not exist 😢!" });

      // compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Password is incorrect 😢!" });

      // create access token
      const access_token = createAccessToken({ id: user._id });

      const refresh_token = createRefreshToken({ id: user._id });
      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/auth/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        token: access_token,
        message: "Login successful!",
        user,
      });
    } catch (err) {
      next(err);
    }
  },
  getAccessToken: (req, res, next) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token)
        return res.status(400).json({ message: "Please login now" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(400).json({ message: "Please login now" });

        const access_token = createAccessToken({ id: user.id });
        res.json({ access_token });
      });
    } catch (err) {
      next(err);
    }
  },

  forgotPassword: async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await Users.findOne({ email });
      if (!user)
        return res.status(400).json({ message: "Email does not exist" });

      const access_token = createAccessToken({ id: user._id });
      const url = `${CLIENT_URL}/api/auth/reset-password/${access_token}`;

      const message = `<div style="max-width: 700px; margin:auto; border: 10px solid gray; padding: 50px 20px; font-size: 110%;">
      <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to Booking App.</h2>
      <p>Congratulations! You're about to start using SHOPPING APP.
      Just click the button below to change your password.
      </p>

      <a href=${url} style="background: #333; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">Reset Password</a>
      <p>If the button doesn't work for any reason, you can also click on the link below:</p>

      <div>${url}</div>
      </div>`;
      await sendMail({
        email: user.email,
        subject: "Booking App Password Recovery",
        message,
      });
      res.json({
        message: "Password reset link sent, please check your email.",
      });
    } catch (err) {
      next(err);
    }
  },
  resetPassword: async (req, res, next) => {
    try {
      const { password } = req.body;
      const passwordHash = await bcrypt.hash(password, 10);

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          password: passwordHash,
        }
      );
      res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
      next(err);
    }
  },
  getUserInfor: async (req, res, next) => {
    try {
      const user = await Users.findById(req.user.id).select("-password");

      res.json({ user });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  getUsersAllInfor: async (req, res, next) => {
    try {
      const users = await Users.find().select("-password");

      res.json(users);
    } catch (err) {
      next(err);
    }
  },
  logout: async (req, res, next) => {
    try {
      res.clearCookie("refreshtoken", { path: "/api/auth/refresh_token" });
      res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
      next(err);
    }
  },
  updateUser: async (req, res, next) => {
    try {
      const { name, avatar } = req.body;
      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          name,
          avatar,
        },
        { new: true }
      );

      res.status(200).json({ message: "Information updated successfully!" });
    } catch (err) {
      next(err);
    }
  },
  updateUsersRole: async (req, res, next) => {
    try {
      const { role } = req.body;

      await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          role,
        }
      );

      res.status(200).json({ message: "Information updated successfully!" });
    } catch (err) {
      next(err);
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      await Users.findByIdAndDelete(req.params.id);

      res.status(200).json({ message: "User deleted successfully!" });
    } catch (err) {
      next(err);
    }
  },
  googleLogin: async (req, res, next) => {
    try {
      const { tokenId } = req.body;

      const verify = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.MAILING_SERVICE_CLIENT_ID,
      });

      const { email_verified, email, name, picture } = verify.payload;

      const password = email + process.env.GOOGLE_SECRET;

      const passwordHash = await bcrypt.hash(password, 10);

      if (!email_verified)
        return res.status(400).json({ message: "Email verification failed." });

      const user = await Users.findOne({ email });

      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return res.status(400).json({ message: "Password is incorrect." });

        const refresh_token = createRefreshToken({ id: user._id });
        res.cookie("refreshtoken", refresh_token, {
          httpOnly: true,
          path: "/api/auth/refresh_token",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ message: "Login success!" });
      } else {
        const newUser = new Users({
          name,
          email,
          password: passwordHash,
          avatar: picture,
        });

        await newUser.save();

        const refresh_token = createRefreshToken({ id: newUser._id });
        res.cookie("refreshtoken", refresh_token, {
          httpOnly: true,
          path: "/api/auth/refresh_token",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ message: "Login success!" });
      }
    } catch (err) {
      next(err);
    }
  },
  facebookLogin: async (req, res, next) => {
    try {
      const { accessToken, userID } = req.body;

      const URL = `https://graph.facebook.com/v2.9/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`;

      const data = await fetch(URL)
        .then((res) => res.json())
        .then((res) => {
          return res;
        });

      const { email, name, picture } = data;

      const password = email + process.env.FACEBOOK_SECRET;

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await Users.findOne({ email });

      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return res.status(400).json({ message: "Password is incorrect." });

        // Create access token to return to client
        const access_token = createAccessToken({ id: user._id });

        const refresh_token = createRefreshToken({ id: user._id });
        res.cookie("refreshtoken", refresh_token, {
          httpOnly: true,
          path: "/api/auth/refresh_token",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Fix this line to return both token and user info
        res.status(200).json({
          message: "Login successful!",
          token: access_token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
          },
        });
      } else {
        const newUser = new Users({
          name,
          email,
          password: passwordHash,
          avatar: picture.data.url,
        });

        await newUser.save();

        // Create access token for new user
        const access_token = createAccessToken({ id: newUser._id });

        const refresh_token = createRefreshToken({ id: newUser._id });
        res.cookie("refreshtoken", refresh_token, {
          httpOnly: true,
          path: "/api/auth/refresh_token",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Return complete information for new user
        res.status(200).json({
          message: "Login success!",
          token: access_token,
          user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            avatar: newUser.avatar,
          },
        });
      }
    } catch (err) {
      next(err);
    }
  },
};

function validateEmail(email) {
  const res =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return res.test(String(email).toLowerCase());
}

// token to activate account
const createActivationToken = (payload) => {
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
    expiresIn: "5m",
  });
};

// access token
const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

// token to maintain account
const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = userCtrl;
