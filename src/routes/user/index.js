const express = require("express");
const UserRepo = require("../../database/repository/UserRepo");

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const users = await UserRepo.findAll();
    res.status(200).json({ users });
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await UserRepo.findById(req.params.id);
    res.status(200).json({ user });
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await UserRepo.remove(req.params.id);
    res.status(200).json({ msg: "User deleted successfully!" });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
