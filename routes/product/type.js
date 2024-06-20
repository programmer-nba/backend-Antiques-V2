const router = require("express").Router();
const type = require("../../controller/product/type.controller");

router.post("/", type.create);
router.get("/", type.getTypeAll);
router.get("/:id", type.getTypeById);
router.get("/cate/:cateid", type.getTypeByCateId);
router.put("/:id", type.updateType);
router.delete("/:id", type.deleteType);

module.exports = router;