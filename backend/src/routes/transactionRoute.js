const router = require("express").Router();
const ctrl = require("../controllers/transactionCtrl");
const auth = require("../middlewares/authMiddleware");

router.get("/", auth, ctrl.getAll);
router.post("/", auth, ctrl.create);
router.delete("/:id", auth, ctrl.delete);
router.put("/:id", auth, ctrl.update);

module.exports = router;
