const router = require("express").Router();
const detail = require("../../controller/product/detail.controller");

router.post("/", detail.create);
router.get("/", detail.getDetailAll);
router.get("/:id", detail.getDetailById);
router.get("/type/:typeid", detail.getDetailByTypeId);
router.put("/:id", detail.updateDetail);
router.delete("/:id", detail.deleteDetail);

module.exports = router;