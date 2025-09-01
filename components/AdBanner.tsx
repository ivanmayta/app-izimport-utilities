import ENV_CONFIG from "@/config/env"
import React from "react"
import { StyleSheet, View } from "react-native"
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads"

interface AdBannerProps {
    style?: any
}

const AdBanner: React.FC<AdBannerProps> = ({ style }) => {
    const getBannerAdUnitId = (): string => {
        if (__DEV__) {
            return TestIds.BANNER
        }

        const productionBannerAdUnitId = ENV_CONFIG.BANNER_AD_UNIT_ID
        if (!productionBannerAdUnitId) {
            throw new Error(
                "❌ EXPO_PUBLIC_BANNER_AD_UNIT_ID no está configurado. " +
                    "Revisa tu archivo .env o variables de entorno de EAS."
            )
        }

        return productionBannerAdUnitId
    }

    const adUnitId = getBannerAdUnitId()

    return (
        <View style={[styles.container, style]}>
            <BannerAd
                unitId={adUnitId}
                size={BannerAdSize.BANNER}
                requestOptions={{
                    requestNonPersonalizedAdsOnly: false,
                }}
                onAdLoaded={() => {
                    console.log("📱 Banner cargado correctamente")
                }}
                onAdFailedToLoad={(error) => {
                    console.log("❌ Error cargando banner:", error)
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
    },
})

export default AdBanner
