const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { uploadVideoHandler } = require("../cloudinary");
const { getAuthResults } = require("../middleware/auth-middleware");
const { validationRules, validate } = require("../validations/video-validator");
const {
  addOne,
  removeOne,
  updateOne,
  getAll,
  getTopVideos,
  getOneBySlug,
  getOne,
} = require("../controllers/video-controller");

router.get("/videos", async (req, res) => {
  await getAll(req, res);
});

router.post(
  "/videos",
  getAuthResults,
  upload.single("video"),
  async (req, res) => {
    try {
      const video = await uploadVideoHandler(req.file.path);
      req.body.videoUrl = video.secure_url;
      req.body.videoName = video.original_filename;
      await addOne(req, res);
    } catch (err) {
      return err;
    }
  }
);

router.put("/videos/:id", getAuthResults, async (req, res) => {
  await updateOne(req, res);
});

router.get("/videos/:id", async (req, res) => {
  await getOne(req, res);
});

router.delete("/videos/:id", getAuthResults, async (req, res) => {
  await removeOne(req, res);
});

router.get("/videos/trending", async (req, res) => {
  await getTopVideos(req, res);
});

router.get("/videos/slug/:slug", async (req, res) => {
  await getOneBySlug(req, res);
});

module.exports = router;
