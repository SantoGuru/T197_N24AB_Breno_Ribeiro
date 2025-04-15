import { supabase } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useEffect } from "react";

async function fetchUser() {
    const { data } = await supabase.auth.getSession();
    return data.session?.user ?? null
}

export function useAuth() {
    const queryClient = useQueryClient();
    const { data: user, isLoading } = useQuery({
        queryKey: ['user'],
        queryFn: fetchUser,
        initialData: null,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    })

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            queryClient.invalidateQueries({
                queryKey: ['user'],
            });
        });

        return () => {
            listener?.subscription.unsubscribe();
        }
    },[queryClient]);

    return { user, loading: isLoading };
}