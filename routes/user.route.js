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
  .patch(protect,changeUserPasswordValidator, changeUserPassword);

router
  .route("/")
  .post(protect,uploadUserImage, resizeUserImage, createUserValidator, createUser)
  .get(protect,getUsers);
router
  .route("/:id")
  .get(protect,getUser)
  .patch(protect,uploadUserImage, resizeUserImage, updateUser)
  .delete(protect,deleteUser);

module.exports = router;
