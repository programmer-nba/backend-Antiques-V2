const router = require("express").Router();
const customer = require("../../controller/user/customer.controller");

router.post("/", customer.create);
router.get("/", customer.getCustomerAll);
router.get("/:id", customer.getCustomerById);
router.put("/:id", customer.updateCustomer);
router.delete("/:id", customer.deleteCustomer);

module.exports = router;