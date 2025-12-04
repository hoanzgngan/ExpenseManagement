const router = require("express").Router();
const ctrl = require("../controllers/warningCtrl");
const auth = require("../middlewares/authMiddleware");

router.get("/", auth, ctrl.check);

module.exports = router;


//done