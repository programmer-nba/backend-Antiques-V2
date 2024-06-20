const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
	queue: { type: String, required: false, default: '' },
	invoice: { type: String, required: false, default: '' },
	customer_id: { type: String, required: false, default: '' },
	product_detail: {
		type: [
			{
				productimage: { type: String, required: false, default: '' },
				packageid: { type: String, required: true },
				packagename: { type: String, required: false },
				weight: { type: Number, required: true },
				price: { type: Number, required: false, default: 0 },
			}
		]
	},
	total: { type: Number, required: false, default: 0 },
	bill_status: { type: String, default: "ออกบัตรคิว", required: false },
	order_status: { type: Array, required: false, default: [] },
	employee: { type: String, required: false, default: '' },
	timestamps: { type: Date, required: false, default: Date.now() },
});

const Order = mongoose.model("order", OrderSchema);

module.exports = { Order };