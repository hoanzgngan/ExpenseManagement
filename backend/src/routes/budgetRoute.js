const router = require("express").Router();
const ctrl = require("../controllers/budgetCtrl");
const auth = require("../middlewares/authMiddleware");

router.get("/", auth, ctrl.getByMonth);
router.post("/", auth, ctrl.upsert);
router.delete("/:id", auth, ctrl.delete);

module.exports = router;


//done