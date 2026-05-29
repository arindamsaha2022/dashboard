import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, X, ChevronLeft, ChevronRight, Phone, Trash2 } from "lucide-react";
import { StatusBadge } from "../components/StatusBadge";
import { useOrders } from "../context/OrdersContext";
import { EditOrderModal } from "../components/EditOrderModal";
import { CustomDropdown } from "../components/CustomDropdown";
import { cn } from "../utils/cn";

export function Orders() {
  const { orders, deleteOrder } = useOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [deliveryFilter, setDeliveryFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingOrder, setEditingOrder] = useState(null);
  const itemsPerPage = 10;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPaymentFilter("All");
    setDeliveryFilter("All");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPayment =
      paymentFilter === "All" || order.paymentStatus === paymentFilter;
    const matchesDelivery =
      deliveryFilter === "All" || order.deliveryStatus === deliveryFilter;

    let matchesDate = true;
    if (dateFrom || dateTo) {
      const orderDate = new Date(order.date).getTime();
      if (dateFrom && orderDate < new Date(dateFrom).getTime())
        matchesDate = false;
      if (dateTo && orderDate > new Date(dateTo).getTime() + 86400000)
        matchesDate = false;
    }

    return matchesSearch && matchesPayment && matchesDelivery && matchesDate;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  
  // Jump to last page on initial load
  React.useEffect(() => {
    setCurrentPage(totalPages);
  }, []);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-4xl md:text-5xl font-display tracking-wide">ALL ORDERS</h1>
        <div className="bg-[var(--accent-primary)] text-[var(--bg-primary)] px-3 py-1 rounded-full font-bold font-mono text-lg">
          {filteredOrders.length}
        </div>
      </div>

      <div className="glass-panel p-4 rounded-xl mb-8 flex flex-col lg:flex-row gap-4 items-center font-body relative z-20">
        <div className="relative flex-1 w-full z-10">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
          <input
            type="text"
            placeholder="Search by name or order #..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-200 text-[var(--text-primary)]"
          />
        </div>

        <div className="w-full lg:w-48 relative z-[20]">
          <CustomDropdown
            value={paymentFilter}
            options={[
              { value: "All", label: "All Payments" },
              { value: "Paid", label: "Paid" },
              { value: "Pending", label: "Pending" },
              { value: "Failed", label: "Failed" },
            ]}
            onChange={(val) => {
              setPaymentFilter(val);
              setCurrentPage(1);
            }}
            buttonClassName="bg-[var(--bg-primary)] rounded-lg px-4 py-2"
          />
        </div>

        <div className="w-full lg:w-48 relative z-[15]">
          <CustomDropdown
            value={deliveryFilter}
            options={[
              { value: "All", label: "All Deliveries" },
              { value: "Delivered", label: "Delivered" },
              { value: "Shipped", label: "Shipped" },
              { value: "Pending", label: "Pending" },
              { value: "Cancelled", label: "Cancelled" },
            ]}
            onChange={(val) => {
              setDeliveryFilter(val);
              setCurrentPage(1);
            }}
            buttonClassName="bg-[var(--bg-primary)] rounded-lg px-4 py-2"
          />
        </div>

        <div className="flex w-full lg:w-auto gap-2 items-center">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setCurrentPage(1);
            }}
            onClick={(e) => {
              try { e.target.showPicker(); } catch (err) {}
            }}
            className="flex-1 min-w-0 lg:w-auto bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-2 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-200 text-[var(--text-primary)] cursor-pointer"
          />
          <span className="text-[var(--text-secondary)] shrink-0">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setCurrentPage(1);
            }}
            onClick={(e) => {
              try { e.target.showPicker(); } catch (err) {}
            }}
            className="flex-1 min-w-0 lg:w-auto bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-2 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-200 text-[var(--text-primary)] cursor-pointer"
          />
        </div>

        <button
          onClick={clearFilters}
          className="w-full lg:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors border border-transparent"
        >
          <X size={18} /> Clear
        </button>
      </div>

      <div className="hidden sm:block glass-panel rounded-xl overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body">
            <thead className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-sm sticky top-0">
              <tr>
                <th className="px-6 py-4 font-medium">Order #</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Delivery</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-[var(--text-secondary)]">
                    No orders found matching your filters.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order, idx) => (
                  <tr
                    key={order.id}
                    className={cn(
                      "hover:bg-[var(--bg-secondary)] transition-colors duration-150 group",
                      idx % 2 === 0 ? "bg-transparent" : "bg-[var(--bg-secondary)]/30"
                    )}
                  >
                    <td className="px-6 py-4 font-mono text-[var(--accent-primary)]">{order.id}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setEditingOrder(order)}
                        className="font-medium text-left hover:text-[var(--accent-primary)] transition-colors border-b border-dashed border-transparent hover:border-[var(--accent-primary)] pb-0.5"
                      >
                        {order.customerName}
                      </button>
                      <div className="text-xs text-[var(--text-secondary)] mt-1 flex items-center gap-1">
                        <Phone size={12} /> {order.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[var(--text-primary)] flex items-center gap-2">
                        <span>{order.orderName}</span>
                        <div
                          className="w-4 h-4 rounded-full border border-gray-500 shadow-sm"
                          style={{ backgroundColor: order.color.hex }}
                          title={order.color.name}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{formatDate(order.date)}</td>
                    <td className="px-6 py-4 font-mono font-medium">{formatCurrency(order.amount)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.paymentStatus} type="payment" />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.deliveryStatus} type="delivery" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/orders/${order.id}`}
                          className="inline-block px-4 py-2 border border-[var(--accent-primary)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] rounded-lg transition-colors font-medium text-sm"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="p-2 text-[var(--text-secondary)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 rounded-lg transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="sm:hidden space-y-4 mb-6">
        {paginatedOrders.length === 0 ? (
          <div className="glass-panel p-8 text-center rounded-xl text-[var(--text-secondary)]">
            No orders found matching your filters.
          </div>
        ) : (
          paginatedOrders.map((order) => (
            <div key={order.id} className="glass-panel rounded-xl p-5 relative">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="font-mono text-[var(--accent-primary)] text-lg mb-1">{order.id}</div>
                  <button 
                    onClick={() => setEditingOrder(order)}
                    className="font-medium text-lg text-left hover:text-[var(--accent-primary)] transition-colors border-b border-dashed border-transparent hover:border-[var(--accent-primary)] pb-0.5"
                  >
                    {order.customerName}
                  </button>
                  <div className="text-sm text-[var(--text-secondary)] mt-1 flex items-center gap-1">
                    <Phone size={14} /> {order.phone}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-xl">{formatCurrency(order.amount)}</div>
                  <div className="text-xs text-[var(--text-secondary)]">{formatDate(order.date)}</div>
                </div>
              </div>

              <div className="bg-[var(--bg-secondary)] rounded-lg p-3 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="font-medium">{order.orderName}</div>
                  <div
                    className="w-4 h-4 rounded-full border border-gray-500 shadow-sm"
                    style={{ backgroundColor: order.color.hex }}
                    title={order.color.name}
                  />
                </div>
              </div>

              <div className="flex gap-2 mb-6">
                <StatusBadge status={order.paymentStatus} type="payment" />
                <StatusBadge status={order.deliveryStatus} type="delivery" />
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/orders/${order.id}`}
                  className="flex-1 text-center px-4 py-3 bg-[var(--accent-primary)] text-[var(--bg-primary)] rounded-lg font-bold transition-transform hover:scale-[1.02]"
                >
                  View Details
                </Link>
                <button
                  onClick={() => deleteOrder(order.id)}
                  className="px-4 py-3 bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 rounded-lg transition-colors border border-[var(--border-color)]"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {filteredOrders.length > 0 && (
        <div className="flex items-center justify-between font-body text-sm">
          <div className="text-[var(--text-secondary)]">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="px-4 py-2 rounded-lg bg-[var(--bg-secondary)] font-medium">
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      <EditOrderModal order={editingOrder} onClose={() => setEditingOrder(null)} />
    </div>
  );
}
