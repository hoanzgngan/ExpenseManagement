const router = require("express").Router();
const ctrl = require("../controllers/categoryCtrl");
const auth = require("../middlewares/authMiddleware");


router.get("/", auth, ctrl.getAll);
router.post("/", auth, ctrl.create);
router.delete("/:id", auth, ctrl.delete);

module.exports = router;


//DONE