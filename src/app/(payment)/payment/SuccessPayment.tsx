"use client";

import React, { useCallback } from "react";
// import { CheckCircle } from "lucide-react";
// import Particles from "react-particles";
// import type { Engine } from "tsparticles-engine";
// import { loadSlim } from "tsparticles-slim";

// import { useWindowSize } from 'react-use'
// import Confetti from "react-confetti";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SuccessPayment({ amount }: any) {
  return (
    <div className="relative min-h-screen flex items-start justify-center  overflow-hidden">
      {/* <Confetti className="w-full h-full" /> */}
      <div className="flex  justify-center  ">
        <div className="bg-white h-[500px] flex items-center justify-center flex-col rounded-lg shadow-lg p-6  text-center animate-fade-in">
          <div className="flex items-center justify-center mb-4 animate-bounces bg-green-300 w-32 h-32 rounded-full">
            <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold  mb-2">Recharge Successful!</h1>
          <p className="text-md mb-6">
            Thank you for your payment. Your transaction was completed
            successfully.
          </p>

          <div className="mb-4">
            <p className="text-muted-foreground">Amount</p>
            <h2 className="text-3xl md:text-4xl font-bold ">
              LE {amount?.toLocaleString()}
            </h2>
          </div>

          {/* Button */}
          <Link href={"/"}>
            <Button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-transform transform hover:scale-105">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
