import { useEffect } from "react";
import { StackActions, useNavigation } from "@react-navigation/native";

export default function LogoutScreen(){
    const navigation = useNavigation();

    useEffect(() => {
        navigation.dispatch(
            StackActions.replace('Login')
        )
    }, []);

    return null;
}