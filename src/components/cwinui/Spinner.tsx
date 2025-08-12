import React from "react";

interface SpinnerProps {
  className?: string; // Custom Tailwind classes
}

const Spinner: React.FC<SpinnerProps> = ({ className = "" }) => {
  return (
    <div className="flex items-center justify-center flex-col gap-4">
      <div
        className={`inline-block animate-spin rounded-full border-t-4 border-r-4 border-b-4 border-t-transparent ${className}`}
        aria-label="Loading spinner"
      ></div>
      <p className="text-2xl">Loading..</p>
    </div>
  );
};

export default Spinner;
