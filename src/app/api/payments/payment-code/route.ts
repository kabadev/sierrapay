import { NextResponse } from "next/server";

const MONIME_API_URL = process.env.MONIME_API_URL;
const MONIME_SPACE_ID = process.env.MONIME_SPACE_ID;
const MONIME_API_KEY = process.env.MONIME_API_KEY;

export async function POST(request: Request) {
  const { amount, fullName, userId, mobile } = await request.json();

  try {
    if (!amount) {
      return NextResponse.json(
        {
          success: false,
          message: "Amount required",
        },
        { status: 400 }
      );
    }
    if (!fullName) {
      return NextResponse.json(
        {
          success: false,
          message: "fullName required",
        },
        { status: 400 }
      );
    }
    if (!mobile) {
      return NextResponse.json(
        {
          success: false,
          message: "Mobile number is required ",
        },
        { status: 400 }
      );
    }
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User userId is required ",
        },
        { status: 400 }
      );
    }

    const bodydata = {
      name: "Sierrapay Transaction",
      mode: "recurrent",
      isActive: true,
      amount: {
        currency: "SLE",
        value: amount * 100,
      },
      duration: "5m",
      // customerTarget: {
      //   name: fullName,
      //   reference: `Ref_${Date.now()}`,
      //   payingPhoneNumber: "0" + mobile,
      // },
      allowedProviders: ["m17", "m18"],
      metadata: {
        amount: amount.toString(),
        name: fullName,
        userId: userId,
        mobile: mobile,
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
    const data = await response.json();

    if (!data.success) {
      return NextResponse.json({ error: data.error.message }, { status: 400 });
    }

    return NextResponse.json({ paymentCode: data.result });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create payment code. Error:" + error },
      { status: 500 }
    );
  }
}
