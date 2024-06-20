const router = require("express").Router();
const order = require("../../controller/pos/order.controller");

router.post("/", order.create);
router.get("/", order.getOrderAll);
router.get("/wait", order.getOrderWait);
router.get("/cancel", order.getOrderCancel);
router.get("/:id", order.getOrderById);
router.post("/payment/:id", order.paymentOrder);
router.post("/cancel/:id", order.cancelOrder);

module.exports = router;