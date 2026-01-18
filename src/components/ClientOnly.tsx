import { ReactNode, useEffect, useState } from "react";

interface ClientOnlyProps {
    children: ReactNode;
    fallback?: ReactNode;
}

/**
 * Prevents children from rendering during SSR.
 * Useful for portal-based components (Toasters, Tooltips) or 
 * components that rely on browser-only APIs.
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
