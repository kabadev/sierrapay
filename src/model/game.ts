import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    date: {
      type: Date,
      required: true,
    },
    sn: {
      type: Number,
      required: true,
    },
    unit: {
      type: Number,
    },
    color: {
      type: String,
    },
  },
  { timestamps: true }
);

const Game = mongoose.models.game || mongoose.model("game", gameSchema);

export default Game;
