require("dotenv").config();

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const connection = require("./config/db");
connection();

app.use(bodyParser.json({ limit: "50mb", type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(cors());

const prefix = "/antiques";

app.use(prefix + "/login", require("./routes/login"));

// User
app.use(prefix + "/admin", require("./routes/user/admin"));
app.use(prefix + "/employee", require("./routes/user/employee"));
app.use(prefix + "/customer", require("./routes/user/customer"));

// Product
app.use(prefix + "/product/category", require("./routes/product/category"));
app.use(prefix + "/product/type", require("./routes/product/type"));
app.use(prefix + "/product/detail", require("./routes/product/detail"));
app.use(prefix + "/product/price", require("./routes/product/price"));

// Order
app.use(prefix + "/order", require("./routes/pos/order"));

const port = process.env.PORT || 1111;

app.listen(port, () => { console.log(`Antiques API Runing PORT ${port}`) });