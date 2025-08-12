"use client";
import { createPayRequest } from "@/app/actions/userActions";
import CurrencyFormater from "@/components/cwinui/CurrencyFormater";
import Success from "@/components/Success";
import SuccessRequest from "@/components/SuccessRequest";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUserContext } from "@/context/userContext";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Recharge = () => {
  const router = useRouter();
  const { currentUserDetail } = useUserContext();
  const [amount, setAmount] = useState<number | string>(10);
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState("");
  const [mobileEerror, setMobileError] = useState("");

  const amounts = [10, 20, 50, 100, 200, 500];
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successLink, setSuccessLink] = useState<string | null>(null);

  useEffect(() => {
    if (typeof amount === "number" && amount < 1) {
      setError("Sle 10 is the minimum amount to Request");
    }
    //  else if (mobile.length > 0 && !/^\d{8}$/.test(mobile.replace(/-/g, ""))) {
    //   setMobileError("Mobile number must be exactly 8 digits.");
    // }
    else {
      setError("");
      setMobileError("");
    }
  }, [amount]);

  const handleInputChange = (value: string) => {
    const numericValue = parseFloat(value.replace(/,/g, ""));
    if (!isNaN(numericValue)) {
      setAmount(numericValue);
    } else {
      setAmount("");
    }
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

    if (hasError) return;

    setLoading(true);
    try {
      const data = await createPayRequest(Number(amount), description);

      if (data.success) {
        setSuccess(true);
        setSuccessLink(data.data.paymentLink);
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
            <h2 className="text-white font-bold text-md">Request</h2>
          </div>

          {success ? (
            <SuccessRequest link={successLink!} />
          ) : (
            <div className="p-4 space-y-6">
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
                <p>Enter Description (Optional)</p>
                <div className="flex items-center gap-2 p-2 h-16 border rounded-md">
                  <div className="flex items-center w-full ">
                    <Textarea
                      className="bg-transparent h-full bg-accents outline-none border-none w-full "
                      placeholder="Enter Request Description"
                      onChange={(e) => setDescription(e.target.value)}
                      value={description}
                    ></Textarea>
                  </div>
                  {mobileEerror && (
                    <span className="text-red-500 text-md">{mobileEerror}</span>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-end">
                  <Button disabled={!!error || loading} onClick={handleBuy}>
                    {loading ? "Processing..." : "Request now"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Recharge;
