import { getUserTransactions } from "@/app/actions/userActions";
import { Button } from "@/components/ui/button";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import React from "react";

const TransactionPage = async () => {
  const user = await currentUser();
  const transactions = await getUserTransactions(user?.id!);

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
            <h2 className="text-white font-bold text-md">Transactions</h2>
          </div>
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
    </main>
  );
};

export default TransactionPage;
