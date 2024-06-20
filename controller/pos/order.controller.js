const dayjs = require("dayjs");
const { Order } = require("../../model/pos/order.model");
const { Customer } = require("../../model/user/customer.model");
const { Price } = require("../../model/product/price.model");
const { Detail } = require("../../model/product/detail.model");

module.exports.create = async (req, res) => {
	try {
		const queue = await queueNumber();

		let level = '';

		const customer = await Customer.findById(req.body.customer_id);
		if (!customer) {
			level = 'general'
		} else {
			if (customer.level === '') {
				level = 'general'
			} else {
				level = customer.level;
			}
		}

		let product_detail = [];

		for (let item of req.body.product_detail) {
			const price = await Price.findById(item.packageid);
			const detail = await Detail.findById(price.detail_id);
			let e = 0;
			let total = 0;
			if (!price) {
				e = 0;
				total = e * item.weight;
			} else {
				if (level === 'general') {
					e = price.price.general;
					total = e * item.weight;
				} else if (level === 'a') {
					e = price.price.a;
					total = e * item.weight;
				} else if (level === 'b') {
					e = price.price.b;
					total = e * item.weight;
				} else if (level === 'c') {
					e = price.price.c;
					total = e * item.weight;
				} else if (level === 'd') {
					e = price.price.d;
					total = e * item.weight;
				}
			}
			const data = {
				packageid: item.packageid,
				packagename: detail.name,
				weight: Number(item.weight),
				price: total,
			};
			product_detail.push(data);
		};

		const totalprice = product_detail.reduce((accumulator, currentValue) => accumulator + currentValue.price, 0);

		const data = {
			queue: queue,
			invoice: '',
			customer_id: req.body.customer_id,
			product_detail: product_detail,
			total: totalprice,
			bill_status: 'ออกบัตรคิว',
			order_status: [{
				name: 'รอชำระเงิน',
				timestamps: dayjs(Date.now()).format("")
			}],
		};

		const new_order = new Order(data);
		if (!new_order)
			return res.status(403).send({ status: false, message: 'ไม่สามารถสร้างรายงานขายสินค้าได้' });
		new_order.save();
		return res.status(200).send({ status: true, message: 'สร้างรายการขายสินค้าสำเร็จ', data: new_order });
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

async function queueNumber() {
	const pipelint = [
		{
			$group: {
				_id: null,
				count: { $sum: 1 },
				firstTicketCreatedAt: { $min: "$timestamps" },
				lastTicketCreatedAt: { $max: "$timestamps" }
			},
		},
	];
	const count = await Order.aggregate(pipelint);
	const countValue = count.length > 0 ? count[0].count + 1 : 1;
	const data = `${countValue}`;
	return data;
};

async function invoiceNumber() {
	const pipelint = [
		{
			$group: {
				_id: null,
				count: { $sum: 1 },
				firstTicketCreatedAt: { $min: "$timestamps" },
				lastTicketCreatedAt: { $max: "$timestamps" }
			},
		},
	];
	const count = await Order.aggregate(pipelint);
	const countValue = count.length > 0 ? count[0].count + 1 : 1;
	const data = `AT${dayjs(Date.now()).format("YYMMDD")}${countValue.toString().padStart(3, "0")}`;
	return data;
};

module.exports.getOrderAll = async (req, res) => {
	try {
		const order = await Order.find();
		if (!order)
			return res.status(403).send({ status: false, message: 'ดึงข้อมูลออเดอร์ไม่สำเร็จ' });
		return res.status(200).send({ status: true, message: 'ดึงข้อมูลออเดอร์สำเร็จ', data: order })
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.getOrderById = async (req, res) => {
	try {
		const id = req.params.id;
		const order = await Order.findOne({ _id: id });
		if (!order)
			return res.status(403).send({ status: false, message: 'ดึงข้อมูลออเดอร์ไม่สำเร็จ' })
		return res.status(200).send({ status: true, message: 'ดึงข้อมูลออเดอร์สำเร็จ', data: order })
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.getOrderWait = async (req, res) => {
	try {
		const order = await Order.find();
		if (!order)
			return res.status(403).send({ status: false, message: 'ดึงข้อมูลออเดอร์ไม่สำเร็จ' })

		// console.log(order)
		const orders = order.filter(
			(el) => getLastName(el.order_status) === 'รอชำระเงิน' && el.bill_status === 'ออกบัตรคิว'
		);
		return res.status(200).send({ status: true, message: 'ดึงข้อมูลออเดอร์สำเร็จ', data: orders })
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.getOrderCancel = async (req, res) => {
	try {
		const order = await Order.find();
		if (!order)
			return res.status(403).send({ status: false, message: 'ดึงข้อมูลออเดอร์ไม่สำเร็จ' })
		// console.log(order)
		const orders = order.filter(
			(el) => getLastName(el.order_status) === 'ยกเลิกรายการ' && el.bill_status === 'ยกเลิก'
		);
		return res.status(200).send({ status: true, message: 'ดึงข้อมูลออเดอร์สำเร็จ', data: orders })
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

function getLastName(item) {
	const data = item[item.length - 1].name;
	return data;
};

module.exports.paymentOrder = async (req, res) => {
	try {
		const id = req.params.id;
		const order = await Order.findById(id);
		if (!order)
			return res.status(403).send({ status: false, message: 'ไม่พบรายการดังกล่าว' });

		const e = order.order_status[order.order_status.length - 1].name;
		if (e === 'รอชำระเงิน' && order.bill_status === 'ออกบัตรคิว') {
			const status = {
				name: 'ชำระเงิน',
				timestamps: dayjs(Date.now()).format("")
			};
			order.order_status.push(status);
			order.bill_status = 'ชำระเงิน';
			order.save();
			return res.status(200).send({ status: true, message: 'ชำระเงินบิลดังกล่าวสำเร็จ' })
		} else {
			return res.status(403).send({ status: false, message: 'รายการดังกล่าวไม่สามารถชำระเงินได้' })
		}
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.cancelOrder = async (req, res) => {
	try {
		const id = req.params.id;
		const order = await Order.findById(id);
		if (!order)
			return res.status(403).send({ status: false, message: 'ไม่พบรายการดังกล่าว' });
		const e = order.order_status[order.order_status.length - 1].name;
		if (e === 'รอชำระเงิน' && order.bill_status === 'ออกบัตรคิว') {
			const status = {
				name: 'ยกเลิก',
				timestamps: dayjs(Date.now()).format("")
			};
			order.order_status.push(status);
			order.bill_status = 'ยกเลิก';
			order.save();
			return res.status(200).send({ status: true, message: 'ยกเลิกรายการดังกล่าวสำเร็จ' })
		} else {
			return res.status(403).send({ status: false, message: 'รายการดังกล่าวไม่สมารถยกเลิกได้' })
		}
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};