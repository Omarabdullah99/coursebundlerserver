import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    customerId: {
        type: String,
        required: true
      },
      payment_intent:{
        type:String,
        required:true,
      },
    subscriptionId: {
        type: String,
        required: true
      },
      created:{
        type:Number,
        required:true,
      }
});

export const Payment = mongoose.model("Payment",schema);