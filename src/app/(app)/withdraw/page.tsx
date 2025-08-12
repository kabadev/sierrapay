"use client";
import CurrencyFormater from "@/components/cwinui/CurrencyFormater";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/userContext";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Success from "@/components/Success";

const Recharge = () => {
  const router = useRouter();
  const { currentUserDetail } = useUserContext();
  const [amount, setAmount] = useState<number | string>(0);
  const [mobile, setMobile] = useState<string>("");
  const [provider, setProvider] = useState<string>("m17");
  const [error, setError] = useState("");
  const [mobileEerror, setMobileError] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  // Fee rates
  const processingFeeRate = 0.01; // 1%
  const transferFeeRate = 0.005; // 0.5%

  // Fee calculations
  const transferFee = typeof amount === "number" ? amount * transferFeeRate : 0;
  const processingFee =
    typeof amount === "number" ? amount * processingFeeRate : 0;
  const totalWithFees =
    typeof amount === "number" ? amount + transferFee + processingFee : 0;

  useEffect(() => {
    if (typeof amount === "number" && amount < 1) {
      setError("sle 1 is the minimum amount to Transfer");
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
    let hasError = false;
    if (typeof amount !== "number" || amount < 1) {
      setError("sle 1 is the minimum amount to Tranfer");
      hasError = true;
    } else {
      setError("");
    }

    if (mobile.length === 0 || !/^\d{8}$/.test(mobile.replace(/-/g, ""))) {
      setMobileError("Mobile number must be exactly 8 digits.");
      hasError = true;
    } else {
      setMobileError("");
    }

    if (hasError) return;

    setLoading(true);
    try {
      const response = await fetch("/api/payments/payout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUserDetail?.id,
          fullName:
            currentUserDetail?.firstName + " " + currentUserDetail?.lastName,
          amount: amount,
          mobile: mobile,
          provider: provider,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        setServerError(data.message);
      } else {
        setSuccess(true);
      }
    } catch (error: any) {
      console.error("Error creating payment code:", error);
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-[calc(100vh-70px)] overflow-y-auto">
      <div className="flex items-center justify-center">
        <div className="w-full md:w-[60%] bg-background shadow-md pb-20">
          <div className="flex items-center h-14 bg-primary">
            <Link href={"/"}>
              <Button className="hover:opacity-70">
                <ArrowLeft />
              </Button>
            </Link>
            <h2 className="text-white font-bold text-md">Transfer</h2>
          </div>
          {success ? (
            <Success />
          ) : (
            <div className="p-4 space-y-6">
              <div className="bg-primary p-4 flex items-center justify-center flex-col min-h-[150px] rounded-lg">
                <p className="text-white">Withdraw Transfer</p>
                <h1 className="text-3xl md:text-5xl font-black text-white">
                  SLE{" "}
                  {typeof amount === "number" ? amount.toLocaleString() : "0"}
                </h1>
              </div>

              {/* Amount input */}
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

              {/* Provider selection */}
              <div>
                <p>Select Provider</p>
                <Select
                  onValueChange={(value) => setProvider(value)}
                  defaultValue={"m17"}
                >
                  <SelectTrigger className="w-full p-7 text-md md:text-xl">
                    <SelectValue placeholder="Provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="m17" className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        <Image
                          src={"https://monime.io/logos/orangeMoney.png"}
                          alt=""
                          width={60}
                          height={60}
                        />
                        <p className="text-md md:text-xl font-bold cursor-pointer">
                          Orange Money
                        </p>
                      </div>
                    </SelectItem>
                    <SelectItem value="m-18" className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        <Image
                          src={"https://monime.io/logos/afrimoney.png"}
                          alt=""
                          width={60}
                          height={60}
                        />
                        <p className="text-md md:text-xl font-bold cursor-pointer">
                          Afri Money
                        </p>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Mobile input */}
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
                  <Input
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

              {/* Transfer summary */}
              {typeof amount === "number" && amount > 0 && (
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <h3 className="font-bold text-lg">Transfer Summary</h3>
                  <div className="flex justify-between">
                    <span>Amount</span>
                    <span>SLE {amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transfer Fee (3%)</span>
                    <span>SLE {transferFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Fee (5%)</span>
                    <span>SLE {processingFee.toFixed(2)}</span>
                  </div>

                  <hr className="my-2" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>SLE {totalWithFees.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {serverError && (
                <span className="text-red-500 text-md">{serverError}</span>
              )}
              {/* Action button */}
              <div className="mt-6 flex items-center justify-end max-md:justify-center">
                <Button
                  className="max-md:w-full p-6"
                  disabled={!!error || loading}
                  onClick={handleBuy}
                >
                  {loading ? "Processing..." : "Process now"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Recharge;
