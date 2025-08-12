import User from "@/model/user";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import Transaction from "@/model/transaction";

const MONIME_API_URL = "https://api.monime.io/payment-codes";
const MONIME_SPACE_ID = process.env.MONIME_SPACE_ID;
const MONIME_API_KEY = process.env.MONIME_API_KEY;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  let isStreamClosed = false;

  const checkPaymentStatus = async () => {
    try {
      const response = await fetch(`${MONIME_API_URL}/${id}`, {
        headers: {
          "Monime-Space-Id": MONIME_SPACE_ID!,
          Authorization: `Bearer ${MONIME_API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.messages[0] || "Failed to fetch payment code");
      }

      return data.result;
    } catch (error) {
      console.error("Error fetching payment code:", error);
      return null;
    }
  };

  const updatePaymentCode = async (paymentCode: any) => {
    const bodydata = {
      name: "SierraPay ",
      mode: "recurrent",
      isActive: true,
      amount: {
        currency: "SLE",
        value: paymentCode.amount.value,
      },
      duration: "30m",
      customerTarget: {
        name: paymentCode.metadata.name,
        reference: `Ref_${Date.now()}`,
        payingPhoneNumber: "0" + paymentCode.metadata.mobile,
      },
      allowedProviders: ["m17", "m18"],
      metadata: {},
    };

    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${MONIME_API_KEY}`,
        "Monime-Space-Id": MONIME_SPACE_ID!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodydata),
    };

    const response: any = await fetch(
      MONIME_API_URL + "/" + paymentCode.id,
      config
    );
    const datass = await response.json();

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status}, MESSAGE:${response}`
      );
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.messages[0] || "Failed to update payment code");
    }

    return data.result;
  };

  // const updateUserBalance = async (
  //   userId: string,
  //   amount: number,
  //   paymenId: string
  // ) => {
  //   try {
  //     const user = await User.findOne({ clerkId: userId });

  //     if (!user) {
  //       throw new Error("User not found");
  //     }

  //     if (user.lastpaymentId !== paymenId) {
  //       user.lastpaymentId = paymenId;
  //       user.balance = user.balance + amount;
  //       await user.save();
  //     }
  //   } catch (error) {
  //     console.error("Error updating user balance:", error);
  //     throw error;
  //   }
  // };

  const updateUserBalance = async (
    clerkUserId: string,
    amount: number,
    paymentId: string
  ) => {
    try {
      const client = await clerkClient();

      const user = await client.users.getUser(clerkUserId);

      if (!user) throw new Error("User not found in Clerk");

      const lastPaymentId = user.publicMetadata.lastPaymentId as
        | string
        | undefined;
      let balance = Number(user.publicMetadata.balance || 0);

      if (lastPaymentId !== paymentId) {
        balance += amount;

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

  const saveTransactionRecord = async (data: {
    userId: string;
    type: string;
    mobile: string;
    amount: number;
  }) => {
    try {
      const newTransaction = new Transaction({
        userId: data.userId,
        type: data.type,
        mobile: data.mobile,
        amount: data.amount,
      });

      await newTransaction.save();
      console.log("Transaction saved successfully:", newTransaction._id);
    } catch (error) {
      console.error("Error saving transaction:", error);
      throw error;
    }
  };

  const sendUpdate = async () => {
    if (isStreamClosed) {
      return;
    }

    try {
      const paymentCode = await checkPaymentStatus();

      if (paymentCode) {
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({
              status: paymentCode.status,
              isActive: paymentCode.isActive,
            })}\n\n`
          )
        );

        if (
          paymentCode.status === "processing" ||
          paymentCode.status === "completed"
        ) {
          // Update user balance
          await updateUserBalance(
            paymentCode.metadata.userId,
            Number(paymentCode.metadata.amount),
            paymentCode.id
          );
          await saveTransactionRecord({
            userId: paymentCode.metadata.userId,
            type: "deposit",
            mobile: paymentCode.metadata.mobile,
            amount: Number(paymentCode.metadata.amount),
          });
          // Send the updated payment code information to the client
          await writer.write(
            encoder.encode(
              `data: ${JSON.stringify({
                status: paymentCode.status,
              })}\n\n`
            )
          );
        }

        if (
          paymentCode.status === "completed" ||
          paymentCode.status === "expired" ||
          paymentCode.status === "processing"
        ) {
          isStreamClosed = true;
          await writer.close();
        } else {
          setTimeout(sendUpdate, 5000);
        }
      } else {
        isStreamClosed = true;
        await writer.close();
      }
    } catch (error) {
      console.error("Error in sendUpdate:", error);
      isStreamClosed = true;
      await writer.close().catch(() => {}); // Ignore errors on close
    }
  };

  // Start the SSE stream
  sendUpdate().catch((error) => {
    console.error("Unhandled error in sendUpdate:", error);
    isStreamClosed = true;
    writer.close().catch(() => {}); // Ignore errors on close
  });

  request.signal.addEventListener("abort", () => {
    isStreamClosed = true;
    writer.close().catch(() => {}); // Ignore errors on close
  });

  return new NextResponse(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
