import { NextResponse } from "next/server";

const MONIME_API_URL = "https://api.monime.io/payment-codes";
const MONIME_SPACE_ID = process.env.MONIME_SPACE_ID;
const MONIME_API_KEY = process.env.MONIME_API_KEY;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  try {
    const response = await fetch(`${MONIME_API_URL}/${id}`, {
      headers: {
        "Monime-Space-Id": MONIME_SPACE_ID!,
        Authorization: `Bearer ${MONIME_API_KEY}`,
      },
    });

    const data = await response.json();
    if (!data.success) {
      return NextResponse.json({ error: data.messages[0] }, { status: 400 });
    }

    return NextResponse.json({ paymentCode: data.result });
  } catch (error) {
    console.error("Error fetching payment code:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment code" },
      { status: 500 }
    );
  }
}
