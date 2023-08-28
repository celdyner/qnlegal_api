const router = require("express").Router();
const {ensureAuthenticated, ensureAuthorized} = require("../middleware/auth-middleware");
const {validationRules, validate} = require("../validations/video-validator");
const {  
    addOne,
    removeOne,
    updateOne,
    getAll,
    getTopVideos,
    getOneBySlug,
    getOne
    } = require("../controllers/video-controller");



router.get("/videos", async(req,res) =>{
    await getAll(req, res);
});

router.post("/videos",  ensureAuthenticated, ensureAuthorized(["admin"]), validationRules(), validate,
async(req,res) =>{
    await addOne(req, res);
});


router.put("/videos/:id",  ensureAuthenticated,ensureAuthorized(["admin"]), validationRules(), validate,
async(req,res) =>{
    await updateOne(req, res);
});


router.get("/videos/:id", async(req,res) =>{
    await getOne(req, res);
});


router.delete("/videos/:id", ensureAuthenticated, ensureAuthorized(["admin"]), 
async(req,res) =>{
    await removeOne(req, res);
});




router.get("/videos/trending", async(req,res) =>{
    await   getTopVideos(req, res);
});


router.get("/videos/slug/:slug", async(req,res) =>{
    await getOneBySlug(req, res);
});



module.exports = router;