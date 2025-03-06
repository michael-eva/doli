import { createContext, useContext } from 'react';
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';

interface SuperAdminContextType {
    isJod: boolean;
    loading: boolean;
}

const SuperAdminContext = createContext<SuperAdminContextType>({
    isJod: false,
    loading: true,
});

export function SuperAdminProvider({ children }: { children: React.ReactNode }) {
    const supabase = useSupabaseClient();
    const session = useSession();

    const { data: isJod = false, isLoading: loading } = useQuery({
        queryKey: ['jodStatus', session?.user?.id],
        queryFn: async () => {
            if (!session?.user?.id) {
                return false;
            }

            const { data, error } = await supabase
                .from('members')
                .select('isJod')
                .eq('id', session.user.id)
                .single();

            if (error) {
                console.error('Error checking JoD status:', error);
                return false;
            }

            return data?.isJod ?? false;
        },
        enabled: !!session?.user?.id,
    });

    return (
        <SuperAdminContext.Provider value={{ isJod, loading }}>
            {children}
        </SuperAdminContext.Provider>
    );
}

export function useSuperAdmin() {
    const context = useContext(SuperAdminContext);
    if (context === undefined) {
        throw new Error('useSuperAdmin must be used within a SuperAdminProvider');
    }
    return context;
}
