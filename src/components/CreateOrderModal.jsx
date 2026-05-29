import React, { useState } from "react";
import { X, Check } from "lucide-react";
import toast from "react-hot-toast";
import { useOrders } from "../context/OrdersContext";
import { CustomDropdown } from "./CustomDropdown";

const COLOR_OPTIONS = [
  { hex: "#0A0A0A", name: "Jet Black" },
  { hex: "#F5F5F5", name: "Chalk White" },
  { hex: "#556B2F", name: "Olive Green" },
  { hex: "#C8FF00", name: "Neon Lime" },
  { hex: "#FF3B00", name: "Safety Orange" },
];

export function CreateOrderModal({ onClose }) {
  const { addOrder } = useOrders();
  
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    orderName: "",
    amount: "",
    paymentStatus: "Pending",
    deliveryStatus: "Pending",
    colorHex: COLOR_OPTIONS[0].hex,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSave = () => {
    const newId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const colorObj = COLOR_OPTIONS.find((c) => c.hex === formData.colorHex) || COLOR_OPTIONS[0];

    addOrder({
      id: newId,
      customerName: formData.customerName || "Unknown Customer",
      phone: formData.phone || "+91 0000000000",
      orderName: formData.orderName || "Custom Order",
      amount: Number(formData.amount) || 0,
      paymentStatus: formData.paymentStatus,
      deliveryStatus: formData.deliveryStatus,
      color: colorObj,
      date: new Date().toISOString(),
    });
    
    toast.success("Order created successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-md rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
          <h2 className="text-2xl font-display tracking-wide">
            CREATE <span className="text-[var(--accent-primary)]">NEW ORDER</span>
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 font-body flex-1">
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2 uppercase tracking-wider font-bold">
              Customer Name
            </label>
            <input
              type="text"
              name="customerName"
              placeholder="e.g. Rahul Sharma"
              value={formData.customerName}
              onChange={handleChange}
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-200 text-[var(--text-primary)]"
            />
          </div>

          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2 uppercase tracking-wider font-bold">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-200 text-[var(--text-primary)] font-mono"
            />
          </div>

          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2 uppercase tracking-wider font-bold">
              Product Name
            </label>
            <input
              type="text"
              name="orderName"
              placeholder="e.g. Oversized Hoodie"
              value={formData.orderName}
              onChange={handleChange}
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-200 text-[var(--text-primary)]"
            />
          </div>

          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2 uppercase tracking-wider font-bold">
              Amount (₹)
            </label>
            <input
              type="number"
              name="amount"
              placeholder="0"
              value={formData.amount}
              onChange={handleChange}
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-200 text-[var(--text-primary)] font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2 uppercase tracking-wider font-bold">
                Payment
              </label>
              <CustomDropdown
                value={formData.paymentStatus}
                options={[
                  { value: "Paid", label: "Paid" },
                  { value: "Pending", label: "Pending" },
                  { value: "Failed", label: "Failed" },
                ]}
                onChange={(val) => handleChange({ target: { name: "paymentStatus", value: val } })}
                buttonClassName="bg-[var(--bg-secondary)] rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2 uppercase tracking-wider font-bold">
                Delivery
              </label>
              <CustomDropdown
                value={formData.deliveryStatus}
                options={[
                  { value: "Delivered", label: "Delivered" },
                  { value: "Shipped", label: "Shipped" },
                  { value: "Pending", label: "Pending" },
                  { value: "Cancelled", label: "Cancelled" },
                ]}
                onChange={(val) => handleChange({ target: { name: "deliveryStatus", value: val } })}
                buttonClassName="bg-[var(--bg-secondary)] rounded-lg px-4 py-3"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2 uppercase tracking-wider font-bold">
              Color
            </label>
            <div className="flex items-center gap-3">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => setFormData((prev) => ({ ...prev, colorHex: color.hex }))}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform ${
                    formData.colorHex === color.hex ? "scale-110 ring-2 ring-[var(--accent-primary)] ring-offset-2 ring-offset-[var(--bg-card)]" : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  {formData.colorHex === color.hex && (
                    <Check size={16} className={color.hex === "#F5F5F5" || color.hex === "#C8FF00" ? "text-black" : "text-white"} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[var(--border-color)] flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors font-bold uppercase tracking-wider"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-lg bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:bg-[var(--accent-primary)]/90 transition-colors font-bold uppercase tracking-wider"
          >
            Create Order
          </button>
        </div>
      </div>
    </div>
  );
}
