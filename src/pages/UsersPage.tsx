import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Mail,
  Shield,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { getOrganizationMembers, Member } from "@/lib/organizationService";

const statusConfig = {
  active: { variant: "success" as const, label: "Active" },
  inactive: { variant: "secondary" as const, label: "Inactive" },
  pending: { variant: "warning" as const, label: "Pending" },
};

const roleConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
  owner: { variant: "default" },
  admin: { variant: "info" },
  member: { variant: "secondary" },
  viewer: { variant: "outline" },
};

export default function UsersPage() {
  const { currentOrg, user: currentUser } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Determine permissions
  const canManageUsers = currentOrg?.role === 'owner' || currentOrg?.role === 'admin';

  useEffect(() => {
    const fetchMembers = async () => {
      if (!currentOrg?._id) return;

      try {
        setIsLoading(true);
        setError(null);
        const data = await getOrganizationMembers(currentOrg._id);
        setMembers(data);
      } catch (err: any) {
        console.error("Failed to fetch members", err);
        setError("Failed to load members. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [currentOrg?._id]);

  const filteredUsers = members.filter((member) => {
    const matchesSearch = (member.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.firstName || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!currentOrg) {
    return <div className="p-8 text-center text-muted-foreground">Please select an organization to view users.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Users</h1>
          <p className="text-muted-foreground">Manage {currentOrg.name} team members</p>
        </div>

        {canManageUsers && (
          <Button variant="gradient">
            <Plus className="mr-2 h-4 w-4" />
            Invite User
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="p-4 rounded-md bg-destructive/10 text-destructive border border-destructive/20">
          {error}
        </div>
      ) : (
        <>
          {/* Filters */}
          <Card variant="glass">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-3">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card variant="glass">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">User</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Joined</th>
                      {canManageUsers && <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                          No members found.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((member) => (
                        <tr
                          key={member._id}
                          className="border-b border-border/50 transition-colors hover:bg-secondary/30"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.email}`} />
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                  {(member.email || "U").substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-foreground">{member.firstName || member.email}</p>
                                <p className="text-sm text-muted-foreground">{member.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={roleConfig[member.role]?.variant || "secondary"}>
                              {member.role}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={statusConfig[member.status]?.variant || "secondary"}>
                              {statusConfig[member.status]?.label || member.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : 'Pending'}
                          </td>

                          {canManageUsers && (
                            <td className="px-6 py-4 text-right">
                              {/* Don't show actions for self or if trying to manage owner as admin */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Send Email
                                  </DropdownMenuItem>
                                  <DropdownMenuItem disabled={member.role === 'owner'}>
                                    <Shield className="mr-2 h-4 w-4" />
                                    Change Role
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive" disabled={member.role === 'owner'}>
                                    <UserX className="mr-2 h-4 w-4" />
                                    Remove User
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </motion.div>
  );
}
