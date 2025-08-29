import { createNativeStackNavigator } from "@react-navigation/native-stack"
import ExoneradoScreen from "../screens/ExoneradoScreen"
import HomeScreen from "../screens/HomeScreen"
import SimplificadoScreen from "../screens/SimplificadoScreen"

const Stack = createNativeStackNavigator()

export default function TabNavigation() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
                name="Exonerado"
                component={ExoneradoScreen}
                options={{ title: "Proceso Exonerado" }}
            />
            <Stack.Screen
                name="Simplificado"
                component={SimplificadoScreen}
                options={{ title: "Proceso Simplificado" }}
            />
        </Stack.Navigator>
    )
}
