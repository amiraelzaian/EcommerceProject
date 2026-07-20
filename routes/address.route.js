const express = require("express");
const {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,
} = require("../controllers/address.controller");
const { protect, allowedTo } = require("../controllers/auth.controller");
const router = express.Router();

router.use(protect, allowedTo("user"));

router.route("/").post(addAddress).get(getLoggedUserAddresses);

router.delete("/:addressId", removeAddress);

module.exports = router;
