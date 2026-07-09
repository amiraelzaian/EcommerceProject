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
const { allowedTo, protect } = require("../controllers/auth.controller");

router
  .route("/changepassword/:id")
  .patch(protect, changeUserPasswordValidator, changeUserPassword);

router
  .route("/")
  .post(
    protect,
    allowedTo("admin"),
    uploadUserImage,
    resizeUserImage,
    createUserValidator,
    createUser,
  )
  .get(protect, getUsers);
router
  .route("/:id")
  .get(protect, getUser)
  .patch(
    protect,
    allowedTo("admin"),
    uploadUserImage,
    resizeUserImage,
    updateUser,
  )
  .delete(protect, allowedTo("admin"), deleteUser);

module.exports = router;
