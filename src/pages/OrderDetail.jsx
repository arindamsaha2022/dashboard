import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  CheckCircle2,
  ShoppingCart,
  CreditCard,
  Package,
  Truck,
  Edit2
} from "lucide-react";
import { useOrders } from "../context/OrdersContext";
import { StatusBadge } from "../components/StatusBadge";
import { EditOrderModal } from "../components/EditOrderModal";
import { cn } from "../utils/cn";

export function OrderDetail() {
  const { id } = useParams();
  const { orders } = useOrders();
  const [isEditing, setIsEditing] = useState(false);
  
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-3xl font-display mb-4 text-[var(--text-secondary)]">ORDER NOT FOUND</h2>
        <Link to="/orders" className="text-[var(--accent-primary)] hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Orders
        </Link>
      </div>
    );
  }

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  const isPaid = order.paymentStatus === "Paid";
  const isShipped = order.deliveryStatus === "Shipped" || order.deliveryStatus === "Delivered";
  const isDelivered = order.deliveryStatus === "Delivered";

  const timelineSteps = [
    { id: 1, title: "Order Placed", icon: ShoppingCart, completed: true, date: formatDate(order.date) },
    { id: 2, title: "Payment Received", icon: CreditCard, completed: isPaid, date: isPaid ? formatDate(order.date) : "Pending" },
    { id: 3, title: "Order Shipped", icon: Package, completed: isShipped, date: isShipped ? "Processing" : "Pending" },
    { id: 4, title: "Delivery Completed", icon: Truck, completed: isDelivered, date: isDelivered ? "Processing" : "Pending" },
  ];

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link to="/orders" className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors mb-4 font-body">
            <ArrowLeft size={16} /> Back to Orders
          </Link>
          <h1 className="text-5xl md:text-6xl font-display tracking-wide text-[var(--text-primary)]">
            {order.id}
          </h1>
        </div>
        <button 
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 bg-[var(--bg-secondary)] hover:bg-[var(--accent-primary)] text-[var(--text-primary)] hover:text-[var(--bg-primary)] border border-[var(--border-color)] px-4 py-2 rounded-lg transition-colors font-body font-medium"
        >
          <Edit2 size={16} /> Edit Order
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="glass-panel p-6 rounded-xl flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-display tracking-wide text-[var(--text-secondary)] mb-6 border-b border-[var(--border-color)] pb-4">ORDER INFO</h2>
            <div className="space-y-4 font-body">
              <div>
                <div className="text-sm text-[var(--text-secondary)] mb-1">Product</div>
                <div className="text-xl font-medium">{order.orderName}</div>
              </div>
              <div>
                <div className="text-sm text-[var(--text-secondary)] mb-2">Color</div>
                <div className="flex items-center gap-3 bg-[var(--bg-secondary)] p-3 rounded-lg border border-[var(--border-color)] inline-flex">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-gray-500/50 shadow-inner"
                    style={{ backgroundColor: order.color.hex }}
                  />
                  <div className="text-xs text-[var(--text-secondary)] font-mono">
                    {order.color.hex.toUpperCase()}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm text-[var(--text-secondary)] mb-1">Order Date</div>
                <div>{formatDate(order.date)}</div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-[var(--border-color)]">
            <div className="text-sm text-[var(--text-secondary)] mb-1">Total Amount</div>
            <div className="text-5xl font-display tracking-wide text-[var(--accent-primary)]">
              {formatCurrency(order.amount)}
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-display tracking-wide text-[var(--text-secondary)] mb-6 border-b border-[var(--border-color)] pb-4">CUSTOMER & STATUS</h2>
            <div className="mb-6">
              <button 
                onClick={() => setIsEditing(true)}
                className="text-3xl font-medium font-body mb-2 text-left hover:text-[var(--accent-primary)] transition-colors border-b border-dashed border-transparent hover:border-[var(--accent-primary)] pb-0.5"
              >
                {order.customerName}
              </button>
              <div className="flex items-center gap-2 text-[var(--text-secondary)] bg-[var(--bg-secondary)] p-3 rounded-lg border border-[var(--border-color)] inline-flex mt-2">
                <Phone size={16} />
                <span className="font-mono">{order.phone}</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-4 bg-[var(--bg-secondary)]/50 rounded-lg border border-[var(--border-color)]">
                <span className="text-[var(--text-secondary)]">Payment Status</span>
                <StatusBadge status={order.paymentStatus} type="payment" />
              </div>
              <div className="flex items-center justify-between p-4 bg-[var(--bg-secondary)]/50 rounded-lg border border-[var(--border-color)]">
                <span className="text-[var(--text-secondary)]">Delivery Status</span>
                <StatusBadge status={order.deliveryStatus} type="delivery" />
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              {isPaid ? <CheckCircle2 className="text-[var(--success)]" size={18} /> : <div className="w-[18px] h-[18px] rounded-full border-2 border-[var(--error)] flex items-center justify-center text-[var(--error)] text-[10px] font-bold">X</div>}
              <span className={isPaid ? "text-[var(--success)]" : "text-[var(--error)]"}>Payment {isPaid ? "Received" : "Pending"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {isDelivered ? <CheckCircle2 className="text-[var(--success)]" size={18} /> : <div className="w-[18px] h-[18px] rounded-full border-2 border-[var(--error)] flex items-center justify-center text-[var(--error)] text-[10px] font-bold">X</div>}
              <span className={isDelivered ? "text-[var(--success)]" : "text-[var(--error)]"}>Delivery {isDelivered ? "Completed" : "Pending"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-xl">
        <h2 className="text-2xl font-display tracking-wide mb-8">ORDER TIMELINE</h2>
        <div className="relative font-body">
          {timelineSteps.map((step, idx) => (
            <div key={step.id} className="flex gap-6 relative">
              {idx < timelineSteps.length - 1 && (
                <div
                  className={cn("absolute left-[19px] top-[40px] bottom-[-20px] w-[2px] -ml-[1px]", step.completed ? "bg-[var(--success)]" : "bg-[var(--border-color)] dashed-border")}
                  style={!step.completed ? { backgroundImage: "linear-gradient(to bottom, var(--border-color) 50%, transparent 50%)", backgroundSize: "2px 8px", backgroundColor: "transparent" } : {}}
                />
              )}
              <div className={cn("relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 border-[var(--bg-card)] shrink-0", step.completed ? "bg-[var(--success)] text-[var(--bg-primary)]" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)]")}>
                <step.icon size={18} />
              </div>
              <div className="pb-10 pt-2 flex-1">
                <div className={cn("font-bold text-lg mb-1 transition-colors", step.completed ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]")}>{step.title}</div>
                <div className="text-sm text-[var(--text-secondary)] font-mono">{step.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isEditing && (
        <EditOrderModal order={order} onClose={() => setIsEditing(false)} />
      )}
    </div>
  );
}
