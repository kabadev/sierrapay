import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="flex flex-col max-md:items-center max-md:justify-center w-full h-[calc(100vh-70px)] md:w-[30%]">
        <div className="bg-primary h-52 md:h-20 rounded-br-full w-full"></div>
        <SignIn />
        <div className="text-sm mt-2 flex"></div>
      </div>
    </div>
  );
}
