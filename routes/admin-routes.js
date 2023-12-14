const router = require("express").Router();
const { getAuthResults } = require("../middleware/auth-middleware");
const { register } = require("../controllers/auth-controller");
const User = require("../models/user");

const { getAll, getOne } = require("../controllers/admin-controller");

router.get("/admins", getAuthResults, async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" });
    return res.status(200).json({ admins: admins });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
});

router.get("/users", getAuthResults, async (req, res) => {
  await getAll(req, res);
});

router.get("/users:id", getAuthResults, async (req, res) => {
  await getOne(req, res);
});

router.delete("/admins/:id", getAuthResults, async (req, res) => {
  if (req.role !== "Administrator") {
    return res.status(404).json({
      message: "Not authorized",
      success: false,
    });
  }
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        message: "Item not found",
        success: false,
      });
    }
    return res.status(204).json({
      message: "Item successfully deleted",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
});

// router.get("/seed", async (req, res) => {
//   const admin = {
//     name: "Administrator",
//     email: "h.oranekwulu@gmail.com",
//     password: "Password123",
//   };

//   await register(admin, "admin", res);
// });

module.exports = router;
