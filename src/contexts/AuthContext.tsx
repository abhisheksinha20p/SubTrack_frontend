import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { login as apiLogin, register as apiRegister, logout as apiLogout } from "@/lib/authService";
import { getUserOrganizations, Organization } from "@/lib/organizationService";

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: any) => Promise<boolean>;
    register: (data: any) => Promise<boolean>;
    logout: () => void;
    // Organization Context
    organizations: Organization[];
    currentOrg: Organization | null;
    switchOrganization: (orgId: string) => void;
    refreshOrganizations: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    // Org State
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);

    // Helper: Load Orgs and set current
    const loadOrganizations = async () => {
        try {
            const orgs = await getUserOrganizations();
            setOrganizations(orgs);

            // Restore selected org from localStorage or default to first
            const storedOrgId = localStorage.getItem('currentOrgId');
            const foundOrg = orgs.find(o => o._id === storedOrgId);

            if (foundOrg) {
                setCurrentOrg(foundOrg);
            } else if (orgs.length > 0) {
                setCurrentOrg(orgs[0]);
                localStorage.setItem('currentOrgId', orgs[0]._id);
            } else {
                setCurrentOrg(null);
            }
        } catch (error) {
            console.error("Failed to load organizations", error);
        }
    };

    useEffect(() => {
        // Check for existing token safely on client side
        const token = localStorage.getItem("accessToken");
        const storedUser = localStorage.getItem("user");

        const initAuth = async () => {
            if (token && storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                    setIsAuthenticated(true);
                    // Load orgs if authenticated
                    await loadOrganizations();
                } catch (err) {
                    console.error("Failed to parse stored user:", err);
                    localStorage.removeItem("user");
                    localStorage.removeItem("accessToken");
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (data: any) => {
        try {
            const response = await apiLogin(data);
            if (response.success && response.data) {
                // Store token and user
                const { accessToken, refreshToken, user } = response.data;
                localStorage.setItem("accessToken", accessToken);
                if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
                localStorage.setItem("user", JSON.stringify(user));

                setUser(user);
                setIsAuthenticated(true);

                // Fetch orgs after successful login
                await loadOrganizations();

                return true;
            } else {
                throw new Error(response.message || "Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const register = async (data: any) => {
        try {
            const response = await apiRegister(data);
            if (response.success) {
                // Auto login handling if token present
                if (response.data?.accessToken) {
                    const { accessToken, refreshToken, user } = response.data;
                    localStorage.setItem("accessToken", accessToken);
                    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
                    localStorage.setItem("user", JSON.stringify(user));
                    setUser(user);
                    setIsAuthenticated(true);

                    // Create default org or load if any exists (usually empty on register unless invited)
                    // For now just load
                    await loadOrganizations();
                }
                return true;
            } else {
                throw new Error(response.message || "Registration failed");
            }
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        }
    };

    const logout = () => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            apiLogout(token).catch(console.error);
        }
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("currentOrgId"); // Clear org preference
        setUser(null);
        setOrganizations([]);
        setCurrentOrg(null);
        setIsAuthenticated(false);
    };

    const switchOrganization = (orgId: string) => {
        const org = organizations.find(o => o._id === orgId);
        if (org) {
            setCurrentOrg(org);
            localStorage.setItem('currentOrgId', org._id);
            // Optionally reload page or trigger data refresh if needed
            window.location.reload();
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isLoading,
            login,
            register,
            logout,
            organizations,
            currentOrg,
            switchOrganization,
            refreshOrganizations: loadOrganizations
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
