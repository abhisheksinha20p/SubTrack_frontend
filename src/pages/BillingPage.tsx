import { motion } from "framer-motion";
import { Check, ArrowRight, CreditCard, Building2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const plans = [
  {
    id: "free",
    name: "Free",
    description: "Get started for free",
    price: { monthly: 0, yearly: 0 },
    features: [
      { name: "Up to 3 users", included: true },
      { name: "Basic analytics", included: true },
      { name: "1 project", included: true },
      { name: "Community support", included: true },
      { name: "API access", included: false },
      { name: "Priority support", included: false },
    ],
    popular: false,
    current: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growing teams",
    price: { monthly: 29, yearly: 290 },
    features: [
      { name: "Unlimited users", included: true },
      { name: "Advanced analytics", included: true },
      { name: "10 projects", included: true },
      { name: "Priority support", included: true },
      { name: "API access", included: true },
      { name: "Custom integrations", included: false },
    ],
    popular: true,
    current: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations",
    price: { monthly: 99, yearly: 990 },
    features: [
      { name: "Unlimited everything", included: true },
      { name: "Custom analytics", included: true },
      { name: "Unlimited projects", included: true },
      { name: "24/7 dedicated support", included: true },
      { name: "Advanced API", included: true },
      { name: "Custom integrations", included: true },
    ],
    popular: false,
    current: false,
  },
];

const usage = {
  users: { current: 12, limit: -1, label: "Team members" },
  projects: { current: 7, limit: 10, label: "Projects" },
  storage: { current: 2.4, limit: 5, label: "Storage (GB)" },
  apiCalls: { current: 23500, limit: 50000, label: "API Calls" },
};

const invoices = [
  { id: "INV-001", date: "Jan 1, 2024", amount: "$29.00", status: "paid" },
  { id: "INV-002", date: "Dec 1, 2023", amount: "$29.00", status: "paid" },
  { id: "INV-003", date: "Nov 1, 2023", amount: "$29.00", status: "paid" },
  { id: "INV-004", date: "Oct 1, 2023", amount: "$29.00", status: "paid" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function BillingPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and billing information</p>
      </motion.div>

      {/* Current Plan */}
      <motion.div variants={itemVariants}>
        <Card variant="gradient" className="border-primary/30">
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Zap className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-foreground">Pro Plan</h3>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <p className="text-muted-foreground">$29/month • Renews on Feb 1, 2024</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">Cancel Plan</Button>
                <Button variant="gradient">Upgrade to Enterprise</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Usage */}
      <motion.div variants={itemVariants}>
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Usage</CardTitle>
            <CardDescription>Your current usage for this billing period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {Object.entries(usage).map(([key, data]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{data.label}</span>
                    <span className="font-medium text-foreground">
                      {typeof data.current === "number" && data.current >= 1000
                        ? `${(data.current / 1000).toFixed(1)}k`
                        : data.current}
                      {data.limit > 0 && ` / ${data.limit >= 1000 ? `${data.limit / 1000}k` : data.limit}`}
                      {data.limit === -1 && " (Unlimited)"}
                    </span>
                  </div>
                  <Progress
                    value={data.limit > 0 ? (data.current / data.limit) * 100 : 100}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Plans */}
      <motion.div variants={itemVariants}>
        <h2 className="mb-4 text-xl font-semibold text-foreground">Available Plans</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              variant="interactive"
              className={cn(
                plan.popular && "border-primary/50 shadow-glow",
                plan.current && "bg-primary/5"
              )}
            >
              <CardHeader>
                {plan.popular && (
                  <Badge variant="default" className="mb-2 w-fit">Most Popular</Badge>
                )}
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold text-foreground">${plan.price.monthly}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature.name} className="flex items-center gap-2 text-sm">
                      <Check
                        className={cn(
                          "h-4 w-4",
                          feature.included ? "text-success" : "text-muted-foreground/30"
                        )}
                      />
                      <span className={cn(!feature.included && "text-muted-foreground/50")}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant={plan.current ? "secondary" : plan.popular ? "gradient" : "outline"}
                  className="w-full"
                  disabled={plan.current}
                >
                  {plan.current ? "Current Plan" : "Upgrade"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Payment Method & Invoices */}
      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2">
        {/* Payment Method */}
        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Update your billing details</CardDescription>
              </div>
              <Button variant="outline" size="sm">Update</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 rounded-lg border border-border bg-secondary/30 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-card">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">•••• •••• •••• 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/2025</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Invoices</CardTitle>
                <CardDescription>Download your past invoices</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{invoice.id}</p>
                      <p className="text-xs text-muted-foreground">{invoice.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-foreground">{invoice.amount}</span>
                    <Badge variant="success">{invoice.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
