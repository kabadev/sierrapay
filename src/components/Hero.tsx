"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect } from "react";
import CountDown from "./CountDown";
import { useUserContext } from "@/context/userContext";
import { Skeleton } from "./ui/skeleton";

import CurrencyFormater from "./cwinui/CurrencyFormater";
import { ArrowLeftRight, ArrowUpFromLine, Send } from "lucide-react";
import { useUser } from "@clerk/nextjs";

const Hero = () => {
  const { user } = useUser();
  const { currentUserDetail, fetchUserDetails, isLoading } = useUserContext();

  return (
    <div className="h-[150px]  md:h-[250px] flex flex-col justify-between items-start bg-gradient-to-bl from-[#3f0543]  via-[#300e4c] to-[#261547] gap-4 w-full  rounded-2xl p-3 md:p-10  ">
      <div className="flex flex-col justify-center">
        <h2 className="text-md text-slate-200">Balance</h2>
        <div className="flex gap-1 items-end">
          <h2 className=" text-white">
            SLE{" "}
            <span className="md:text-6xl text-xl font-bold">
              {" "}
              <CurrencyFormater
                value={Number(user?.publicMetadata?.balance)! || 0.0}
                className=""
              />
            </span>
          </h2>
        </div>

        {/* <div className="md:hhidden flex flex-col justify-center ">
            <div className="flex gap-2 mt-2">
              <Link href={"/recharge"}>
                <Button
                  variant={"secondary"}
                  className="max-md:p-2 max-md:text-[12px]"
                >
                  Recharge
                </Button>
              </Link>
              <Button
                variant={"outline"}
                className="bg-transparent text-white max-md:p-2 max-md:text-[12px]"
              >
                Read Rules
              </Button>
            </div>
          </div> */}
      </div>

      <div className="text-white">
        <p>Lansana</p>
        <p className="text-2xl -mt-2 font-black">29383739238</p>
      </div>
    </div>
  );
};

export default Hero;
