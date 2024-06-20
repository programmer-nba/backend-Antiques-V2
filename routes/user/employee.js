const router = require("express").Router();
const employee = require("../../controller/user/employee.controller");

router.post("/", employee.create);
router.get("/", employee.getEmployeeAll);
router.get("/:id", employee.getEmployeeById);
router.put("/:id", employee.updateEmployee);
router.delete("/:id", employee.deleteEmployee);

module.exports = router;