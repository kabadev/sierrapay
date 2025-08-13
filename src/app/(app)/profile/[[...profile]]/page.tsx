import InstallPrompt from "@/components/InstallPrompt";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <main className="h-[calc(100vh-70px)] overflow-y-auto">
      <div className="flex items-center justify-center">
        <div className="w-full md:w-[60%] bg-background h-full  pb-20">
          <div className="flex items-center h-14 bg-primary">
            <Link href={"/"}>
              <Button className="hover:opacity-70">
                <ArrowLeft />
              </Button>
            </Link>
            <h2 className="text-white font-bold text-md">Profile</h2>
          </div>
          <div className="mt-4 w-full">
            <InstallPrompt />
            <UserProfile />
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
