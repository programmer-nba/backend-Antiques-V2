const router = require("express").Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { Admin } = require("../model/user/admin.model");
const { Employee } = require("../model/user/employee.model");

const validate = (data) => {
	const schema = Joi.object({
		username: Joi.string().required().label("username"),
		password: Joi.string().required().label("password"),
	})
	return schema.validate(data);
};

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });
		const admin = await Admin.findOne({
			admin_username: req.body.username
		});
		if (!admin) {
			await checkEmployee(req, res);
		} else {
			const validatePassword = await bcrypt.compare(
				req.body.password, admin.admin_password
			);
			if (!validatePassword)
				return res.status(401).send({ status: false, message: 'รหัสผ่านไม่ตรงกัน' });
			const token = admin.generateAuthToken();
			return res.status(200).send({
				token: token,
				message: "เข้าสู่ระบบสำเร็จ",
				level: "admin",
				status: true,
			});
		}
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" });
	}
});

const checkEmployee = async (req, res) => {
	try {
		const employee = await Employee.findOne({
			tel: req.body.username,
		});
		if (!employee) {
			return res.status(401).send({ message: "ไม่พบข้อมูลผู้ใช้งาน", status: false, });
		} else {
			const validatePassword = await bcrypt.compare(
				req.body.password, employee.password
			);
			if (!validatePassword)
				return res.status(401).send({ status: false, message: 'รหัสผ่านไม่ตรงกัน' });
			const token = employee.generateAuthToken();
			return res.status(200).send({
				token: token,
				message: "เข้าสู่ระบบสำเร็จ",
				level: "employee",
				status: true,
			});
		}
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" });
	}
}

module.exports = router;