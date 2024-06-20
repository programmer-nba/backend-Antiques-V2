const router = require("express").Router();
const category = require("../../controller/product/category.controller");

router.post("/", category.create);
router.get("/", category.getCategoryAll);
router.get("/:id", category.getCategoryById);
router.put("/:id", category.updateCategory);
router.delete("/:id", category.deleteCategory);

module.exports = router;