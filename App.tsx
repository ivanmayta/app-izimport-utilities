import { useColorScheme } from "@/hooks/useColorScheme"
import {
    DarkTheme,
    DefaultTheme,
    NavigationContainer,
    ThemeProvider,
} from "@react-navigation/native"
import { useFonts } from "expo-font"
import { StatusBar } from "expo-status-bar"
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency"
import React, { useEffect } from "react"
import mobileAds from "react-native-google-mobile-ads"
import "react-native-reanimated"
import TabNavigation from "./navigation/TabNavigation"

export default function App() {
    const colorScheme = useColorScheme()
    const [loaded] = useFonts({
        SpaceMono: require("./assets/fonts/SpaceMono-Regular.ttf"),
    })
    const [adsLoaded, setAdsLoaded] = React.useState(false)

    useEffect(() => {
        const prepare = async () => {
            // TODO: if the ATT doesn't show up, add a small delay
            await requestTrackingPermissionsAsync()
            try {
                // Solo inicializar AdMob (sin consentimiento para Android)
                await mobileAds().initialize()
                setAdsLoaded(true)
            } catch (e) {
                console.log("error", e)
            }
        }
        void prepare()
    }, [])

    if (!loaded || !adsLoaded) {
        // Async font loading and ads initialization only occurs in development.
        return null
    }

    return (
        <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
            <NavigationContainer
                theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
                <TabNavigation />
                <StatusBar style="auto" />
            </NavigationContainer>
        </ThemeProvider>
    )
}
