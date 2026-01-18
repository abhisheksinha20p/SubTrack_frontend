import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen w-full">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-[800px] w-[800px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[600px] w-[600px] rounded-full bg-info/5 blur-3xl" />
      </div>

      {/* Left Side - Branding */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-primary/10 via-background to-info/10 p-12 lg:flex">
        <Logo />
        
        <div className="space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold leading-tight text-foreground"
          >
            Manage your subscriptions
            <br />
            <span className="bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
              with clarity
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-md text-lg text-muted-foreground"
          >
            Track billing, manage organizations, and gain insights into your SaaS metrics — all in one powerful dashboard.
          </motion.p>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <span>© 2024 SubTrack</span>
          <span>•</span>
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <span>•</span>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="relative flex w-full flex-col items-center justify-center px-6 lg:w-1/2 lg:px-12">
        <div className="mb-8 lg:hidden">
          <Logo />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>

          {children}
        </motion.div>
      </div>
    </div>
  );
}
