const router = require("express").Router();
const ctrl = require("../controllers/budgetCtrl");

router.get("/", ctrl.getAll);

module.exports = router;
