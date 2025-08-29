import { useColorScheme } from "@/hooks/useColorScheme"
import {
    DarkTheme,
    DefaultTheme,
    NavigationContainer,
} from "@react-navigation/native"
import { useFonts } from "expo-font"
import { StatusBar } from "expo-status-bar"
import "react-native-reanimated"
import TabNavigation from "./navigation/TabNavigation"

export default function App() {
    const colorScheme = useColorScheme()
    const [loaded] = useFonts({
        SpaceMono: require("./assets/fonts/SpaceMono-Regular.ttf"),
    })

    if (!loaded) {
        // Async font loading only occurs in development.
        return null
    }

    return (
        <NavigationContainer
            theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
            <TabNavigation />
            <StatusBar style="auto" />
        </NavigationContainer>
    )
}
