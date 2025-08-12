import React from "react";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Success = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] space-y-6 p-6 text-center">
      <CheckCircle2 className="text-green-500" size={80} />
      <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
      <p className="text-lg text-muted-foreground">
        Your transfer was completed successfully.
      </p>
      <Link href="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
};

export default Success;
