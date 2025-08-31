import { createNativeStackNavigator } from "@react-navigation/native-stack"
import BibliotecaScreen from "../screens/BibliotecaScreen"
import CursoScreen from "../screens/CursoScreen"
import ExoneradoScreen from "../screens/ExoneradoScreen"
import HomeScreen from "../screens/HomeScreen"
import SeguimientoScreen from "../screens/SeguimientoScreen"
import SimplificadoScreen from "../screens/SimplificadoScreen"
import VendedoresScreen from "../screens/VendedoresScreen"

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
            <Stack.Screen
                name="Vendedores"
                component={VendedoresScreen}
                options={{ title: "Vende tus productos" }}
            />
            <Stack.Screen
                name="Curso"
                component={CursoScreen}
                options={{ title: "Curso de Importación" }}
            />
            <Stack.Screen
                name="Biblioteca"
                component={BibliotecaScreen}
                options={{ title: "Biblioteca Virtual" }}
            />
            <Stack.Screen
                name="Seguimiento"
                component={SeguimientoScreen}
                options={{ title: "Seguimiento DHL" }}
            />
        </Stack.Navigator>
    )
}
