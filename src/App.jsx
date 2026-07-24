import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Plus } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { Sidebar } from "./components/Sidebar";
import { BottomNav } from "./components/BottomNav";
import { Dashboard } from "./pages/Dashboard";
import { Orders } from "./pages/Orders";
import { OrderDetail } from "./pages/OrderDetail";
import { OrdersProvider } from "./context/OrdersContext";
import { CreateOrderModal } from "./components/CreateOrderModal";

function AppContent() {
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem("trakFly_theme");
      return savedTheme ? savedTheme : "dark";
    } catch (e) {
      return "dark";
    }
  });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    try { localStorage.setItem("trakFly_theme", theme); } catch (e) { /* ignore */ }
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-body transition-colors duration-300 pb-24 md:pb-0 relative">
      <Sidebar theme={theme} toggleTheme={toggleTheme} />
      
      <div className="md:ml-[240px] flex flex-col min-h-screen transition-all duration-300 relative">
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            {/* Stubs */}
            <Route path="/customers" element={<div className="text-center mt-20 text-[var(--text-secondary)]"><h1 className="text-4xl font-display">CUSTOMERS</h1><p>Coming Soon</p></div>} />
            <Route path="/reports" element={<div className="text-center mt-20 text-[var(--text-secondary)]"><h1 className="text-4xl font-display">REPORTS</h1><p>Coming Soon</p></div>} />
            <Route path="/settings" element={<div className="text-center mt-20 text-[var(--text-secondary)]"><h1 className="text-4xl font-display">SETTINGS</h1><p>Coming Soon</p></div>} />
          </Routes>
        </main>
      </div>

      <BottomNav theme={theme} toggleTheme={toggleTheme} />

      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            fontFamily: 'inherit',
            fontWeight: 'bold',
          },
          success: {
            iconTheme: {
              primary: 'var(--success)',
              secondary: 'var(--bg-secondary)',
            },
          },
        }} 
      />

      {/* Floating Action Button */}
      <button
        onClick={() => setIsCreating(true)}
        className="fixed bottom-[80px] md:bottom-8 right-4 md:right-8 w-14 h-14 bg-[var(--accent-primary)] text-[var(--bg-primary)] rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform z-40"
      >
        <Plus size={28} />
      </button>

      {isCreating && <CreateOrderModal onClose={() => setIsCreating(false)} />}
    </div>
  );
}

function App() {
  return (
    <OrdersProvider>
      <Router>
        <AppContent />
      </Router>
    </OrdersProvider>
  );
}

export default App;
