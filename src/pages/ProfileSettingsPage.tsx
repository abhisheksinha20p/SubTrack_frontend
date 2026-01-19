
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile } from '../lib/authService';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export function ProfileSettingsPage() {
    const { user, token, setUser } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        setIsLoading(true);
        try {
            const response = await updateProfile(formData, token);

            if (response.success && response.data?.user) {
                setUser(prev => prev ? { ...prev, ...response.data.user } : null);
                toast({
                    title: "Profile Updated",
                    description: "Your profile information has been saved.",
                });
            }
        } catch (error: any) {
            // If email conflict
            if (error.message && error.message.includes("409")) {
                toast({
                    title: "Update Failed",
                    description: "This email address is already in use by another account.",
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Update Failed",
                    description: error.message || "Something went wrong.",
                    variant: "destructive",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8 p-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your personal account details.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="John"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Doe"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                <p className="text-sm text-muted-foreground">
                                    Changing your email will require re-verification.
                                </p>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
