"use client";
import React from "react";

interface NumberFormatterProps {
  value: number;
  className: string;
}

const CurrencyFormater: React.FC<NumberFormatterProps> = ({
  value,
  className,
}) => {
  const formatNumber = (num: number): string => num?.toLocaleString("en-US");

  const formattedNumber = formatNumber(value);

  return <span className={className}>{formattedNumber}</span>;
};

export default CurrencyFormater;
