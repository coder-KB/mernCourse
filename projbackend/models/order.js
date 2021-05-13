const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const ProductCartSchema = Schema({
    product: {
        type: ObjectId,
        ref: "Product",
    },
    name: String,
    count: Number,
    price: Number,
});

const orderSchema = Schema({
    products: [ProductCartSchema],
    transaction_id: {},
    amount: Number,
    address: String,
    status: {
        type: String,
        default: "Recieved",
        enum: ["Cancelled", "Delivered", "Shipped", "Processing", "Recieved"]
    },
    updated: Date,
    user: {
        type: ObjectId,
        ref: "User",
    }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
const ProductCart = mongoose.model("ProductCart", ProductCartSchema);

module.exports = { Order, ProductCart };