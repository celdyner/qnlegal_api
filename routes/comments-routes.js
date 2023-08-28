const router = require("express").Router();
const {ensureAuthenticated} = require("../middleware/auth-middleware");
const {validationRules, validate }  = require("../validations/comment-validator");
const {  
    addOne,
    removeOne,
    updateOne,
    } = require("../controllers/comments-controller");



router.post("/comments",ensureAuthenticated, validationRules(), validate,async(req,res) =>{
    await addOne(req, res);
});


router.put("/comments/:id",ensureAuthenticated, async(req,res) =>{
    await updateOne(req, res);
});


router.delete("/comments/:id", ensureAuthenticated, async(req,res) =>{

    await removeOne(req, res);
});



module.exports = router;