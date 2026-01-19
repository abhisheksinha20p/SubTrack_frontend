import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createOrganization } from "@/lib/organizationService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner"; // Assuming sonner or similar toaster is available, checking Toaster import... 
// Actually I don't see Toaster usage in previous files, checking Layout or App. 
// I'll stick to simple state or console if toast isn't set up, but usually it is.
// I will just use standard error state for now to be safe.

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Organization name must be at least 2 characters.",
    }),
});

interface CreateOrgDialogProps {
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function CreateOrgDialog({ trigger, open, onOpenChange }: CreateOrgDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const { refreshOrganizations, switchOrganization } = useAuth();

    // Handle controlled vs uncontrolled state
    const isControlled = open !== undefined;
    const show = isControlled ? open : internalOpen;
    const setShow = isControlled ? onOpenChange : setInternalOpen;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const isLoading = form.formState.isSubmitting;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const newOrg = await createOrganization(values.name);
            await refreshOrganizations();
            switchOrganization(newOrg._id); // Auto-switch to new org

            if (setShow) setShow(false);
            form.reset();
        } catch (error: any) {
            console.error(error);
            form.setError("root", {
                message: error.message || "Failed to create organization"
            });
        }
    }

    return (
        <Dialog open={show} onOpenChange={setShow}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Organization</DialogTitle>
                    <DialogDescription>
                        Create a new workspace for your team. You will be the owner.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Organization Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Acme Inc." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {form.formState.errors.root && (
                            <div className="text-sm font-medium text-destructive">
                                {form.formState.errors.root.message}
                            </div>
                        )}

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShow && setShow(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading} variant="gradient">
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Organization
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
