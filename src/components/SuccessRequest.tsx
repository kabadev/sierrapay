"use client";
import React from "react";
import { CheckCircle2, Share2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessProps {
  link: string;
}

const SuccessRequest: React.FC<SuccessProps> = ({ link }) => {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Payment Request",
          text: "Here’s your payment request link:",
          url: link,
        });
      } catch (error) {
        console.error("Sharing failed", error);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-70px)] space-y-6 p-6 text-center">
      <CheckCircle2 className="text-green-500" size={80} />
      <h1 className="text-3xl font-bold text-green-600">
        Payment Request Created!
      </h1>
      <p className="text-lg text-muted-foreground">
        Share this link to receive payment:
      </p>

      <div className="bg-muted px-4 py-2 rounded-md break-all max-w-[90%]">
        {link}
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={handleCopy}>
          <Copy className="mr-2" size={18} /> Copy
        </Button>
        <Button onClick={handleShare}>
          <Share2 className="mr-2" size={18} /> Share
        </Button>
      </div>
    </div>
  );
};

export default SuccessRequest;
