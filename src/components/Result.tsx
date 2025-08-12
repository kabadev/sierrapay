"use client";

import React from "react";
import { Skeleton } from "./ui/skeleton";

const numberClasses = {
  "0": "bg-gradient-to-br from-violet-500 to-green-600 hover:bg-green-800",
  "1": "bg-red-500 hover:bg-red-800",
  "2": "bg-green-500 hover:bg-green-800",
  "3": "bg-red-500 hover:bg-red-800",
  "4": "bg-green-500 hover:bg-green-800",
  "5": "bg-gradient-to-br from-violet-600 to-red-600 hover:bg-red-800",
  "6": "bg-green-500 hover:bg-green-800",
  "7": "bg-red-500 hover:bg-red-800",
  "8": "bg-green-500 hover:bg-green-800",
  "9": "bg-red-500 hover:bg-green-800",
} as const;

const Result = () => {
  //   violet red,violet
  return (
    <div className="absolute bg-white border  -mt-16 md:w-60 w-40 rounded-md min-h-20 right-4"></div>
  );
};

export default Result;
