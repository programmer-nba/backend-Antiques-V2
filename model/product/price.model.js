const mongoose = require("mongoose");

const PriceSchema = new mongoose.Schema({
	detail_id: { type: String, required: true },
	price: {
		general: { type: Number, required: false, default: 0 },
		a: { type: Number, required: false, default: 0 },
		b: { type: Number, required: false, default: 0 },
		c: { type: Number, required: false, default: 0 },
		d: { type: Number, required: false, default: 0 },
	},
	emp: { type: String, required: false, default: "ไม่มี" }
});

const Price = mongoose.model("product_price", PriceSchema);

module.exports = { Price }