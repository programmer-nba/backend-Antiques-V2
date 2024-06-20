const { Type } = require("../../model/product/type.model");

module.exports.create = async (req, res) => {
	try {
		const type = await Type.findOne({
			name: req.body.name,
		});
		if (type)
			return res.status(409).send({ status: false, message: "มีชนิดสินค้านี้ในระบบแล้ว" });
		const data = {
			...req.body,
		};
		const new_type = new Type(data);
		if (!new_type)
			return res.status(403).send({ status: false, message: "มีบางอย่างผิดพลาด" });
		new_type.save();
		return res.status(201).send({ message: "เพิ่มชนิดสินค้านี้ในระบบแล้ว", status: true, data: new_type });
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.getTypeAll = async (req, res) => {
	try {
		const type = await Type.find();
		if (!type)
			return res.status(403).send({ status: false, message: 'ดึงข้อมูลไม่สำเร็จ' })
		return res.status(200).send({ status: true, message: 'ดึงข้อมูลชนิดสำเร็จ', data: type })
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.getTypeById = async (req, res) => {
	try {
		const id = req.params.id;
		const type = await Type.findOne({ _id: id });
		if (!type)
			return res.status(403).send({ status: false, message: 'ดึงข้อมูลไม่สำเร็จ' })
		return res.status(200).send({ status: true, message: 'ดึงข้อมูลชนิดสำเร็จ', data: type })
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.getTypeByCateId = async (req, res) => {
	try {
		const id = req.params.cateid;
		const pipeline = [
			{
				$match: { "cate_id": id },
			}
		];
		const type = await Type.aggregate(pipeline);
		if (!type)
			return res.status(403).send({ status: false, message: "ดึงข้อมูลไม่สำเร็จ" });
		return res.status(200).send({ status: true, message: "ดึงข้อมูลชนิดสำเร็จ", data: type });
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.updateType = async (req, res) => {
	try {
		if (!req.body) {
			return res.status(400).send({ message: "ส่งข้อมูลผิดพลาด" });
		}
		const id = req.params.id;
		const type = await Type.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
		if (!type)
			return res.status(403).send({ status: false, message: 'แก้ไขข้อมูลไม่สำเร็จ' })
		return res.status(200).send({ status: true, message: 'แก้ไขข้อมูลสำเร็จ' })
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.deleteType = async (req, res) => {
	try {
		const id = req.params.id;
		const type = await Type.findByIdAndDelete(id, { useFindAndModify: false });
		if (!type)
			return res.status(403).send({ status: false, message: 'ลบข้อมูลชนิดไม่สำเร็จ' })
		return res.status(200).send({ status: true, message: 'ลบข้อมูลชนิดสำเร็จ' })
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};