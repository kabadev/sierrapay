import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    type: { type: String, required: true },
    mobile: { type: String },
    transferFee: { type: Number, default: 0 },
    processingFee: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    amount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction =
  mongoose.models.transaction ||
  mongoose.model("transaction", transactionSchema);
export default Transaction;
