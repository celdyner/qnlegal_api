const router = require("express").Router();
const { getAuthResults } = require("../middleware/auth-middleware");
const {
  validationRules,
  validate,
} = require("../validations/comment-validator");
const {
  addOne,
  removeOne,
  updateOne,
} = require("../controllers/comments-controller");

router.post("/comments", getAuthResults, async (req, res) => {
  await addOne(req, res);
});

router.put("/comments/:id", async (req, res) => {
  await updateOne(req, res);
});

router.delete("/comments/:id", async (req, res) => {
  await removeOne(req, res);
});

module.exports = router;
