import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Bell,
  Settings,
  FileText,
  ChevronLeft,
  LogOut,
  Building2,
  Plus
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { CreateOrgDialog } from "@/components/organizations/CreateOrgDialog";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Users", path: "/users" },
  { icon: Building2, label: "Organizations", path: "/organizations" },
  { icon: CreditCard, label: "Billing", path: "/billing" },
  { icon: FileText, label: "Invoices", path: "/invoices" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, organizations, currentOrg, switchOrganization } = useAuth();
  const [showCreateOrg, setShowCreateOrg] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar"
    >
      {/* Header */}
      <div className="flex flex-col border-b border-sidebar-border px-4 py-4 gap-4">
        <div className="flex items-center justify-between">
          <Logo showText={!collapsed} />
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <motion.div
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.div>
          </Button>
        </div>

        {!collapsed && (
          <div className="w-full">
            <p className="text-xs font-medium text-muted-foreground mb-2 px-1">Organization</p>
            <Select
              value={currentOrg?._id || ""}
              onValueChange={(value) => {
                if (value === "create_new") {
                  setShowCreateOrg(true);
                } else {
                  switchOrganization(value);
                }
              }}
            >
              <SelectTrigger className="w-full bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground">
                <SelectValue placeholder="Select Org">
                  {currentOrg?.name || "Select Organization"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {organizations.map((org) => (
                  <SelectItem key={org._id} value={org._id}>
                    {org.name}
                  </SelectItem>
                ))}
                <DropdownMenuSeparator />
                <SelectItem value="create_new" className="cursor-pointer text-primary focus:text-primary">
                  <div className="flex items-center">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Organization
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <CreateOrgDialog
              open={showCreateOrg}
              onOpenChange={setShowCreateOrg}
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3 scrollbar-thin">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-sidebar-primary")} />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.span>
              )}
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 h-8 w-1 rounded-r-full bg-sidebar-primary"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-all duration-200 hover:bg-sidebar-accent hover:text-destructive"
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </motion.aside>
  );
}
