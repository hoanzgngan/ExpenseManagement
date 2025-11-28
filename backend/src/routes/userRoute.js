const router = require("express").Router();
const ctrl = require("../controllers/userCtrl");

router.get("/", ctrl.getAll);

module.exports = router;
