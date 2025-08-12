import { getPayRequestById } from "@/app/actions/userActions";
import React from "react";
import PayRequestPayment from "./PageDetail";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const paymentDetail = await getPayRequestById(id);
  return <PayRequestPayment paymentDetail={paymentDetail} />;
};

export default page;
