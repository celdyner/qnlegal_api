const router = require("express").Router();
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const {
  ensureAuthenticated,
  ensureAuthorized,
} = require("../middleware/auth-middleware");
const { validationRules, validate } = require("../validations/story-validator");
const {
  addOne,
  removeOne,
  updateOne,
  getAll,
  getTopStories,
  getOneBySlug,
  getOne,
} = require("../controllers/stories-controller");

router.get("/stories", async (req, res) => {
  await getAll(req, res);
});

router.post("/stories", upload.single("image"), async (req, res) => {
  await addOne(req, res);
});

router.put(
  "/stories/:id",
  // ensureAuthenticated,
  // ensureAuthorized(["admin"]),
  // validationRules(),
  // validate,
  async (req, res) => {
    await updateOne(req, res);
  }
);

router.get("/stories/:id", async (req, res) => {
  await getOne(req, res);
});

router.delete(
  "/stories/:id",
  // ensureAuthenticated,
  // ensureAuthorized(["admin"]),
  async (req, res) => {
    await removeOne(req, res);
  }
);

router.get("/stories/trending", async (req, res) => {
  await getTopStories(req, res);
});

router.get("/stories/slug/:slug", async (req, res) => {
  await getOneBySlug(req, res);
});

module.exports = router;

//ensureAuthenticated,  ensureAuthorized(["admin"]), validationRules(), validate,
