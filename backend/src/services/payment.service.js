const express = require('express');
const razorpay = require("../config/razorpayClient");
const orderService=require("../services/order.service.js");



const createPaymentLink = async (orderId) => {
  try {
    const order = await orderService.findOrderById(orderId);
    
    const paymentLinkRequest = { 
    amount:order.totalPrice*100,
    currency:"INR",
    customer:{
      name:order.user.firstName +" "+ order.user.lastName,
      contact : order.user.mobile,
      email:order.user.email
    },
    notify:{
      sms:true,
      email:true
    },
    reminder_enable:true,
    callback_url:`https://effervescent-sunflower-cd9145.netlify.app`,
    callback_method:'get',
    };

    const paymentLink = await razorpay.paymentLink.create(paymentLinkRequest);

    const paymentLinkId = paymentLink.id;
    const payment_link_url = paymentLink.short_url;

    const resData ={
      paymentLinkId : paymentLinkId,
      payment_link_url
    }
    return resData;
  } catch (error) {
    console.error("payment error",error);
    
    throw new Error(error.message);
  }
};

const updatePaymentInformation = async (reqData) => {

  const paymentId = reqData.payment_id;
  const orderId= reqData.order_id;

  try {
    const order = await orderService.findOrderById(orderId);
    const payment = await razorpay.payments.fetch(paymentId);

    if(payment.status=='captured'){
      order.paymentDetails.paymentId = paymentId;
      order.paymentDetails.status='COMPLETED';
      order.orderStatus="PLACED";

      await order.save()
    }
    const resData = {message:"your ordre is placed ", success:true}
    return resData;
  } catch (error) {
    onsole.log("payment error in order");
    
    throw new Error(error.message);
    
  }
};

module.exports = {
  createPaymentLink,
  updatePaymentInformation,
};
