const mongoose = require("mongoose");
const Joi = require("joi");

const CustomerSchema = new mongoose.Schema({
	prefix: { type: String, required: true }, //คำนำหน้า
	fristname: { type: String, required: true }, //ชื่อ
	lastname: { type: String, required: true }, //นามสกุล
	tel: { type: String, required: true }, //เบอร์โทร
	iden: { type: String, required: true }, //ปชช
	level: { type: String, required: false, default: "" }, //ระดับลูกค้า
	address: { type: String, required: true },
	subdistrict: { type: String, required: true },
	district: { type: String, required: true },
	province: { type: String, required: true },
	postcode: { type: String, required: true },
	vehicle_code: { type: String, required: false, default: "" },
	emp: { type: String, required: false, default: 'ไม่มี' },
	timestamp: { type: Date, required: false, default: Date.now() },
});

const Customer = mongoose.model("customer", CustomerSchema);

const validate = (data) => {
	const schema = Joi.object({
		prefix: Joi.string().required().label("กรุณากรอกชื่อ"),
		fristname: Joi.string().required().label("กรุณากรอกชื่อ"),
		lastname: Joi.string().required().label("กรุณากรอกนามสกุล"),
		tel: Joi.string().required().label("กรุณากรอกเบอร์โทร"),
		iden: Joi.string().required().label("กรุณากรอกเลขบัตรประชาชน"),
		level: Joi.string().default(""),
		address: Joi.string().required().label("กรุณากรอกที่อยู่"),
		subdistrict: Joi.string().required().label("กรุณากรอกตำบล"),
		district: Joi.string().required().label("กรุณากรอกอำเภอ"),
		province: Joi.string().required().label("กรุณากรอกจังหวัด"),
		postcode: Joi.string().required().label("กรุณากรอกรหัสไปรษณีย์"),
		vehicle_code: Joi.string().default(""),
	});
	return schema.validate(data);
};

module.exports = { Customer, validate };