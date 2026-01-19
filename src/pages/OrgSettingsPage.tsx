
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Trash2, AlertTriangle, Save } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import {
    updateOrganization,
    deleteOrganization
} from "../lib/organizationService";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "../components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Skeleton } from "../components/ui/skeleton";

interface RenameOrgForm {
    name: string;
}

export default function OrgSettingsPage() {
    const { user, currentOrg, refreshOrganizations: loadOrganizations, switchOrganization } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteConfirmName, setDeleteConfirmName] = useState("");

    const { register, handleSubmit, reset, formState: { errors } } = useForm<RenameOrgForm>();

    useEffect(() => {
        if (currentOrg) {
            reset({ name: currentOrg.name });
        }
    }, [currentOrg, reset]);

    // Check if user is owner
    const isOwner = currentOrg?.role === 'owner';

    if (!currentOrg) {
        return <div className="p-8"><Skeleton className="h-[400px] w-full" /></div>;
    }

    // Handle Rename
    const onRename = async (data: RenameOrgForm) => {
        try {
            setLoading(true);
            await updateOrganization(currentOrg._id, { name: data.name });
            toast.success("Organization renamed successfully");
            await loadOrganizations(); // Refresh list
        } catch (error: any) {
            toast.error(error.message || "Failed to rename organization");
        } finally {
            setLoading(false);
        }
    };

    // Handle Delete
    const onDelete = async () => {
        if (deleteConfirmName !== currentOrg.name) {
            toast.error("Organization name does not match");
            return;
        }

        try {
            setLoading(true);
            await deleteOrganization(currentOrg._id);
            toast.success("Organization deleted");
            setDeleteModalOpen(false);

            // Load user's orgs again. If none, it might redirect to create org or getting started
            // We'll rely on loadOrganizations and OrganizationContext to handle switching
            await loadOrganizations();
            navigate("/");
        } catch (error: any) {
            toast.error(error.message || "Failed to delete organization");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Organization Settings</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your organization profile and danger zone settings.
                </p>
            </div>

            {/* General Settings */}
            <Card variant="glass">
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Update your organization's public information.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="rename-form" onSubmit={handleSubmit(onRename)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Organization Name</Label>
                            <Input
                                id="name"
                                disabled={!isOwner || loading}
                                {...register("name", { required: "Name is required" })}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">{errors.name.message}</p>
                            )}
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="border-t border-border/50 bg-secondary/20 px-6 py-4">
                    <Button
                        form="rename-form"
                        type="submit"
                        variant="gradient"
                        disabled={!isOwner || loading}
                        size="sm"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </CardFooter>
            </Card>

            {/* Danger Zone */}
            {isOwner && (
                <Card className="border-destructive/30 bg-destructive/5 overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-destructive">Danger Zone</CardTitle>
                        <CardDescription>
                            Irreversible actions that affect your organization.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive mb-6">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Warning</AlertTitle>
                            <AlertDescription>
                                Deleting this organization will permanently remove all associated data, including members, projects, and billing history. This action cannot be undone.
                            </AlertDescription>
                        </Alert>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-foreground">Delete Organization</p>
                                <p className="text-sm text-muted-foreground">
                                    Permanently delete this organization and all its data.
                                </p>
                            </div>
                            <Button
                                variant="destructive"
                                onClick={() => setDeleteModalOpen(true)}
                            >
                                Delete Organization
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Organization</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. Please type <span className="font-bold text-foreground">{currentOrg.name}</span> to confirm.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <Label htmlFor="confirm-name">Organization Name</Label>
                        <Input
                            id="confirm-name"
                            value={deleteConfirmName}
                            onChange={(e) => setDeleteConfirmName(e.target.value)}
                            placeholder="Type organization name"
                        />
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                        <Button
                            variant="destructive"
                            onClick={onDelete}
                            disabled={deleteConfirmName !== currentOrg.name || loading}
                        >
                            {loading ? "Deleting..." : "Delete Permanently"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
