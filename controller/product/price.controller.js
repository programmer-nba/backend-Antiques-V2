const { Price } = require("../../model/product/price.model");

module.exports.create = async (req, res) => {
	try {
		const data = {
			...req.body,
		};
		const new_price = new Price(data);
		if (!new_price)
			return res.status(403).send({ status: false, message: "มีบางอย่างผิดพลาด" });
		new_price.save();
		return res.status(201).send({ message: "เพิ่มราคาสินค้าสำเร็จ", status: true, data: new_price });
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.getPriceAll = async (req, res) => {
	try {
		const price = await Price.find();
		if (!price)
			return res.status(403).send({ status: false, message: 'ดึงข้อมูลไม่สำเร็จ' })
		return res.status(200).send({ status: true, message: 'ดึงข้อมูลราคาสินค้าสำเร็จ', data: price })
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.getPriceById = async (req, res) => {
	try {
		const id = req.params.id;
		const price = await Price.findOne({ _id: id });
		if (!price)
			return res.status(403).send({ status: false, message: 'ดึงข้อมูลไม่สำเร็จ' })
		return res.status(200).send({ status: true, message: 'ดึงข้อมูลราคาสินค้าสำเร็จ', data: price })
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.getPriceByDetailId = async (req, res) => {
	try {
		const id = req.params.detailid;
		const pipeline = [
			{
				$match: { "detail_id": id },
			}
		];
		const price = await Price.aggregate(pipeline);
		if (!price)
			return res.status(403).send({ status: false, message: "ดึงข้อมูลไม่สำเร็จ" });
		return res.status(200).send({ status: true, message: "ดึงข้อมูลราคาสินค้าสำเร็จ", data: price });
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.updatePrice = async (req, res) => {
	try {
		if (!req.body) {
			return res.status(400).send({ message: "ส่งข้อมูลผิดพลาด" });
		}
		const id = req.params.id;
		const price = await Price.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
		if (!price)
			return res.status(403).send({ status: false, message: 'แก้ไขข้อมูลไม่สำเร็จ' })
		return res.status(200).send({ status: true, message: 'แก้ไขข้อมูลสำเร็จ' })
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.deletePrice = async (req, res) => {
	try {
		const id = req.params.id;
		const price = await Price.findByIdAndDelete(id, { useFindAndModify: false });
		if (!price)
			return res.status(403).send({ status: false, message: 'ลบข้อมูลราคาไม่สำเร็จ' })
		return res.status(200).send({ status: true, message: 'ลบข้อมูลราคาสำเร็จ' })
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};