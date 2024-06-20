const router = require("express").Router();
const admin = require("../../controller/user/admin.controller");

router.post("/", admin.create);
router.get("/", admin.getAdminAll);
router.get("/:id", admin.getAdminById);
router.put("/:id", admin.updateAdmin);
router.delete("/:id", admin.deleteAdmin);

module.exports = router;