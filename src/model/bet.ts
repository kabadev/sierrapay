import mongoose from "mongoose";

const betSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "game",
      required: true,
    },
    isColor: {
      type: Boolean,
      default: false,
    },
    selected: { type: String, required: true },
    amount: {
      type: Number,
    },
    initAmount: {
      type: Number,
    },
    fee: {
      type: Number,
    },
    isWin: {
      type: Boolean,
      default: false,
    },
    resultColor: {
      type: String,
    },
    resultUnit: {
      type: Number,
    },
    isSelectable: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Bet = mongoose.models.bet || mongoose.model("bet", betSchema);
export default Bet;

// User Actions
export const getbets = () => Bet.find();
export const getBetById = (id: string) => Bet.findById(id);
export const getGetByUser = (userId: string) => Bet.findOne({ userId });
