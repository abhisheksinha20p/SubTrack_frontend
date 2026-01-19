import { motion } from "framer-motion";
import { Check, ArrowRight, CreditCard, Building2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getPlans, createSubscription, updateSubscription, getSubscriptions, syncSubscription, getUsage, getInvoices } from "@/lib/billingService";

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
  const { currentOrg } = useAuth();
  const location = useLocation();
  const [plans, setPlans] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [usage, setUsage] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentOrg) {
      loadPlans();
      handleSyncAndLoad();
      loadUsage();
      loadInvoices();
    }
  }, [currentOrg, location.search]);

  const handleSyncAndLoad = async () => {
    const params = new URLSearchParams(location.search);
    if (params.get('success') === 'true' && currentOrg) {
      try {
        await syncSubscription(currentOrg._id);
        window.history.replaceState({}, '', '/billing');
      } catch (e) {
        console.error("Sync failed", e);
      }
    }
    loadSubscription();
  };

  const loadUsage = async () => {
    if (!currentOrg) return;
    try {
      const res = await getUsage(currentOrg._id);
      if (res.success && res.data?.usage) {
        setUsage(res.data.usage);
      }
    } catch (err) {
      console.error("Failed to load usage", err);
    }
  };

  const loadInvoices = async () => {
    if (!currentOrg) return;
    try {
      const res = await getInvoices(currentOrg._id);
      if (res.success && res.data?.items) {
        setInvoices(res.data.items);
      }
    } catch (err) {
      console.error("Failed to load invoices", err);
    }
  };

  const loadSubscription = async () => {
    if (!currentOrg) return;
    try {
      console.log("=== Fetching subscription for org:", currentOrg._id);
      const res = await getSubscriptions(currentOrg._id);
      console.log("=== Raw API Response:", JSON.stringify(res, null, 2));
      if (res.success && res.data) {
        console.log("=== Setting subscription state:", res.data);
        console.log("=== PlanId from response:", res.data.planId);
        console.log("=== PlanId type:", typeof res.data.planId);
        if (typeof res.data.planId === 'object') {
          console.log("=== Plan Name:", res.data.planId?.name);
          console.log("=== Plan Slug:", res.data.planId?.slug);
        }
        setSubscription(res.data);
      } else {
        console.log("=== No subscription data or not success");
      }
    } catch (err) {
      console.error("Failed to load subscription", err);
    }
  };

  const loadPlans = async () => {
    try {
      const res = await getPlans();
      if (res.success) {
        setPlans(res.data);
      }
    } catch (err) {
      console.error("Failed to load plans", err);
    }
  };

  const handleUpgrade = async (plan: any) => {
    if (!currentOrg) {
      alert("Please select an organization first.");
      return;
    }

    // Check if already on this plan
    const currentPlanId = subscription?.planId?._id || subscription?.planId;
    if (currentPlanId === plan._id) {
      alert("You are already on this plan.");
      return;
    }

    setLoading(true);
    try {
      let res;

      // If user has existing paid subscription, use changePlan
      if (subscription && subscription.status === 'active') {
        res = await updateSubscription(currentOrg._id, plan._id);
        // If Stripe checkout is needed
        if (res.success && res.checkoutUrl) {
          window.location.href = res.checkoutUrl;
          return;
        }
        if (res.success) {
          alert(res.message || `Plan changed to ${plan.name}!`);
          await loadSubscription();
          await loadUsage();
          window.location.reload();
          return;
        }
      } else {
        // New subscription
        res = await createSubscription({
          organizationId: currentOrg._id,
          planId: plan._id,
          billingCycle: 'monthly',
        });

        if (res.success && res.checkoutUrl) {
          window.location.href = res.checkoutUrl;
          return;
        } else if (res.success) {
          await loadSubscription();
          await loadUsage();
          window.location.reload();
          return;
        }
      }

      alert(res.error?.message || "Failed to change subscription");
    } catch (err) {
      console.error("Upgrade failed", err);
      alert("An error occurred during upgrade.");
    } finally {
      setLoading(false);
    }
  };

  const currentPlan = subscription?.planId || plans.find(p => p.slug === 'free');
  // Plan is paid if price > 0
  const isPaid = (currentPlan?.pricing?.monthly || 0) > 0;
  // Can upgrade if not on Enterprise/Business (highest tier)
  const canUpgrade = !['enterprise', 'business'].includes(currentPlan?.slug);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Billing</h1>
            <p className="text-muted-foreground">Manage your subscription and billing information</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => loadSubscription()}>
            Refresh / Sync
          </Button>
        </div>
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
                    <h3 className="text-xl font-semibold text-foreground">{currentPlan?.name || 'Free Plan'}</h3>
                    <Badge variant={subscription?.status === 'active' ? "success" : "secondary"}>
                      {subscription?.status || 'Active'}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    ${currentPlan?.pricing?.monthly || 0}/month
                    {subscription?.currentPeriod?.end && ` • Renews on ${new Date(subscription.currentPeriod.end).toLocaleDateString()}`}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                {isPaid && (
                  <Button variant="outline" onClick={() => alert("Cancellation not implemented yet")}>Cancel Plan</Button>
                )}
                {canUpgrade && (
                  <Button
                    variant="gradient"
                    onClick={() => {
                      const enterprisePlan = plans.find((p: any) => p.slug === 'enterprise' || p.slug === 'business');
                      if (enterprisePlan) {
                        handleUpgrade(enterprisePlan);
                      }
                    }}
                    disabled={loading}
                  >
                    Upgrade to Enterprise
                  </Button>
                )}
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
            {currentPlan?.limits ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Users */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Team Members</span>
                    <span className="font-medium text-foreground">
                      {usage?.users?.used || 0}
                      {currentPlan.limits.users === -1 ? " (Unlimited)" : ` / ${currentPlan.limits.users}`}
                    </span>
                  </div>
                  <Progress value={currentPlan.limits.users > 0 ? ((usage?.users?.used || 0) / currentPlan.limits.users) * 100 : 100} className="h-2" />
                </div>
                {/* Projects */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Projects</span>
                    <span className="font-medium text-foreground">
                      {usage?.projects?.used || 0}
                      {currentPlan.limits.projects === -1 ? " (Unlimited)" : ` / ${currentPlan.limits.projects}`}
                    </span>
                  </div>
                  <Progress value={currentPlan.limits.projects > 0 ? ((usage?.projects?.used || 0) / currentPlan.limits.projects) * 100 : 100} className="h-2" />
                </div>
                {/* Storage */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Storage</span>
                    <span className="font-medium text-foreground">
                      {((usage?.storage?.used || 0) / 1024).toFixed(1)} GB
                      {currentPlan.limits.storage === -1 ? " (Unlimited)" : ` / ${(currentPlan.limits.storage / 1024).toFixed(0)} GB`}
                    </span>
                  </div>
                  <Progress value={currentPlan.limits.storage > 0 ? ((usage?.storage?.used || 0) / currentPlan.limits.storage) * 100 : 100} className="h-2" />
                </div>
                {/* API Calls */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">API Calls</span>
                    <span className="font-medium text-foreground">
                      {(usage?.apiCalls?.used || 0) >= 1000 ? `${((usage?.apiCalls?.used || 0) / 1000).toFixed(1)}k` : usage?.apiCalls?.used || 0}
                      {currentPlan.limits.apiCalls === -1 ? " (Unlimited)" : ` / ${currentPlan.limits.apiCalls >= 1000 ? `${currentPlan.limits.apiCalls / 1000}k` : currentPlan.limits.apiCalls}`}
                    </span>
                  </div>
                  <Progress value={currentPlan.limits.apiCalls > 0 ? ((usage?.apiCalls?.used || 0) / currentPlan.limits.apiCalls) * 100 : 100} className="h-2" />
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">Loading usage data...</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Plans */}
      <motion.div variants={itemVariants}>
        <h2 className="mb-4 text-xl font-semibold text-foreground">Available Plans</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan._id}
              variant="interactive"
              className={cn(
                plan.isPopular && "border-primary/50 shadow-glow"
              )}
            >
              <CardHeader>
                {plan.isPopular && (
                  <Badge variant="default" className="mb-2 w-fit">Most Popular</Badge>
                )}
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold text-foreground">${plan.pricing?.monthly ?? 0}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features?.map((feature: any) => (
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
                  variant={subscription?.planId?._id === plan._id || subscription?.planId === plan._id ? "outline" : "gradient"}
                  className="w-full"
                  onClick={() => handleUpgrade(plan)}
                  disabled={loading || subscription?.planId?._id === plan._id || subscription?.planId === plan._id}
                >
                  {subscription?.planId?._id === plan._id || subscription?.planId === plan._id ? "Current Plan" : "Upgrade"}
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
            {invoices.length > 0 ? (
              <div className="space-y-3">
                {invoices.map((invoice: any) => (
                  <div
                    key={invoice._id || invoice.id}
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                        <Building2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {invoice.invoiceNumber || invoice._id?.slice(-8)?.toUpperCase() || 'INV'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-foreground">
                        ${(invoice.amount || 0).toFixed(2)}
                      </span>
                      <Badge variant={invoice.status === 'paid' ? 'success' : 'secondary'}>
                        {invoice.status || 'pending'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No invoices yet</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
