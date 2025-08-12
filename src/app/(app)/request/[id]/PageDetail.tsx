"use client";
import { payRequestPayment } from "@/app/actions/userActions";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const PayRequestPayment = ({ paymentDetail }: any) => {
  const [amount, setAmount] = useState<number | string>(paymentDetail.amount);
  const [mobile, setMobile] = useState<string>("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const formatMobile = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 8);
    if (cleaned.length > 5) {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(
        5
      )}`;
    } else if (cleaned.length > 2) {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
    }
    return cleaned;
  };

  const handleMobileChange = (value: string) => {
    setMobile(formatMobile(value));
  };

  const handleBuy = async () => {
    setLoading(true);
    try {
      const response = await payRequestPayment(
        paymentDetail?.userId,
        paymentDetail.id,
        Number(amount),
        mobile
      );

      if (!response.success) {
        setServerError(response.message || "Payment failed");
        return;
      }
      setSuccess(true);
    } catch (error) {
      setServerError("An error occurred while processing the payment.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-[calc(100vh-70px)] overflow-y-auto">
      <div className="flex items-center justify-center">
        <div className="w-full md:w-[60%] bg-background shadow-md pb-52">
          <div className="flex items-center h-14 bg-primary">
            <Link href={"/"}>
              <Button className="hover:opacity-70">
                <ArrowLeft />
              </Button>
            </Link>
            <h2 className="text-white font-bold text-md">Recharge</h2>
          </div>

          {success ? (
            <main className="flex flex-col items-center justify-center min-h-[calc(100vh-70px)] p-6 text-center">
              <CheckCircle2 size={80} className="text-green-500" />
              <h1 className="text-3xl font-bold mt-4 text-green-600">
                Payment Successful!
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                You sent{" "}
                <span className="font-bold">
                  SLE {Number(amount).toLocaleString()}
                </span>
                {mobile && (
                  <>
                    {" "}
                    to <span className="font-bold">+232 {mobile}</span>
                  </>
                )}
              </p>
              <Link href="/" className="mt-6">
                <Button>Back to Home</Button>
              </Link>
            </main>
          ) : (
            <div className="p-4 space-y-6">
              <div className="bg-primary p-4 flex items-center justify-center flex-col min-h-[150px] rounded-lg">
                <p className="text-white">Send Amount</p>
                <h1 className="text-3xl md:text-5xl font-black text-white">
                  SLE{" "}
                  {typeof amount === "number" ? amount.toLocaleString() : "0"}
                </h1>
                <p className="text-white">{paymentDetail.description}</p>
              </div>

              <div className="bg-background">
                <p>Enter Mobile Number (Optional)</p>
                <div className="flex items-center gap-2 p-2 h-16 border rounded-md">
                  <div className="flex items-center mr-3">
                    <Image
                      src={"/slflag.png"}
                      alt="SlFlag"
                      width={100}
                      height={80}
                      className="h-4 w-6 object-contain"
                    />
                    <p className="text-xl font-bold"> +232</p>
                  </div>
                  <input
                    className="bg-transparent h-full bg-accents outline-none border-none w-full font-bold text-xl"
                    type="text"
                    placeholder="78-123-456"
                    onChange={(e) => handleMobileChange(e.target.value)}
                    value={mobile}
                  />
                </div>
              </div>

              {serverError && (
                <span className="text-red-500 text-md">{serverError}</span>
              )}

              <div className="mt-6 flex items-center justify-end">
                <Button disabled={loading} onClick={handleBuy}>
                  {loading ? "Processing..." : "Pay now"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default PayRequestPayment;
