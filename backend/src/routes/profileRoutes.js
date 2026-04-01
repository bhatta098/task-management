const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  listProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/profileController");

router.use(authMiddleware);

router.get("/", listProfiles);
router.post("/", createProfile);
router.put("/:id", updateProfile);
router.delete("/:id", deleteProfile);

module.exports = router;
