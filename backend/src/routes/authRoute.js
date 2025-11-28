const router = require("express").Router();
const ctrl = require("../controllers/authCtrl");

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);

module.exports = router;
