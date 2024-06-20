const router = require("express").Router();
const price = require("../../controller/product/price.controller");

router.post("/", price.create);
router.get("/", price.getPriceAll);
router.get("/:id", price.getPriceById);
router.get("/detail/:detailid", price.getPriceByDetailId);
router.put("/:id", price.updatePrice);
router.delete("/:id", price.deletePrice);

module.exports = router;