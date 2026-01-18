import { PropsWithChildren } from "react";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClientOnly } from "@/components/ClientOnly";

const queryClient = new QueryClient();

export default function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ClientOnly>
          <TooltipProvider>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </ClientOnly>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}
