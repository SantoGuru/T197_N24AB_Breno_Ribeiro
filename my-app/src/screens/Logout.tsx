import { useEffect } from "react";
import { StackActions, useNavigation } from "@react-navigation/native";
import { supabase } from "@/lib/supabase";

export default function LogoutScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    async function signOut() {
      await supabase.auth.signOut();
    }

    signOut();
  }, []);

  return null;
}
