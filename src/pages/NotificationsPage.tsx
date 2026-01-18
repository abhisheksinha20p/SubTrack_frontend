import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Bell, 
  Check, 
  Trash2, 
  Filter,
  CreditCard,
  Shield,
  Package,
  MessageSquare,
  CheckCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const notifications = [
  {
    id: 1,
    type: "billing",
    title: "Payment Successful",
    message: "Your payment of $29.00 was processed successfully.",
    time: "2 minutes ago",
    read: false,
    icon: CreditCard,
  },
  {
    id: 2,
    type: "security",
    title: "New Login Detected",
    message: "A new login was detected from Chrome on Windows.",
    time: "15 minutes ago",
    read: false,
    icon: Shield,
  },
  {
    id: 3,
    type: "product",
    title: "New Feature Available",
    message: "Check out our new analytics dashboard with real-time metrics.",
    time: "1 hour ago",
    read: true,
    icon: Package,
  },
  {
    id: 4,
    type: "billing",
    title: "Invoice Ready",
    message: "Your January 2024 invoice is now available for download.",
    time: "3 hours ago",
    read: true,
    icon: CreditCard,
  },
  {
    id: 5,
    type: "security",
    title: "Password Changed",
    message: "Your password was successfully changed.",
    time: "1 day ago",
    read: true,
    icon: Shield,
  },
  {
    id: 6,
    type: "product",
    title: "Welcome to SubTrack",
    message: "Thanks for signing up! Get started by exploring the dashboard.",
    time: "2 days ago",
    read: true,
    icon: MessageSquare,
  },
];

const typeConfig = {
  billing: { label: "Billing", color: "text-info" },
  security: { label: "Security", color: "text-warning" },
  product: { label: "Product", color: "text-primary" },
};

export default function NotificationsPage() {
  const [notificationList, setNotificationList] = useState(notifications);
  const unreadCount = notificationList.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotificationList(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotificationList(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotificationList(prev => prev.filter(n => n.id !== id));
  };

  const [preferences, setPreferences] = useState<any>({
    channels: { email: true, inApp: true, push: false },
    categories: {
      billing: { email: true, inApp: true },
      security: { email: true, inApp: true },
      product: { email: true, inApp: true },
    },
  });

  const handleChannelToggle = (channel: string) => {
    setPreferences((prev: any) => ({
      ...prev,
      channels: { ...prev.channels, [channel]: !prev.channels[channel] }
    }));
  };

  const handleCategoryToggle = (category: string, channel: string) => {
    setPreferences((prev: any) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: {
          ...prev.categories[category],
          [channel]: !prev.categories[category][channel]
        }
      }
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : "You're all caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="all" className="gap-2">
            All
            {notificationList.length > 0 && (
              <Badge variant="secondary" className="ml-1">{notificationList.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread" className="gap-2">
            Unread
            {unreadCount > 0 && (
              <Badge variant="default" className="ml-1">{unreadCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {notificationList.length === 0 ? (
            <Card variant="glass">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Bell className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">No notifications</h3>
                <p className="text-muted-foreground">You're all caught up!</p>
              </CardContent>
            </Card>
          ) : (
            notificationList.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={() => markAsRead(notification.id)}
                onDelete={() => deleteNotification(notification.id)}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          {notificationList.filter(n => !n.read).map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkAsRead={() => markAsRead(notification.id)}
              onDelete={() => deleteNotification(notification.id)}
            />
          ))}
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          {notificationList.filter(n => n.type === "billing").map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkAsRead={() => markAsRead(notification.id)}
              onDelete={() => deleteNotification(notification.id)}
            />
          ))}
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          {notificationList.filter(n => n.type === "security").map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkAsRead={() => markAsRead(notification.id)}
              onDelete={() => deleteNotification(notification.id)}
            />
          ))}
        </TabsContent>

        <TabsContent value="preferences">
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Channels</h3>
                <div className="space-y-2">
                  {Object.entries(preferences.channels).map(([channel, enabled]: any) => (
                    <label key={channel} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={() => handleChannelToggle(channel)}
                        className="rounded border-input bg-background/50"
                      />
                      <span className="capitalize">{channel.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Categories</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(preferences.categories).map(([category, settings]: any) => (
                    <div key={category} className="rounded-lg border bg-card/50 p-4">
                      <p className="font-medium capitalize mb-3 text-primary">{category}</p>
                      <div className="space-y-2">
                        {Object.entries(settings).map(([channel, enabled]: any) => (
                          <label key={channel} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={enabled}
                              onChange={() => handleCategoryToggle(category, channel)}
                              className="rounded border-input bg-background/50"
                            />
                            <span className="capitalize text-sm">{channel.replace(/([A-Z])/g, ' $1').trim()}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

interface NotificationCardProps {
  notification: typeof notifications[0];
  onMarkAsRead: () => void;
  onDelete: () => void;
}

function NotificationCard({ notification, onMarkAsRead, onDelete }: NotificationCardProps) {
  const config = typeConfig[notification.type as keyof typeof typeConfig];
  const Icon = notification.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Card
        variant="interactive"
        className={cn(
          "transition-all",
          !notification.read && "border-l-4 border-l-primary bg-primary/5"
        )}
      >
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className={cn("flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-secondary", config.color)}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{notification.title}</p>
                    {!notification.read && (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{notification.time}</p>
                </div>
                <div className="flex items-center gap-1">
                  {!notification.read && (
                    <Button variant="ghost" size="icon" onClick={onMarkAsRead}>
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={onDelete}>
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
