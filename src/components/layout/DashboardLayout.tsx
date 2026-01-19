import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch by rendering nothing initially

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <motion.div
        initial={false}
        animate={{ marginLeft: sidebarCollapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex flex-1 flex-col"
      >
        <Header
          showMenuButton
          onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </motion.div>
    </div>
  );
}
