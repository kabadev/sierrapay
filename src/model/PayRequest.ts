import mongoose from "mongoose";

const PayRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    description: { type: String },
    paymentLink: { type: String },
    paymentId: { type: String },
    amount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const PayRequest =
  mongoose.models.PayRequest || mongoose.model("PayRequest", PayRequestSchema);
export default PayRequest;
