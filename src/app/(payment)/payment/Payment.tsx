"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

// import Countdown from "./Countdown";
import CountdownExpireDate from "./Countdown";
import CountdownTimer from "./CountdownTimer";
import Spinner from "@/components/cwinui/Spinner";
import SuccessPayment from "./SuccessPayment";
import Image from "next/image";
import { Check, CircleX, Copy, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// import { useToast } from "@/components/ui/use-toast";
// import { ToastViewport } from "@/components/ui/toast";

export default function Payment({ id }: { id: string }) {
  const [paymentCode, setPaymentCode] = useState<any>(null);

  const [isCopied, setIsCopied] = useState(false);
  const [isPaymentCompleted, setIsPaymentCompleted] = useState<boolean>(false);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // const { toast } = useToast();
  // Fetch the initial payment code data
  const fetchPaymentCode = useCallback(async () => {
    try {
      const response = await fetch(`/api/payments/payment-code/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch payment code");
      }
      const data = await response.json();
      setPaymentCode(data.paymentCode);
      setIsExpired(new Date(data.paymentCode.expireTime) <= new Date());
    } catch (error) {
      console.error("Error fetching payment code:", error);
      setError("Failed to load payment details. Please try again.");
    }
  }, [id]);

  // Set up EventSource for real-time status updates
  useEffect(() => {
    fetchPaymentCode();

    const eventSource = new EventSource(`/api/payments/payment-events/${id}`);
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.status === "processing") {
          eventSource.close();
          setIsPaymentCompleted(true);
          // router.push("/payment_success");
        } else if (data.status === "expired") {
          setIsExpired(true);
          eventSource.close();
        }
      } catch (error) {
        console.error("Error processing event data:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      setError("Lost connection to the server. Please refresh the page.");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [id, router, fetchPaymentCode]);

  const handleExpire = () => {
    if (!isPaymentCompleted) {
      // setIsExpired(true);
    }
  };

  // Handle regenerating a new payment code
  const handleRegenerateCode = async () => {
    try {
      if (!paymentCode) return;
      const response = await fetch("/api/payments/payment-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(paymentCode.metadata.amount),
          userId: paymentCode.metadata.userId,
          fullName: paymentCode.metadata.name,
          mobile: paymentCode.metadata.mobile,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to regenerate payment code");
      }

      const data = await response.json();
      if (data.paymentCode) {
        router.push(`/payment/${data.paymentCode.id}`);
      }
    } catch (error) {
      console.error("Error regenerating payment code:", error);
      setError("Failed to generate a new payment code. Please try again.");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(paymentCode.ussdCode);
      setIsCopied(true);
      // toast({
      //   title: "Copied to clipboard",
      //   description: "USSD code has been copied successfully",
      // });

      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      // toast({
      //   variant: "destructive",
      //   title: "Failed to copy",
      //   description: "Please try copying manually",
      // });
      console.error("Failed to copy code:", err);
    }
  };

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 text-center flex items-center justify-center flex-col">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
        <CircleX className="text-red-500 h-16 w-16  " />
        <p className="mb-4">{error}</p>

        <button
          onClick={() => window.location.reload()}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  if (!paymentCode) {
    return (
      <div className="max-w-md mx-auto mt-10 text-center">
        <Spinner className="w-[100px] animate-spin duration-500 h-[100px] border-primary" />
      </div>
    );
  }

  if (isPaymentCompleted) {
    return <SuccessPayment amount={paymentCode?.amount?.value / 100} />;
  }

  return (
    <div className="w-full mt-10 p-6 md:px-24">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Complete Your Payment
      </h1>

      <div className="mb-4 max-md: text-center mt-4">
        <p className="text-muted-foreground">Amount</p>
        <h2 className="text-3xl md:text-4xl font-bold text-primary">
          LE {paymentCode.amount.value / 100}
        </h2>
      </div>

      {isExpired ? (
        <div className="flex items-center justify-center flex-col">
          <p className="text-xl font-semibold mb-4 text-red-500">
            Payment code has expired.
          </p>
          <div className="h-24 w-24 mb-6 bg-red-200 rounded-full p-4">
            <CircleX className="h-full w-full text-red-500" />
          </div>
          <p className="text-muted-foreground">
            <strong>Note:!</strong> If you have already complete the payment and
            it has not reflected, please try to refresh your browser.
          </p>
          <p className="text-muted-foreground mb-1">
            If you have not yet complete the payment, please generate new code
            to proceed with payment
          </p>
          <Button
            onClick={handleRegenerateCode}
            className="bg-primary mt-4 text-white px-4 py-2 rounded hover:bg-primary/70"
            // disabled={}
          >
            Generate New Payment Code
          </Button>
        </div>
      ) : (
        <div>
          <p className="mb-2 text-muted-foreground">USSD Code:</p>
          <div className="bg-[#cjjs] p-6 rounded-sm flex items-center justify-center ">
            <Link href={`tel:${paymentCode.ussdCode}`}>
              {" "}
              <h2 className="text-2xl md:text-3xl   tracking-wider font-black text-primary">
                {paymentCode.ussdCode}
              </h2>
            </Link>
          </div>
          <p className="text-muted-foreground mt-2">
            Dial the USSD code above on your mobile phone to proceed with
            payment.
          </p>

          <div className="flex items-center justify-center gap-6 mt-6 mb-8">
            <Link href={`tel:${paymentCode.ussdCode}`}>
              <Button className="">Pay Now</Button>
            </Link>

            <div className="text-center ">
              <Button
                variant="outline"
                className="flex items-center gap-2 min-w-[160px] transition-all duration-200"
                onClick={copyToClipboard}
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-green-500">COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>COPY USSD CODE</span>
                  </>
                )}
              </Button>
            </div>

            {/* <ToastViewport /> */}
          </div>

          {!isExpired && (
            <CountdownTimer
              expiryTime={paymentCode.expireTime}
              createTime={paymentCode.createTime}
              onExpire={handleExpire}
            />
          )}
        </div>
      )}
    </div>

    // <SuccessPayment />
  );
}
