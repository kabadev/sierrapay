import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Payment from "../Payment";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return (
    <main className="min-h-screen overflow-y-auto">
      <div className="flex items-center justify-center">
        <div className="w-full md:w-[60%] bg-background shadow-md pb-52">
          <div className="flex items-center h-16 bg-primary">
            <Link href={"/recharge"}>
              <Button className="hover:opacity-70">
                <ArrowLeft />
              </Button>
            </Link>
            <h2 className="text-white font-bold text-md">Payment</h2>
          </div>
          <div className=" mt-10">
            <Payment id={id} />
          </div>
        </div>
      </div>
    </main>
  );
}
