import dayjs from "dayjs";
import { getTransactionById } from "@/app/actions/userActions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Transaction {
  _id: string;
  userId: string;
  type: string;
  mobile?: string;
  transferFee: number;
  processingFee: number;
  totalAmount: number;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const transaction = await getTransactionById(id);

  if (!transaction) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Transaction not found.</p>
      </div>
    );
  }

  return (
    <main className="h-[calc(100vh-70px)] overflow-y-auto">
      <div className="flex items-center justify-center">
        <div className="w-full md:w-[60%] bg-background shadow-md pb-52">
          <div className="flex items-center h-14 bg-primary">
            <Link href={"/"}>
              <Button className="hover:opacity-70">
                <ArrowLeft />
              </Button>
            </Link>
            <h2 className="text-white font-bold text-md">
              Transaction Details
            </h2>
          </div>

          <h1 className="text-2xl font-bold my-6 px-4 text-gray-800">
            Transaction Details
          </h1>
          <div className="space-y-4 px-4">
            <DetailRow label="Transaction ID" value={transaction._id} />
            <DetailRow label="Type" value={capitalize(transaction.type)} />
            <DetailRow
              label="Mobile Number"
              value={transaction.mobile || "-"}
            />
            <DetailRow
              label="Amount"
              value={`SLE${transaction.amount.toFixed(2)}`}
            />
            <DetailRow
              label="Transfer Fee"
              value={`SLE${transaction.transferFee.toFixed(2)}`}
            />
            <DetailRow
              label="Processing Fee"
              value={`SLE${transaction.processingFee.toFixed(2)}`}
            />
            <DetailRow
              label="Total Amount"
              value={`SLE${transaction.totalAmount.toFixed(2)}`}
            />
            <DetailRow
              label="Date"
              value={dayjs(transaction.createdAt).format("MMM D, YYYY h:mm A")}
            />
          </div>
        </div>
      </div>
    </main>

    // <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
    //   <h1 className="text-2xl font-bold mb-6 text-gray-800">
    //     Transaction Details
    //   </h1>

    // </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
