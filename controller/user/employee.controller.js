const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const { Employee, validate } = require("../../model/user/employee.model");

module.exports.create = async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message, status: false });
		const user = await Employee.findOne({
			tel: req.body.tel,
		});
		if (user)
			return res.status(409).send({ status: false, message: "มีชื่อผู้ใช้งานนี้ในระบบเเล้ว" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		const data = {
			...req.body,
			password: hashPassword,
			timestamp: dayjs(Date.now()).format(""),
		};
		const new_employee = new Employee(data);
		if (!new_employee)
			return res.status(403).send({ status: false, message: "มีบางอย่างผิดพลาด" });
		new_employee.save();
		return res.status(201).send({ message: "เพิ่มพนักงานสำเร็จ", status: true, data: new_employee });
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.getEmployeeAll = async (req, res) => {
	try {
		const employee = await Employee.find();
		if (!employee)
			return res.status(403).send({ status: false, message: 'ดึงข้อมูลพนักงานไม่สำเร็จ' })
		return res.status(200).send({ status: true, message: 'ดึงข้อมูลพนักงานสำเร็จ', data: employee })
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.getEmployeeById = async (req, res) => {
	try {
		const id = req.params.id;
		const employee = await Employee.findOne({ _id: id });
		if (!employee)
			return res.status(403).send({ status: false, message: 'ดึงข้อมูลพนักงานไม่สำเร็จ' })
		return res.status(200).send({ status: true, message: 'ดึงข้อมูลพนักงานสำเร็จ', data: employee })
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.updateEmployee = async (req, res) => {
	try {
		if (!req.body) {
			return res.status(400).send({ message: "ส่งข้อมูลผิดพลาด" });
		}
		const id = req.params.id;
		if (!req.body.password) {
			const employee = await Employee.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
			if (!employee)
				return res.status(403).send({ status: false, message: 'แก้ไขข้อมูลไม่สำเร็จ' })
			return res.status(200).send({ status: true, message: 'แก้ไขข้อมูลสำเร็จ' })
		} else {
			const salt = await bcrypt.genSalt(Number(process.env.SALT));
			const hashPassword = await bcrypt.hash(req.body.password, salt);
			const employee = await Employee.findByIdAndUpdate(id, { ...req.body, password: hashPassword }, { useFindAndModify: false });
			if (!employee)
				return res.status(403).send({ status: false, message: 'แก้ไขข้อมูลไม่สำเร็จ' })
			return res.status(200).send({ status: true, message: 'แก้ไขข้อมูลสำเร็จ' })
		}
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.deleteEmployee = async (req, res) => {
	try {
		const id = req.params.id;
		const employee = await Employee.findByIdAndDelete(id, { useFindAndModify: false });
		if (!employee)
			return res.status(403).send({ status: false, message: 'ลบข้อมูลพนักงานไม่สำเร็จ' })
		return res.status(200).send({ status: true, message: 'ลบข้อมูลพนักงานสำเร็จ' })
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" });
	}
};