const express = require("express");
const {
  createUser,
  getUser,
  deleteUser,
  updateUser,
  getUsers,
  resizeUserImage,
  uploadUserImage,
  changeUserPassword,
} = require("../controllers/user.controller");
const {
  createUserValidator,
  changeUserPasswordValidator,
} = require("../utils/validators/userValidator");
const router = express.Router();

router
  .route("/changepassword/:id")
  .patch(changeUserPasswordValidator, changeUserPassword);

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
