const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const complexityOptions = {
	min: 6,
	max: 30,
	lowerCase: 0,
	upperCase: 0,
	numeric: 0,
	symbol: 0,
	requirementCount: 2,
};

const EmployeeSchema = new mongoose.Schema({
	prefix: { type: String, required: true }, //คำนำหน้า
	fristname: { type: String, required: true }, //ชื่อ
	lastname: { type: String, required: true }, //นามสกุล
	tel: { type: String, required: true }, //เบอร์โทร
	password: { type: String, required: true }, //รหัสผ่าน
	position: {
		type: String,
		enum: ["Owner", "Cashier", "Employee"],
		required: true,
	},
	status: { type: Boolean, required: false, default: true },
	timestamp: { type: Date, required: false, default: Date.now() },
	employee: { type: String, required: false, default: "ไม่มี" },
});

EmployeeSchema.methods.generateAuthToken = function () {
	const token = jwt.sign(
		{ _id: this._id, name: this.name, row: "employee", tel: this.tel },
		process.env.JWTPRIVATEKEY, { expiresIn: '6h' }
	);
	return token;
};

const Employee = mongoose.model("employee", EmployeeSchema);

const validate = (data) => {
	const schema = Joi.object({
		prefix: Joi.string().required().label("กรุณากรอกชื่อ"),
		fristname: Joi.string().required().label("กรุณากรอกชื่อ"),
		lastname: Joi.string().required().label("กรุณากรอกนามสกุล"),
		tel: Joi.string().required().label("กรุณากรอกเบอร์โทร"),
		password: passwordComplexity(complexityOptions)
			.required()
			.label("ไม่มีข้อมูลรหัสผ่าน"),
		position: Joi.string().required().label("กรุณากรอกระดับพนักงาน"),
		employee: Joi.string().default("ไม่มี")
	});
	return schema.validate(data);
};

module.exports = { Employee, validate };