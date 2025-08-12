"use client";
import CurrencyFormater from "@/components/cwinui/CurrencyFormater";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/userContext";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Recharge = () => {
  const router = useRouter();
  const { user } = useUser();

  const [amount, setAmount] = useState<number | string>(10);
  const [mobile, setMobile] = useState<string>("");
  const [error, setError] = useState("");
  const [mobileEerror, setMobileError] = useState("");

  const amounts = [10, 20, 50, 100, 200, 500];
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof amount === "number" && amount < 1) {
      setError("10 is the minimum amount to recharge");
    } else if (mobile.length > 0 && !/^\d{8}$/.test(mobile.replace(/-/g, ""))) {
      setMobileError("Mobile number must be exactly 8 digits.");
    } else {
      setError("");
      setMobileError("");
    }
  }, [amount, mobile]);

  const handleInputChange = (value: string) => {
    const numericValue = parseFloat(value.replace(/,/g, ""));
    if (!isNaN(numericValue)) {
      setAmount(numericValue);
    } else {
      setAmount("");
    }
  };

  const formatMobile = (value: string) => {
    // Remove non-numeric characters and ensure a max of 8 digits
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
    setMobile(value);
    // formatMobile(value)
  };

  const handleBuy = async () => {
    let hasError = false;

    // Validate amount
    if (typeof amount !== "number" || amount < 1) {
      setError("10 is the minimum amount to recharge");
      hasError = true;
    } else {
      setError("");
    }

    // Validate mobile number
    if (mobile.length === 0 || !/^\d{8}$/.test(mobile.replace(/-/g, ""))) {
      setMobileError("Mobile number must be exactly 8 digits.");
      hasError = true;
    } else {
      setMobileError("");
    }

    // Stop submission if there are errors
    if (hasError) return;

    setLoading(true);
    try {
      //localhost:3000/api/payments/payment-code
      const response = await fetch("/api/payments/payment-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id!,
          fullName: user?.firstName + " " + user?.lastName,
          amount: amount,
          mobile: mobile,
        }),
      });

      const data = await response.json();
      if (data.paymentCode) {
        router.push(`/payment/${data.paymentCode.id}`);
      }
    } catch (error) {
      console.error("Error creating payment code:", error);
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
          <div className="p-4 space-y-6">
            <div className="bg-primary p-4 flex items-center justify-center flex-col min-h-[150px] rounded-lg">
              <p className="text-white">Recharge Amount</p>
              <h1 className="text-3xl md:text-5xl font-black text-white">
                SLE {typeof amount === "number" ? amount.toLocaleString() : "0"}
              </h1>
            </div>
            <div className="bg-background">
              <p>Enter amount</p>
              <div className="border flex items-center gap-2 p-2 h-16 rounded-md">
                <p className="font-bold text-3xl md:text-5xl text-muted-foreground">
                  Le
                </p>
                <input
                  className="bg-transparent outline-none border-none w-full font-bold text-3xl md:text-5xl"
                  type="text"
                  placeholder="0"
                  onChange={(e) => handleInputChange(e.target.value)}
                  value={
                    typeof amount === "number" ? amount.toLocaleString() : ""
                  }
                />
              </div>
              {error && <span className="text-red-500 text-md">{error}</span>}
            </div>
            <div className="space-y-4">
              <p>Select recharge amount</p>
              <div className="grid grid-cols-3 gap-4">
                {amounts.map((amt) => (
                  <Button
                    key={amt}
                    onClick={() => setAmount(amt)}
                    variant={"outline"}
                    className="h-16 text-xl"
                  >
                    {amt}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-background">
              <p>Enter Mobile Number</p>
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
              {mobileEerror && (
                <span className="text-red-500 text-md">{mobileEerror}</span>
              )}
            </div>

            <div className="mt-6 flex items-center justify-end">
              <Button disabled={!!error || loading} onClick={handleBuy}>
                {loading ? "Processing..." : "Recharge now"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Recharge;
