const express = require('express');
const Address = require('../models/address.model.js');
const Order = require('../models/order.model.js');
const OrderItem = require('../models/orderItems.js');
const cartService = require('../services/cart.service.js');

async function createOrder(user, shippAddress) {
  try {
    // Validate shipping address input
    if (!shippAddress) throw new Error("Shipping address is required.");

    let address;
    if (shippAddress._id) {
      const existedAddress = await Address.findById(shippAddress._id);
      if (!existedAddress) throw new Error("Address not found with provided ID.");
      address = existedAddress;
    } else {
      address = new Address(shippAddress);
      address.user = user;
      await address.save();
      user.addresses.push(address);
      await user.save();
    }

    // Fetch user cart
    const cart = await cartService.findUserCart(user._id);
    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
      throw new Error("Cart is empty or not found.");
    }

    const orderItems = [];
    for (const item of cart.cartItems) {
      // Validate cart item fields
      if (!item.price || !item.product || !item.quantity) {
        throw new Error(`Invalid cart item: ${JSON.stringify(item)}`);
      }

      const orderItem = new OrderItem({
        price: item.price,
        product: item.product,
        quantity: item.quantity,
        size: item.size,
        userId: item.userId,
        discountedPrice: item.discountedPrice,
      });

      const createdOrderItem = await orderItem.save();
      orderItems.push(createdOrderItem);
    }

    // Create and save the order
    const createdOrder = new Order({
      user,
      orderItems,
      totalPrice: cart.totalPrice,
      totalDiscountedPrice: cart.totalDiscountedPrice,
      discounte: cart.discounte,
      totalItem: cart.totalItem,
      shippingAddress: address,
      orderDate: new Date(),
      orderStatus: "PENDING",
      paymentDetails: { status: "PENDING" }, // Ensure this matches your schema
      createdAt: new Date(),
    });

    const savedOrder = await createdOrder.save();

    // Link order to each order item
    for (const item of orderItems) {
      item.order = savedOrder;
      await item.save();
    }

    return savedOrder;
  } catch (error) {
    console.error("Error creating order: ", error.message);
    throw new Error(error.message);
  }
}

async function placedOrder(orderId) {
  try {
    const order = await findOrderById(orderId);
    if (!order) throw new Error("Order not found.");
    order.orderStatus = "PLACED";
    order.paymentDetails.status = "COMPLETED";
    return await order.save();
  } catch (error) {
    console.error("Error placing order: ", error.message);
    throw new Error(error.message);
  }
}

async function confirmedOrder(orderId) {
  try {
    const order = await findOrderById(orderId);
    if (!order) throw new Error("Order not found.");
    order.orderStatus = "CONFIRMED";
    return await order.save();
  } catch (error) {
    console.error("Error confirming order: ", error.message);
    throw new Error(error.message);
  }
}

async function shipOrder(orderId) {
  try {
    const order = await findOrderById(orderId);
    if (!order) throw new Error("Order not found.");
    order.orderStatus = "SHIPPED";
    return await order.save();
  } catch (error) {
    console.error("Error shipping order: ", error.message);
    throw new Error(error.message);
  }
}

async function deliveredOrder(orderId) {
  try {
    const order = await findOrderById(orderId);
    if (!order) throw new Error("Order not found.");
    order.orderStatus = "DELIVERED";
    return await order.save();
  } catch (error) {
    console.error("Error delivering order: ", error.message);
    throw new Error(error.message);
  }
}

async function cancelledOrder(orderId) {
  try {
    const order = await findOrderById(orderId);
    if (!order) throw new Error("Order not found.");
    order.orderStatus = "CANCELLED";
    return await order.save();
  } catch (error) {
    console.error("Error cancelling order: ", error.message);
    throw new Error(error.message);
  }
}

async function findOrderById(orderId) {
  try {
    const order = await Order.findById(orderId)
      .populate("user")
      .populate({ path: "orderItems", populate: { path: "product" } })
      .populate("shippingAddress");
    if (!order) throw new Error("Order not found.");
    return order;
  } catch (error) {
    console.error("Error finding order: ", error.message);
    throw new Error(error.message);
  }
}

async function usersOrderHistory(userId) {
  try {
    const orders = await Order.find({ user: userId })
      .populate({ path: "orderItems", populate: { path: "product" } })
      .lean();
    console.log("User order history: ", orders);
    return orders;
  } catch (error) {
    console.error("Error fetching user order history: ", error.message);
    throw new Error(error.message);
  }
}

async function getAllOrders() {
  try {
    const orders = await Order.find()
      .populate({ path: "orderItems", populate: { path: "product" } })
      .lean();
    return orders;
  } catch (error) {
    console.error("Error fetching all orders: ", error.message);
    throw new Error(error.message);
  }
}

async function deleteOrder(orderId) {
  try {
    const order = await findOrderById(orderId);
    if (!order) throw new Error(`Order not found with ID ${orderId}`);
    await Order.findByIdAndDelete(orderId);
  } catch (error) {
    console.error("Error deleting order: ", error.message);
    throw new Error(error.message);
  }
}

module.exports = {
  createOrder,
  placedOrder,
  confirmedOrder,
  shipOrder,
  deliveredOrder,
  cancelledOrder,
  findOrderById,
  usersOrderHistory,
  getAllOrders,
  deleteOrder,
};
