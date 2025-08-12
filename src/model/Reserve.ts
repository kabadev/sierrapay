import mongoose from "mongoose";

const reserveSchema = new mongoose.Schema({
  balance: { type: Number, default: 1000 },
  type: { type: String, unique: true, default: "system-reserve" },
});

const Reserve =
  mongoose.models.Reserve || mongoose.model("Reserve", reserveSchema);
export default Reserve;
