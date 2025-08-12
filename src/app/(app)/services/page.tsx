import { getUserTransactions } from "@/app/actions/userActions";
import { Button } from "@/components/ui/button";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import {
  Phone,
  Wifi,
  Lightbulb,
  Ticket,
  GraduationCap,
  Tv,
  Grid,
} from "lucide-react";
const TransactionPage = async () => {
  const services = [
    {
      name: "Airtime",
      icon: Phone,
      path: "/airtime",
    },
    {
      name: "Data",
      icon: Wifi,
      path: "/data",
    },
    {
      name: "EDSA",
      icon: Lightbulb, // electricity icon
      path: "/edsa",
    },
    {
      name: "Remittance",
      icon: Send,
      path: "/remittance",
    },
    {
      name: "Ticketing",
      icon: Ticket,
      path: "/ticketing",
    },
    {
      name: "Education",
      icon: GraduationCap,
      path: "/education",
    },
    {
      name: "DSTV",
      icon: Tv,
      path: "/dstv",
    },
  ];
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
            <h2 className="text-white font-bold text-md">Services</h2>
          </div>
          <div className="mt-4 w-full">
            <div className="grid grid-cols-4 gap-4 mt-2">
              {services.map((service) => (
                <Link
                  key={service.name}
                  href={`services/${service.name}`}
                  className="flex flex-col items-center justify-center text-center bg-white p-4 rounded-lg  "
                >
                  <service.icon className="text-primary mb-2" size={24} />
                  <span className="text-sm font-medium">{service.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TransactionPage;
