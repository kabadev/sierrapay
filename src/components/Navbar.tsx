import sidebarItems from "@/data/menu";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { FaRegUser, FaUserAlt } from "react-icons/fa";
import { Button } from "./ui/button";
import { Blend, Menu } from "lucide-react";

const Navbar = () => {
  return (
    <div className="border-b flex items-center justify-between fixed top-0 w-full  backdrop-blur-sm bg-white/30  h-[60px] md:h-[70px] px-3 md:px-32">
      <div className="flex items-center">
        <Link href="/" className="flex items-center gap-1 ">
          {/* <Image
            src="/cwinlogo1.png"
            alt="Salone Mall Logo"
            width={60}
            height={60}
            className="max-md:h-12 w-16 object-contain"
          /> */}
          <Blend className="text-primary" size={30} />
          <span className="md:text-2xl text-[#24023d]  font-bold text-lg shidden smd:block">
            Sierra<span className="text-primary">pay</span>
          </span>
        </Link>
      </div>

      <UserButton />
    </div>
  );
};

export default Navbar;
