import Hero from "@/components/Hero";

import {
  ArrowLeftRight,
  ArrowUpFromLine,
  HandHelping,
  Send,
} from "lucide-react";
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
import { getUserTransactions } from "../actions/userActions";
import { currentUser } from "@clerk/nextjs/server";
export default async function Home() {
  // const transactions = [
  //   {
  //     _id: "txn_001",
  //     amount: 265.75,
  //     type: "sent",
  //     paymentMethod: "mobile money",
  //     phone: "+2207612345",
  //     timestamp: "2025-07-23T09:30:00Z",
  //   },
  //   {
  //     _id: "txn_002",
  //     amount: 190.0,
  //     type: "received",
  //     paymentMethod: "wave money",
  //     phone: "+2208823456",
  //     timestamp: "2025-07-22T18:45:00Z",
  //   },
  //   {
  //     _id: "txn_003",
  //     amount: 220.25,
  //     type: "sent",
  //     paymentMethod: "orange money",
  //     phone: "+2207721123",
  //     timestamp: "2025-07-23T07:20:00Z",
  //   },
  // ];

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
    {
      name: "See All",
      icon: Grid,
      path: "/services",
    },
  ];
  const user = await currentUser();

  const transactions = await getUserTransactions(user?.id!);

  return (
    <main className="h-[calc(100vh-70px)] overflow-y-auto max-md:p-3">
      <div className="flex items-center justify-center">
        <div className="w-full md:w-[60%] bg-background h-full  pb-20">
          <Hero />

          <div className="px-2 ">
            <div className="bg-gradient-to-b  from-white via-white to-transparent relative min-h-[100px] w-full -mt-16 rounded-lg  p-5">
              <div className="flex  items-center justify-between mt-2">
                <Link
                  href={"/recharge"}
                  className="flex gap-2 flex-col items-center justify-center"
                >
                  <div className="bg-primary text-white flex-col h-16 w-16 rounded-full flex items-center justify-center">
                    <ArrowUpFromLine />
                  </div>
                  Add
                </Link>

                <Link
                  href={"/request"}
                  className="flex gap-2  flex-col items-center justify-center"
                >
                  <div className="bg-primary text-white flex-col h-16 w-16 rounded-full flex items-center justify-center">
                    <HandHelping />
                  </div>
                  Request
                </Link>

                <Link
                  href={"/withdraw"}
                  className="flex gap-2  flex-col items-center justify-center"
                >
                  <div className="bg-primary text-white flex-col h-16 w-16 rounded-full flex items-center justify-center">
                    <ArrowLeftRight />
                  </div>
                  Transfer
                </Link>
              </div>
            </div>
          </div>
          <div className="w-full mt-4 px-2 rounded-2xl h-44 bg-gradient-to-bl from-[#3f0543]  via-[#300e4c] to-[#261547]">
            <img
              className="w-full h-full object-cover rounded-2xl"
              src="https://host4geeks.com/wp-content/uploads/2018/11/payment-gateway-banner.png"
              alt=""
            />
          </div>

          <div className="mt-4 px-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-md font-bold">Services</h2>

              <span>View all</span>
            </div>
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

          <div className="mt-8 w-full">
            {/* Header */}
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">Transactions</h2>
              <Link href="/transactions" className="text-primary text-lg">
                See all
              </Link>
            </div>

            {/* Transactions */}
            <div className="mt-4 w-full">
              {transactions.map((transaction: any, i: any) => (
                <Link
                  key={transaction._id}
                  href={`/transactions/${transaction._id}`}
                  className="flex justify-between gap-4 h-20 w-full bg-white rounded-md py-3 items-center  px-3 text-left"
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="bg-slate-50 h-10 w-10 flex items-center justify-center rounded-md">
                      {transaction.type === "request" ||
                      transaction.type === "deposit" ? (
                        <Send className="text-primary" size={16} />
                      ) : (
                        <Send
                          size={16}
                          className="text-primary"
                          style={{ transform: "rotate(180deg)" }}
                        />
                      )}
                    </div>

                    {/* Transaction Details */}
                    <div>
                      <div className="text-lg font-semibold text-gray-800">
                        +232{transaction?.mobile}
                      </div>
                      <div className="text-sm text-slate-600 capitalize">
                        {transaction.type}
                      </div>
                      <div className="text-xs text-slate-400">
                        {new Date(transaction.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div
                    className={`text-xl mt-1 ${
                      transaction.type === "deposit" ||
                      transaction.type === "request"
                        ? "text-green-500"
                        : ""
                    }`}
                  >
                    {transaction.type === "deposit" ||
                    transaction.type === "request"
                      ? "+"
                      : "-"}
                    {parseFloat(transaction.amount).toFixed(2)}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
