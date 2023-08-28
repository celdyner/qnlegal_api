const router = require("express").Router();
const {ensureAuthenticated, ensureAuthorized} = require("../middleware/auth-middleware");
const { register } = require("../controllers/auth-controller");

const {getAll, getOne} = require("../controllers/admin-controller");

router.get("/users", ensureAuthenticated, ensureAuthorized(["admin"]), 
async(req,res) =>{
    await getAll(req, res);
});

router.get("/users:id", ensureAuthenticated, ensureAuthorized(["admin"]), 
async(req,res) =>{
    await getOne(req, res);
});


router.get("/seed", async(req,res) =>{
    const admin = {
        name: "Administrator",
        email:"h.oranekwulu@gmail.com",
        password: "Password123"
    };

    await register(admin, "admin", res);
});

module.exports = router;