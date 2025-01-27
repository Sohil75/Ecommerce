const express = require('express');
const Razorpay = require('razorpay');

apiKey="rzp_test_yqv5Ry9ggCySYV"
apiSecret="36O3lWUzfQFqCrCBhBqvGvMb"

const razorpay = new Razorpay({
    key_id: apiKey,
    key_secret: apiSecret,
  });


  module.exports=razorpay;