const createError = require('http-errors');
const OrderModel = require('../models/order');
const OrderItemModel = require('../models/orderItem');

module.exports = class OrderService {

  async create(data) {
    const { userId } = data;

    try {

      // Instantiate new order and save
      const Order = new OrderModel();
      const order = await Order.create({ userId, total });

      return cart;

    } catch(err) {
      throw err;
    }

  };

  async list(userId) {
    try {
      // Load user orders based on ID
      const orders = await OrderModel.findByUser(userId);

      return orders;

    } catch(err) {
      throw err;
    }
  }

  async findById(orderId) {
    try {
      // Load user orders based on ID
      const order = await OrderModel.findById(orderId);

      return order;

    } catch(err) {
      throw err;
    }
  }

}