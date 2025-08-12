import { Button } from "@/components/ui/button";
import { UserProfile } from "@clerk/nextjs";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  Phone,
  Wifi,
  Lightbulb,
  Ticket,
  GraduationCap,
  Tv,
  Grid,
} from "lucide-react";
const page = async ({ params }: { params: Promise<{ service: string }> }) => {
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
  const servName = (await params).service;
  const service = services.find((s) => s.name === servName);
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
            <h2 className="text-white font-bold text-md">{servName}</h2>
          </div>
          <div className="mt-4 w-full flex-col min-h-[200px] flex items-center justify-center">
            <span>
              {service ? (
                <service.icon className="text-primary" size={48} />
              ) : (
                <Grid className="text-primary" size={48} />
              )}
            </span>
            <h2 className="text-3xl font-bold">Coming soon</h2>
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
