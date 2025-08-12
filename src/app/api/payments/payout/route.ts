import { NextResponse } from "next/server";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import Transaction from "@/model/transaction";
const MONIME_API_URL = process.env.MONIME_PAYOUT_API_URL;
const MONIME_SPACE_ID = process.env.MONIME_SPACE_ID;
const MONIME_API_KEY = process.env.MONIME_PAYOUT_API_KEY;

export async function POST(request: Request) {
  const { amount, fullName, mobile, provider } = await request.json();
  const user = await currentUser();
  const client = await clerkClient();
  const userId = user?.id;

  // Define fee rates
  const processingFeeRate = 0.01; // 1%
  const transferFeeRate = 0.005; // 0.5%

  // Calculate fees
  const transferFee = amount * transferFeeRate;
  const processingFee = amount * processingFeeRate;
  const totalAmount = amount + transferFee + processingFee;
  try {
    if (!amount) {
      return NextResponse.json(
        { success: false, message: "Amount required" },
        { status: 400 }
      );
    }
    if (!fullName) {
      return NextResponse.json(
        { success: false, message: "fullName required" },
        { status: 400 }
      );
    }
    if (!provider) {
      return NextResponse.json(
        { success: false, message: "mobile number Provider required" },
        { status: 400 }
      );
    }
    if (!mobile) {
      return NextResponse.json(
        { success: false, message: "Mobile number is required " },
        { status: 400 }
      );
    }
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User userId is required " },
        { status: 400 }
      );
    }

    // if (user?.publicMetadata?.balance! < totalAmount) {
    //   return NextResponse.json(
    //     { success: false, message: "Insufficent balance " },
    //     { status: 400 }
    //   );
    // }

    // Prepare bodydata with total amount (in smallest currency unit, e.g. cents)
    const bodydata = {
      amount: {
        currency: "SLE",
        value: Math.round(totalAmount * 100), // convert to integer (cents)
      },
      destination: {
        providerCode: provider,
        accountId: `+232${mobile}`,
      },
      metadata: {
        transferFee: transferFee.toFixed(2),
        processingFee: processingFee.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
        name: fullName,
        userId: userId,
        mobile: mobile,
        provider: provider,
        amount: amount.toString(),
      },
    };

    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MONIME_API_KEY}`,
        "Monime-Space-Id": MONIME_SPACE_ID!,
        "Idempotency-Key": `payment_${Date.now()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodydata),
    };

    const response: any = await fetch(MONIME_API_URL!, config);
    const { result: data, success } = await response.json();

    if (!success) {
      return NextResponse.json({ error: data.error.message }, { status: 400 });
    }

    const saveTransactionRecord = async (data: {
      userId: string;
      type: string;
      mobile: string;
      amount: number;
      transferFee: any;
      processingFee: any;
      totalAmount: any;
    }) => {
      try {
        const newTransaction = new Transaction({
          userId: data.userId,
          type: data.type,
          mobile: data.mobile,
          amount: data.amount,
          transferFee: data.transferFee,
          processingFee: data.processingFee,
          totalAmount: data.totalAmount,
        });

        await newTransaction.save();
        console.log("Transaction saved successfully:", newTransaction._id);
      } catch (error) {
        console.error("Error saving transaction:", error);
        throw error;
      }
    };

    const updateUserBalance = async (
      clerkUserId: string,
      amount: number,
      paymentId: string
    ) => {
      try {
        if (!user) throw new Error("User not found in Clerk");

        const lastPaymentId = user.publicMetadata.lastPaymentId as
          | string
          | undefined;
        let balance = Number(user.publicMetadata.balance || 0);

        if (lastPaymentId !== paymentId) {
          balance -= amount;

          await client.users.updateUserMetadata(clerkUserId, {
            publicMetadata: {
              balance,
              lastPaymentId: paymentId,
            },
          });
        }
      } catch (error) {
        console.error("Error updating Clerk user balance:", error);
        throw error;
      }
    };
    if (data.status === "completed" || data.status === "processing") {
      await updateUserBalance(
        data.metadata.userId,
        Number(data.metadata.amount),
        data.id
      );
      // Save the total amount charged (including fees)
      await saveTransactionRecord({
        userId: data.metadata.userId,
        type: "Transfer",
        mobile: data.metadata.mobile,
        amount: Number(data.metadata.totalAmount),
        transferFee: Number(data.metadata.transferFee),
        processingFee: Number(data.metadata.processingFee),
        totalAmount: Number(data.metadata.totalAmount),
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Payment failed: " + data.status },
        { status: 400 }
      );
    }
    return NextResponse.json({ paymentCode: data.result });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create payment code. Error:" + error },
      { status: 500 }
    );
  }
}
