const bcrypt = require("bcrypt");
const { Admin, validate } = require("../../model/user/admin.model");
const dayjs = require("dayjs");

module.exports.create = async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message, status: false });
		const user = await Admin.findOne({
			admin_username: req.body.admin_username,
		});
		if (user)
			return res.status(409).send({ status: false, message: "มีชื่อผู้ใช้งานนี้ในระบบเเล้ว" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.admin_password, salt);

		const data = {
			...req.body,
			admin_password: hashPassword,
			admin_date_start: dayjs(Date.now()).format(""),
		};
		const new_admin = new Admin(data);
		if (!new_admin)
			return res.status(403).send({ status: false, message: "มีบางอย่างผิดพลาด" });
		new_admin.save();
		return res.status(201).send({ message: "เพิ่มแอดมินสำเร็จ", status: true, data: new_admin });
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.getAdminAll = async (req, res) => {
	try {
		const admin = await Admin.find();
		if (!admin)
			return res.status(403).send({ status: false, message: 'ดึงข้อมูลไม่สำเร็จ' })
		return res.status(200).send({ status: true, message: 'ดึงข้อมูลแอดมินสำเร็จ', data: admin })
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.getAdminById = async (req, res) => {
	try {
		const id = req.params.id;
		const admin = await Admin.findOne({ _id: id });
		if (!admin)
			return res.status(403).send({ status: false, message: 'ดึงข้อมูลไม่สำเร็จ' })
		return res.status(200).send({ status: true, message: 'ดึงข้อมูลแอดมินสำเร็จ', data: admin })
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.updateAdmin = async (req, res) => {
	try {
		if (!req.body) {
			return res.status(400).send({ message: "ส่งข้อมูลผิดพลาด" });
		}
		const id = req.params.id;
		if (!req.body.admin_password) {
			const admin = await Admin.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
			if (!admin)
				return res.status(403).send({ status: false, message: 'แก้ไขข้อมูลไม่สำเร็จ' })
			return res.status(200).send({ status: true, message: 'แก้ไขข้อมูลสำเร็จ' })
		} else {
			const salt = await bcrypt.genSalt(Number(process.env.SALT));
			const hashPassword = await bcrypt.hash(req.body.admin_password, salt);

			const admin = await Admin.findByIdAndUpdate(id, { ...req.body, admin_password: hashPassword }, { useFindAndModify: false });
			if (!admin)
				return res.status(403).send({ status: false, message: 'แก้ไขข้อมูลไม่สำเร็จ' })
			return res.status(200).send({ status: true, message: 'แก้ไขข้อมูลสำเร็จ' })
		}
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.deleteAdmin = async (req, res) => {
	try {
		const id = req.params.id;
		const admin = await Admin.findByIdAndDelete(id, { useFindAndModify: false });
		if (!admin)
			return res.status(403).send({ status: false, message: 'ลบข้อมูลแอดมินไม่สำเร็จ' })
		return res.status(200).send({ status: true, message: 'ลบข้อมูลแอดมินสำเร็จ' })
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" });
	}
};