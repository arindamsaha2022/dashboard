import React, { createContext, useState, useContext, useEffect } from "react";
import { mockOrders as initialOrders } from "../data/mockData";

const OrdersContext = createContext();

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("antigravity_orders");
    let loadedOrders = initialOrders;
    if (saved) {
      try {
        loadedOrders = JSON.parse(saved);
      } catch (e) {
        loadedOrders = initialOrders;
      }
    }
    
    // Ensure today's sample orders exist in the state
    const todaySampleIds = ["ORD-20261", "ORD-20262", "ORD-20263"];
    const missingSamples = initialOrders.filter(
      (o) => todaySampleIds.includes(o.id) && !loadedOrders.some((lo) => lo.id === o.id)
    );
    if (missingSamples.length > 0) {
      loadedOrders = [...loadedOrders, ...missingSamples];
    }
    
    return loadedOrders;
  });

  useEffect(() => {
    localStorage.setItem("antigravity_orders", JSON.stringify(orders));
  }, [orders]);

  const updateOrder = (id, updatedData) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, ...updatedData } : order))
    );
  };

  const addOrder = (newOrder) => {
    setOrders((prev) => [...prev, newOrder]);
  };

  const deleteOrder = (id) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
  };

  return (
    <OrdersContext.Provider value={{ orders, updateOrder, addOrder, deleteOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrdersContext);
}
