import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  DollarSign,
  Clock,
  CreditCard,
  Truck,
  Package,
  CheckCircle,
  PackageCheck,
  ArrowRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { StatCard } from "../components/StatCard";
import { StatusBadge } from "../components/StatusBadge";
import { useOrders } from "../context/OrdersContext";
import { EditOrderModal } from "../components/EditOrderModal";

export function Dashboard() {
  const { orders } = useOrders();
  const [editingOrder, setEditingOrder] = useState(null);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  // Quick Stats Calculation
  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "Paid")
    .reduce((sum, o) => sum + o.amount, 0);
  const pendingOrders = orders.filter(
    (o) => o.paymentStatus === "Pending" && o.deliveryStatus === "Pending"
  ).length;
  const pendingPayments = orders.filter(
    (o) => o.paymentStatus === "Pending"
  ).length;
  const pendingDeliveries = orders.filter(
    (o) => o.deliveryStatus === "Pending"
  ).length;
  const ordersShipped = orders.filter(
    (o) => o.deliveryStatus === "Shipped"
  ).length;
  const paymentReceived = orders.filter(
    (o) => o.paymentStatus === "Paid"
  ).length;
  const deliveryCompleted = orders.filter(
    (o) => o.deliveryStatus === "Delivered"
  ).length;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Dynamic Chart Data Calculation
  
  // 1. Revenue Overview (Daily revenue of the last 7 active days ending at the latest paid order date, or today)
  const revenueByDate = {};
  orders.forEach((o) => {
    if (o.paymentStatus === "Paid") {
      const dateStr = o.date.split("T")[0]; // YYYY-MM-DD
      revenueByDate[dateStr] = (revenueByDate[dateStr] || 0) + o.amount;
    }
  });

  // Get the latest date that has a paid order, or today
  let latestRevenueDateStr = Object.keys(revenueByDate).sort().pop();
  if (!latestRevenueDateStr) {
    latestRevenueDateStr = new Date().toISOString().split("T")[0];
  }

  const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const revenueData = [];
  const latestRevDate = new Date(latestRevenueDateStr);

  for (let i = 6; i >= 0; i--) {
    const d = new Date(latestRevDate);
    d.setDate(latestRevDate.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    revenueData.push({
      name: weekdayNames[d.getDay()],
      revenue: revenueByDate[dateStr] || 0,
    });
  }

  // 2. Monthly Sales (Sales count of the last 6 months ending at the latest order's month, or current month)
  const salesByMonth = {};
  orders.forEach((o) => {
    const date = new Date(o.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    salesByMonth[key] = (salesByMonth[key] || 0) + 1;
  });

  let latestSalesMonthKey = Object.keys(salesByMonth).sort().pop();
  if (!latestSalesMonthKey) {
    const now = new Date();
    latestSalesMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlySalesData = [];
  const [latYear, latMonth] = latestSalesMonthKey.split("-").map(Number);

  for (let i = 5; i >= 0; i--) {
    const d = new Date(latYear, latMonth - 1 - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthlySalesData.push({
      name: `${monthNames[d.getMonth()]} '${String(d.getFullYear()).slice(-2)}`,
      sales: salesByMonth[key] || 0,
    });
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-3 rounded-lg border-[var(--border-color)]">
          <p className="text-[var(--text-secondary)] mb-1">{label}</p>
          <p className="font-mono text-[var(--accent-primary)] font-bold text-lg">
            {payload[0].name === "revenue"
              ? formatCurrency(payload[0].value)
              : `${payload[0].value} Orders`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-display tracking-wide mb-1">
            DASHBOARD
          </h1>
          <p className="text-[var(--text-secondary)] font-body">
            Good morning, Admin &bull; {today}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Orders" value={totalOrders} icon={ShoppingBag} trend="+12% this month" colorClass="border-[var(--accent-primary)] text-[var(--accent-primary)]" />
        <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={DollarSign} trend="+8% this month" colorClass="border-[var(--accent-primary)] text-[var(--accent-primary)]" />
        <StatCard title="Pending Orders" value={pendingOrders} icon={Clock} colorClass="border-[var(--warning)] text-[var(--warning)]" />
        <StatCard title="Pending Payments" value={pendingPayments} icon={CreditCard} colorClass="border-[var(--warning)] text-[var(--warning)]" />
        <StatCard title="Pending Deliveries" value={pendingDeliveries} icon={Truck} colorClass="border-[var(--warning)] text-[var(--warning)]" />
        <StatCard title="Orders Shipped" value={ordersShipped} icon={Package} colorClass="border-[#60A5FA] text-[#60A5FA]" />
        <StatCard title="Payment Received" value={paymentReceived} icon={CheckCircle} colorClass="border-[var(--success)] text-[var(--success)]" />
        <StatCard title="Delivery Completed" value={deliveryCompleted} icon={PackageCheck} colorClass="border-[var(--success)] text-[var(--success)]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-3 glass-panel rounded-xl p-6">
          <h2 className="text-2xl font-display tracking-wide mb-6">REVENUE OVERVIEW</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" axisLine={false} tickLine={false} />
                <YAxis stroke="var(--text-secondary)" axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 glass-panel rounded-xl p-6">
          <h2 className="text-2xl font-display tracking-wide mb-6">MONTHLY SALES</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--border-color)', opacity: 0.2 }} />
                <Bar dataKey="sales" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
          <h2 className="text-2xl font-display tracking-wide">RECENT ORDERS</h2>
          <Link to="/orders" className="flex items-center gap-2 text-sm font-semibold text-[var(--accent-primary)] hover:text-[var(--text-primary)] transition-colors border border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 px-4 py-2 rounded-lg">
            View All Orders <ArrowRight size={16} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body">
            <thead className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Order #</th>
                <th className="px-6 py-4 font-medium">Customer Name</th>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Color</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Delivery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-[var(--bg-secondary)] transition-colors duration-150">
                  <td className="px-6 py-4 font-mono text-[var(--accent-primary)]">{order.id}</td>
                  <td className="px-6 py-4 font-medium">
                    <button 
                      onClick={() => setEditingOrder(order)}
                      className="text-left hover:text-[var(--accent-primary)] transition-colors border-b border-dashed border-transparent hover:border-[var(--accent-primary)] pb-0.5"
                    >
                      {order.customerName}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-[var(--text-secondary)]">{order.orderName}</td>
                  <td className="px-6 py-4">
                    <div 
                      className="w-5 h-5 rounded-full border border-gray-500 shadow-sm"
                      style={{ backgroundColor: order.color.hex }}
                      title={order.color.name}
                    />
                  </td>
                  <td className="px-6 py-4 font-mono">{formatCurrency(order.amount)}</td>
                  <td className="px-6 py-4"><StatusBadge status={order.paymentStatus} type="payment" /></td>
                  <td className="px-6 py-4"><StatusBadge status={order.deliveryStatus} type="delivery" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EditOrderModal order={editingOrder} onClose={() => setEditingOrder(null)} />
    </div>
  );
}
