const express = require("express");
const { UserModel } = require("../model/userModel");
const bcrpyt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PassCheck } = require("../middleware/validate");
const { BListModel } = require("../model/blackList");
const { auth } = require("../middleware/auth");
const UserRouter = express.Router();
// user routes (GET, POST, PATCH, DELETE) => /routes/User.routes.js

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: "The auto generated id of the user"
 *         username:
 *           type: string
 *           description: "The Username"
 *         email:
 *           type: string
 *           description: "The user email"
 *         password:
 *           type: string
 *           description: "The hashed password"
 */

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: All the API routes related to User
 */


/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pass:
 *                 type: string
 *               email:
 *                 type: string
 *             example:
 *               pass: mypassword
 *               email: example@example.com
 *     responses:
 *       200:
 *         description: Successful registration
 *         content:
 *           application/json:
 *             example:
 *               msg: New User has been Registered
 *               user:
 *                 id: 1234567890
 *                 username: exampleUser
 *                 email: example@example.com
 */

UserRouter.post("/register", PassCheck, async (req, res) => {
  const { pass, email } = req.body;
  const user = await UserModel.findOne({ email });

  if (user) {
    res.json("Already have Account");
  } else {
    try {
      bcrpyt.hash(pass, 5, async (err, hash) => {
        if (err) {
          res.send(err);
        } else {
          const NewUser = new UserModel({ ...req.body, pass: hash });
          await NewUser.save();
          res.send({ msg: "New User has been Registered", NewUser });
        }
      });
    } catch (error) {
      res.send(error);
    }
  }
});


/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Authenticate and log in a user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               pass:
 *                 type: string
 *             example:
 *               email: example@example.com
 *               pass: mypassword
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             example:
 *               msg: Login Successful
 *               token: eyJhbGciOiJIUzI1NiIsIn...
 *               username: exampleUser
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             example:
 *               msg: Wrong Credentials
 */

UserRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    const username = user.username;
    if (user) {
      bcrpyt.compare(pass, user.pass, async (err, result) => {
        if (result) {
          const token = jwt.sign(
            { userId: user._id, user: user.username },
            "masai",
            { expiresIn: "2d" }
          );
          res.send({ msg: "Login Successfull", token, username });
          setTimeout(async () => {
            const Blist = new BListModel({ token });
            await Blist.save();
          }, 1000 * 60 * 10);
        } else {
          res.send({ msg: "Wrong Credentials" });
        }
      });
    } else {
      res.send({ msg: "Wrong Credentials" });
    }
  } catch (error) {
    res.send(error);
  }
});

/**
 * @swagger
 * /users/logout:
 *   get:
 *     summary: Log out a user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful logout
 *         content:
 *           text/plain:
 *             example: Logged out Successfully
 *       401:
 *         description: Unauthorized or token not provided
 *         content:
 *           text/plain:
 *             example: Token is undefined
 */


UserRouter.get("/logout", auth, async (req, res) => {
  const { token } = req.headers.authorization?.split(" ")[1];

  try {
    if (token) {
      const Blist = new BListModel({ token });
      await Blist.save();
      res.send("Logged out Successfully");
    } else {
      res.send("Token is undefined");
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = {
  UserRouter,
};
