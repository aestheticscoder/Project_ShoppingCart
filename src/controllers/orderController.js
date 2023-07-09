const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const { ObjectIdCheck } = require("../utils/validation");
const cartModel = require("../models/cartModel");

// Create Order

const createOrder = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { status, cancellable } = req.body;
        if (!ObjectIdCheck(userId)) {
            return res.status(400).json({ status: false, message: 'Invalid UserId' });
        }
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ status: false, message: 'User Not Found' });
        }
        if (userId.toString() !== (req.userId).toString()) {
            return res.status(403).json({ status: false, message: 'UNAUTHORIZED' });
        }
        if (status) {
            const arr = ["PENDING", "COMPLETED", "CANCELLED"];
            if (!arr.includes(status)) {
                return res.status(400).json({ status: false, message: 'Invalid Status' });
            }
        }
        const cart = await cartModel.findOne({ userId: userId });
        if (!cart) {
            return res.status(404).json({ status: false, message: 'Nothing Found' });
        }
        const totalQuantity = (cart.items).reduce((sum, item) => sum + item.quantity, 0);
        const orderDetails = {
            userId: userId,
            items: cart.items,
            totalItems: cart.totalItems,
            totalPrice: cart.totalPrice,
            totalQuantity: totalQuantity,
            cancellable: (cancellable) ? cancellable : true,
            status: (status) ? status : 'PENDING',
        }

        const order = await orderModel.create(orderDetails);
        return res.status(201).json({ status: true, message: 'Order Created', data: order });

    } catch (error) {
        if (error.message.includes('duplicate')) {
            return res.status(400).json({ status: false, message: error.message });
        }
        else if (error.message.includes('validation')) {
            return res.status(400).json({ status: false, message: error.message });
        }
        else {
            return res.status(500).json({ status: false, message: error.message });
        }
    }
}

// Update Order

const updateOrder = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { orderId, status } = req.body;
        if (!orderId || !userId) {
            return res.status(400).json({ status: false, message: 'OrderId / UserId not Found' });
        }
        if (!ObjectIdCheck(orderId) || !ObjectIdCheck(userId)) {
            return res.status(400).json({ status: false, message: 'Invalid OrderId / UserId' });
        }
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ status: false, message: 'User Not Found' });
        }
        if (userId.toString() !== (req.userId).toString()) {
            return res.status(403).json({ status: false, message: 'UNAUTHORIZED' });
        }
        const order = await orderModel.findOne({ _id: orderId, userId: userId, isDeleted: false });
        if (!order) {
            return res.status(404).json({ status: false, message: 'Order Not Found' });
        }
        if (!status) {
            return res.status(400).json({ status: false, message: 'Please enter Status' });
        }
        if (order.status == "COMPLETED") {
            return res.status(400).json({ status: false, message: 'Order Already Completed' });
        }
        if (order.status == "CANCELLED") {
            return res.status(400).json({ status: false, message: 'Order Already Cancelled' });
        }
        if (order.status == "PENDING") {
            const updateOrder = await orderModel.findOneAndUpdate({ _id: orderId, isDeleted: false }, { $set: { status: status } }, { new: true });
            return res.status(200).json({ status: true, message: 'Order Updated', data: updateOrder });
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}
module.exports = {
    createOrder,
    updateOrder,
}