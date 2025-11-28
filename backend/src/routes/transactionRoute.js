const router = require("express").Router();
const ctrl = require("../controllers/transactionCtrl");

router.get("/", ctrl.getAll);

module.exports = router;
