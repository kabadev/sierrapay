import mongoose from "mongoose";

import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
  },
  photo: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  balance: {
    type: Number,
    default: 50,
  },
  lastpaymentId: {
    type: String,
  },
});

const User = models?.User || model("User", UserSchema);

export default User;

// User Actions
export const getUsers = () => User.find();
export const getUserById = (id: string) => User.findById(id);

export const getUserByEmail = (email: string) => User.findOne({ email });

export const deleteUserById = (id: string) =>
  User.findOneAndDelete({ _id: id });
