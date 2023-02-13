
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { Users } from "../models/Users.js";
import Stripe from "stripe";
import { Payment } from "../models/payment.js";

const stripe = new Stripe("sk_test_51MaBGjCfCnJCyV0Jo4cEQU1JeEVvGGGkony6fmQlZSLdcHw6ajnoppTs0WTNAAE7qsbl6mCrO288VJbbUSSb5q5H00xU5uyO0u");
export const buySubscription = catchAsyncError(async (req, res, next) => {
  const {name,email,priceId,paymentMethod} = req.body
  const user = await Users.findById(req.user._id);
  if (user.role === "admin")
  return next(new ErrorHandler("Admin can't buy a Subscription"));
  const customer = await stripe.customers.create({
    name:user.name,
    email:user.email,
    payment_method:paymentMethod,
    invoice_settings: {
      default_payment_method: paymentMethod,
    },
  });
  
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: process.env.STRIPE_PLAN_ID }],
    payment_settings: {
      payment_method_options: {
        card: {
          request_three_d_secure: 'automatic',
        },
      },
      payment_method_types: ['card'],
      save_default_payment_method: 'on_subscription',
    },
    expand: ['latest_invoice.payment_intent'],
  });
  user.subscription.id = subscription.id;
  user.subscription.status = subscription.status;
  await user.save();
  await Payment.create({
    customerId:customer.id,
    payment_intent:subscription.latest_invoice.payment_intent.id,
    subscriptionId:subscription.id,
    created:Date.now(),
  })
  res.status(201).json({
    success:true,
    payment_intent:subscription.latest_invoice.payment_intent.id,
    message:"Subscribed successfully."
  })
});
export const cancelSubscription = catchAsyncError(async (req, res, next) => {
  const user = await Users.findById(req.user._id);
  const subscriptionId = user.subscription.id
  let refund = false
   await stripe.subscriptions.del(subscriptionId)
 
  const payment = await Payment.findOne({
    subscriptionId
  });
  const gap = Date.now() - payment.created;

  const refundTime = process.env.REFUND_DAYS * 24 * 60 * 60 * 1000;
  if (refundTime > gap) {
    await stripe.refunds.create({
      payment_intent:payment.payment_intent
    })
    refund = true;
  }
  await payment.remove();
  user.subscription.id = undefined;
  user.subscription.status = undefined;
  await user.save();
  res.status(200).json({
    success: true,
    message: refund
    ? "Subscription cancelled, You will receive full refund within 7 days."
    : "Subscription cancelled, No refund initiated as subscription was cancelled after 7 days.",
  });
});