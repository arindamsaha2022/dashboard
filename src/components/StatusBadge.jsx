import React from "react";
import { cn } from "../utils/cn";

export function StatusBadge({ status, type }) {
  const isPayment = type === "payment";

  let styles = "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ";

  if (isPayment) {
    switch (status) {
      case "Paid":
        styles += "bg-[#00FF87]/10 text-[#00FF87]";
        break;
      case "Pending":
        styles += "bg-[#FFB800]/10 text-[#FFB800]";
        break;
      case "Failed":
        styles += "bg-[#FF3B00]/10 text-[#FF3B00]";
        break;
      default:
        styles += "bg-gray-500/10 text-gray-500";
    }
  } else {
    // Delivery Status
    switch (status) {
      case "Delivered":
        styles += "bg-[#00FF87]/10 text-[#00FF87]";
        break;
      case "Shipped":
        styles += "bg-[#60A5FA]/10 text-[#60A5FA]";
        break;
      case "Pending":
        styles += "bg-[#FFB800]/10 text-[#FFB800]";
        break;
      case "Cancelled":
        styles += "bg-[#FF3B00]/10 text-[#FF3B00]";
        break;
      default:
        styles += "bg-gray-500/10 text-gray-500";
    }
  }

  return <span className={cn(styles)}>{status}</span>;
}
