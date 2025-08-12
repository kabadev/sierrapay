import sidebarItems from "@/data/menu";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="flex items-center  justify-center fixed bottom-0   right-0 left-0  h-[70px]  max-md:p-0 ">
      <div className="w-full md:w-[60%]  bg-primary   rounded-t-2xl  max-md:border h-full flex items-center justify-center gap-4 ">
        <div className="flex items-center">
          {sidebarItems.slice(0, 4).map((item, index) => (
            <div key={index}>
              <Link
                href={item.path}
                className="flex items-center gap-1 p-4 flex-col text-white"
              >
                <item.icon className=" text-xl text-white" />
                {item.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Footer;
