"use server";
import mongoose from "mongoose";
import Success from "@/components/Success";
import { connect } from "@/lib/db";
import { mongooseConnect } from "@/lib/mongoose";
import Bet from "@/model/bet";
import PayRequest from "@/model/PayRequest";
import Transaction from "@/model/transaction";
import User from "@/model/user";
import { clerkClient, currentUser } from "@clerk/nextjs/server";

export async function createUser(user: any) {
  try {
    await connect();
    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.log(error);
  }
}

export async function getUserDetail() {
  mongooseConnect();
  const user = await currentUser();

  // const userData: any = await User.findOne({ clerkId: user?.id });
  const currentUserData = JSON.parse(JSON.stringify(user));
  return currentUserData;
}

export async function getBetHistory(page: number = 1, pageSize: number = 10) {
  try {
    // Ensure database connection
    mongooseConnect();

    // Get the current user
    const user = await currentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const userData = await User.findOne({ clerkId: user.id });
    // Fetch total number of bets for the user
    const totalBets = await Bet.countDocuments({
      userId: userData.clerkId,
      isSelectable: true,
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalBets / pageSize);

    // Fetch bets for the given page with sorting and pagination
    const bets = await Bet.find({
      userId: userData.clerkId,
      isSelectable: true,
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();

    // Construct response data
    const betData = {
      bets,
      currentPage: page,
      totalPages,
      totalBets,
    };

    // console.log(JSON.parse(JSON.stringify(betData)));

    return JSON.parse(JSON.stringify(betData));
  } catch (error) {
    console.error("Error fetching bet history:", error);
    // throw new Error("Failed to fetch bet history");
  }
}

export async function createPayRequest(amount: number, description: string) {
  try {
    await connect();

    const user = await currentUser();

    const paymentId = Math.random().toString(36).substring(2, 15);
    const newPayRequest = await PayRequest.create({
      userId: user?.id,
      amount,
      description,
      paymentId,
      paymentLink: `https://sierrapay.vercel.app/request/${paymentId}`,
    });

    return JSON.parse(
      JSON.stringify({
        success: true,
        message: "Payment request created successfully",
        data: newPayRequest,
      })
    );
  } catch (error: any) {
    console.log(error);
    return JSON.parse(
      JSON.stringify({ Success: false, message: error.message })
    );
  }
}

export async function getPayRequestById(paymentId: string) {
  try {
    await connect();
    const payRequest = await PayRequest.findOne({ paymentId: paymentId });
    if (!payRequest) {
      throw new Error("Payment request not found");
    }
    return JSON.parse(JSON.stringify(payRequest));
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch payment request");
  }
}

export async function payRequestPayment(
  userId: string,
  paymentId: string,
  amount: number,
  mobile: string
) {
  await connect();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await currentUser();
    if (!user) return { success: false, message: "User not found in Clerk" };

    const client = await clerkClient();

    const payRequest = await PayRequest.findOne({ paymentId }).session(session);
    if (!payRequest)
      return { success: false, message: "Payment request not found" };

    const receiverUser = await client.users.getUser(userId);
    let receiverBalance = Number(receiverUser.publicMetadata.balance || 0);
    let senderBalance = Number(user.publicMetadata.balance || 0);

    if (senderBalance < amount) {
      return { success: false, message: "Insufficient balance" };
    }

    // Save receiver transaction
    const receiverTransaction = new Transaction({
      userId,
      type: "request",
      mobile,
      amount,
      totalAmount: amount,
    });
    await receiverTransaction.save({ session });

    // Save sender transaction
    const senderTransaction = new Transaction({
      userId: user.id,
      type: "send",
      mobile,
      amount,
      totalAmount: amount,
    });
    await senderTransaction.save({ session });

    // Update balances
    await client.users.updateUserMetadata(receiverUser.id, {
      publicMetadata: {
        balance: receiverBalance + amount,
      },
    });

    await client.users.updateUserMetadata(user.id, {
      publicMetadata: {
        balance: senderBalance - amount,
      },
    });

    await session.commitTransaction();
    session.endSession();

    return JSON.parse(JSON.stringify(payRequest));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    throw error;
  }
}

export async function getUserTransactions(userId: string) {
  try {
    await connect();
    const transactions = await Transaction.find({ userId }).sort({
      createdAt: -1,
    });
    console.log("Fetched user transactions:", transactions);
    return JSON.parse(JSON.stringify(transactions));
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    throw new Error("Failed to fetch user transactions");
  }
}

export async function getTransactionById(transactionId: string) {
  try {
    await connect();
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    return JSON.parse(JSON.stringify(transaction));
  } catch (error) {
    console.error("Error fetching transaction:", error);
    throw new Error("Failed to fetch transaction");
  }
}
