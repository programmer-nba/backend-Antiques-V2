const { Detail } = require("../../model/product/detail.model");

module.exports.create = async (req, res) => {
	try {
		const detail = await Detail.findOne({
			name: req.body.name,
		});
		if (detail)
			return res.status(409).send({ status: false, message: "มีรายละเอียดสินค้านี้ในระบบแล้ว" });
		const data = {
			...req.body,
		};
		const new_detail = new Detail(data);
		if (!new_detail)
			return res.status(403).send({ status: false, message: "มีบางอย่างผิดพลาด" });
		new_detail.save();
		return res.status(201).send({ message: "เพิ่มรายละเอียดสินค้าสำเร็จ", status: true, data: new_detail });
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.getDetailAll = async (req, res) => {
	try {
		const detail = await Detail.find();
		if (!detail)
			return res.status(403).send({ status: false, message: 'ดึงข้อมูลไม่สำเร็จ' })
		return res.status(200).send({ status: true, message: 'ดึงข้อมูลรายละเอียดสำเร็จ', data: detail })
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.getDetailById = async (req, res) => {
	try {
		const id = req.params.id;
		const detail = await Detail.findOne({ _id: id });
		if (!detail)
			return res.status(403).send({ status: false, message: 'ดึงข้อมูลไม่สำเร็จ' })
		return res.status(200).send({ status: true, message: 'ดึงข้อมูลรายละเอียดสำเร็จ', data: detail })
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.getDetailByTypeId = async (req, res) => {
	try {
		const id = req.params.typeid;
		const pipeline = [
			{
				$match: { "type_id": id },
			}
		];
		const detail = await Detail.aggregate(pipeline);
		if (!detail)
			return res.status(403).send({ status: false, message: "ดึงข้อมูลไม่สำเร็จ" });
		return res.status(200).send({ status: true, message: "ดึงข้อมูลรายละเอียดสำเร็จ", data: detail });
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.updateDetail = async (req, res) => {
	try {
		if (!req.body) {
			return res.status(400).send({ message: "ส่งข้อมูลผิดพลาด" });
		}
		const id = req.params.id;
		const detail = await Detail.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
		if (!detail)
			return res.status(403).send({ status: false, message: 'แก้ไขข้อมูลไม่สำเร็จ' })
		return res.status(200).send({ status: true, message: 'แก้ไขข้อมูลสำเร็จ' })
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.deleteDetail = async (req, res) => {
	try {
		const id = req.params.id;
		const detail = await Detail.findByIdAndDelete(id, { useFindAndModify: false });
		if (!detail)
			return res.status(403).send({ status: false, message: 'ลบข้อมูลรายละเอียดไม่สำเร็จ' })
		return res.status(200).send({ status: true, message: 'ลบข้อมูลรายละเอียดสำเร็จ' })
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};