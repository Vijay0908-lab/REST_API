const express = require("express");
const { body, check } = require("express-validator");
const router = express.Router();
const authController = require("../controllers/auth");
const User = require("../model/user");

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-mail already exist");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  authController.signup,
);

router.post("/login", authController.login);

module.exports = router;
