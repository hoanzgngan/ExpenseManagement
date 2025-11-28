const router = require("express").Router();
const ctrl = require("../controllers/categoryCtrl");

router.get("/", ctrl.getAll);

module.exports = router;
