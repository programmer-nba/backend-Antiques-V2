const dayjs = require("dayjs");
const { Customer, validate } = require("../../model/user/customer.model");

module.exports.create = async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message, status: false });
		const customer = await Customer.findOne({
			iden: req.body.iden
		});

		if (customer)
			return res.status(409).send({ status: false, message: "ลูกค้าดังกล่างมีข้อมูลอยู่ในระบบแล้ว" });

		const data = {
			...req.body,
			timestamp: dayjs(Date.now()).format(""),
		};
		const new_customer = new Customer(data);
		if (!new_customer)
			return res.status(403).send({ status: false, message: "มีบางอย่างผิดพลาด" });
		new_customer.save();
		return res.status(201).send({ message: "เพิ่มข้อมูลลูกค้าสำเร็จ", status: true, data: new_customer });
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.getCustomerAll = async (req, res) => {
	try {
		const customer = await Customer.find();
		if (!customer)
			return res.status(403).send({ status: false, message: 'ดึงข้อมูลลูกค้าไม่สำเร็จ' })
		return res.status(200).send({ status: true, message: 'ดึงข้อมูลลูกค้าสำเร็จ', data: customer })
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.getCustomerById = async (req, res) => {
	try {
		const id = req.params.id;
		const customer = await Customer.findOne({ _id: id });
		if (!customer)
			return res.status(403).send({ status: false, message: 'ดึงข้อมูลลูกค้าไม่สำเร็จ' })
		return res.status(200).send({ status: true, message: 'ดึงข้อมูลลูกค้าสำเร็จ', data: customer })
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.updateCustomer = async (req, res) => {
	try {
		if (!req.body) {
			return res.status(400).send({ message: "ส่งข้อมูลผิดพลาด" });
		}
		const id = req.params.id;
		const customer = await Customer.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
		if (!customer)
			return res.status(403).send({ status: false, message: 'แก้ไขข้อมูลลูกค้าไม่สำเร็จ' })
		return res.status(200).send({ status: true, message: 'แก้ไขข้อมูลลูกค้าสำเร็จ' })
	} catch (error) {

	}
};

module.exports.deleteCustomer = async (req, res) => {
	try {
		const id = req.params.id;
		const customer = await Customer.findByIdAndDelete(id, { useFindAndModify: false });
		if (!customer)
			return res.status(403).send({ status: false, message: 'ลบข้อมูลลูกค้าไม่สำเร็จ' })
		return res.status(200).send({ status: true, message: 'ลบข้อมูลลูกค้าสำเร็จ' })
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: "Internal Server Error" });
	}
};