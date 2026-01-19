import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield, Palette, Key, Trash2, Camera, Building } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { updateOrganization, deleteOrganization } from "@/lib/organizationService";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const notificationSettings = [
  { id: "billing", label: "Billing notifications", description: "Receive notifications about payments and invoices", email: true, push: true },
  { id: "security", label: "Security alerts", description: "Get notified about new logins and security events", email: true, push: true },
  { id: "product", label: "Product updates", description: "Stay informed about new features and updates", email: true, push: false },
  { id: "marketing", label: "Marketing emails", description: "Receive tips, offers, and promotional content", email: false, push: false },
];

export default function SettingsPage() {
  const { currentOrg, refreshOrganizations } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(notificationSettings);
  const [orgName, setOrgName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (currentOrg) {
      setOrgName(currentOrg.name);
    }
  }, [currentOrg]);

  const handleUpdateOrg = async () => {
    if (!currentOrg) return;
    setIsUpdating(true);
    try {
      await updateOrganization(currentOrg._id, { name: orgName });
      await refreshOrganizations();
      // user feedback (toast) would be good here
    } catch (error) {
      console.error("Failed to update org:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteOrg = async () => {
    if (!currentOrg) return;
    if (!confirm("Are you sure you want to delete this organization? This action cannot be undone.")) return;

    setIsUpdating(true);
    try {
      await deleteOrganization(currentOrg._id);
      await refreshOrganizations();
      navigate("/dashboard"); // Redirect after delete
    } catch (error) {
      console.error("Failed to delete org:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleNotification = (id: string, type: "email" | "push") => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, [type]: !n[type] } : n))
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          {currentOrg && ['admin', 'owner'].includes(currentOrg.role || '') && (
            <TabsTrigger value="organization" className="gap-2">
              <Building className="h-4 w-4" />
              Organization
            </TabsTrigger>
          )}
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=john" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">JD</AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground transition-colors hover:bg-primary/90">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <p className="font-medium text-foreground">Profile Photo</p>
                  <p className="text-sm text-muted-foreground">JPG, GIF or PNG. Max size 2MB.</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" type="email" defaultValue="john@acme.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="america-new_york">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america-new_york">America/New York (EST)</SelectItem>
                      <SelectItem value="america-los_angeles">America/Los Angeles (PST)</SelectItem>
                      <SelectItem value="europe-london">Europe/London (GMT)</SelectItem>
                      <SelectItem value="asia-tokyo">Asia/Tokyo (JST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="gradient">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Organization Tab */}
        <TabsContent value="organization" className="space-y-6">
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
              <CardDescription>Manage your organization details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <div className="flex gap-4">
                  <Input
                    id="orgName"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                  />
                  <Button onClick={handleUpdateOrg} disabled={isUpdating}>
                    {isUpdating ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {currentOrg?.role === 'owner' && (
            <Card variant="glass" className="border-destructive/30">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions for this organization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                  <div>
                    <p className="font-medium text-foreground">Delete Organization</p>
                    <p className="text-sm text-muted-foreground">Permanently delete {currentOrg.name} and all data</p>
                  </div>
                  <Button variant="destructive" onClick={handleDeleteOrg} disabled={isUpdating}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Organization
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex flex-col gap-4 rounded-lg border border-border/50 bg-secondary/30 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="font-medium text-foreground">{notification.label}</p>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={notification.email}
                          onCheckedChange={() => toggleNotification(notification.id, "email")}
                        />
                        <Label className="text-sm text-muted-foreground">Email</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={notification.push}
                          onCheckedChange={() => toggleNotification(notification.id, "push")}
                        />
                        <Label className="text-sm text-muted-foreground">Push</Label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Update your password regularly for security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current password</Label>
                <Input id="currentPassword" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input id="newPassword" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input id="confirmPassword" type="password" placeholder="••••••••" />
              </div>
              <Button variant="gradient">Update Password</Button>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Key className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Authenticator App</p>
                    <p className="text-sm text-muted-foreground">Not configured</p>
                  </div>
                </div>
                <Button variant="outline">Enable</Button>
              </div>
            </CardContent>
          </Card>

          <Card variant="glass" className="border-destructive/30">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible and destructive actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <div>
                  <p className="font-medium text-foreground">Delete Account</p>
                  <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                </div>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>Customize the appearance of your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <button className="flex flex-col items-center gap-3 rounded-lg border-2 border-primary p-4 transition-colors">
                  <div className="h-20 w-full rounded-lg bg-[#0f172a]" />
                  <span className="text-sm font-medium text-foreground">Dark</span>
                </button>
                <button className="flex flex-col items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:border-primary/50">
                  <div className="h-20 w-full rounded-lg bg-white border" />
                  <span className="text-sm font-medium text-foreground">Light</span>
                </button>
                <button className="flex flex-col items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:border-primary/50">
                  <div className="h-20 w-full rounded-lg bg-gradient-to-b from-white to-[#0f172a]" />
                  <span className="text-sm font-medium text-foreground">System</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
