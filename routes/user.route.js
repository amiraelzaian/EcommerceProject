const express = require("express");
const {
  createUser,
  getUser,
  deleteUser,
  updateUser,
  getUsers,
  resizeUserImage,
  uploadUserImage,
} = require("../controllers/user.controller");
const { createUserValidator } = require("../utils/validators/userValidator");
const router = express.Router();

router
  .route("/")
  .post(uploadUserImage, resizeUserImage, createUserValidator, createUser)
  .get(getUsers);
router
  .route("/:id")
  .get(getUser)
  .patch(uploadUserImage, resizeUserImage, updateUser)
  .delete(deleteUser);

module.exports = router;
