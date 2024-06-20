const { Category } = require("../../model/product/category.model");

module.exports.create = async (req, res) => {
	try {
		const category = await Category.findOne({
			name: req.body.name,
		});
		if (category)
			return res.status(409).send({ status: false, message: "มีประเภทสินค้านี้ในระบบแล้ว" });
		const data = {
			...req.body,
		};
		const new_cate = new Category(data);
		if (!new_cate)
			return res.status(403).send({ status: false, message: "มีบางอย่างผิดพลาด" });
		new_cate.save();
		return res.status(201).send({ message: "เพิ่มประเภทสินค้าสำเร็จ", status: true, data: new_cate });
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.getCategoryAll = async (req, res) => {
	try {
		const category = await Category.find();
		if (!category)
			return res.status(403).send({ status: false, message: 'ดึงข้อมูลไม่สำเร็จ' })
		return res.status(200).send({ status: true, message: 'ดึงข้อมูลประเภทสำเร็จ', data: category })
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.getCategoryById = async (req, res) => {
	try {
		const id = req.params.id;
		const category = await Category.findOne({ _id: id });
		if (!category)
			return res.status(403).send({ status: false, message: 'ดึงข้อมูลไม่สำเร็จ' })
		return res.status(200).send({ status: true, message: 'ดึงข้อมูลประเภทสำเร็จ', data: category })
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.updateCategory = async (req, res) => {
	try {
		if (!req.body) {
			return res.status(400).send({ message: "ส่งข้อมูลผิดพลาด" });
		}
		const id = req.params.id;
		const category = await Category.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
		if (!category)
			return res.status(403).send({ status: false, message: 'แก้ไขข้อมูลไม่สำเร็จ' })
		return res.status(200).send({ status: true, message: 'แก้ไขข้อมูลสำเร็จ' })
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.deleteCategory = async (req, res) => {
	try {
		const id = req.params.id;
		const category = await Category.findByIdAndDelete(id, { useFindAndModify: false });
		if (!category)
			return res.status(403).send({ status: false, message: 'ลบข้อมูลประเภทไม่สำเร็จ' })
		return res.status(200).send({ status: true, message: 'ลบข้อมูลประเภทสำเร็จ' })
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};