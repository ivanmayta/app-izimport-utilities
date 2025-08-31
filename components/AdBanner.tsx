import React from "react"
import { StyleSheet, View } from "react-native"
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads"

interface AdBannerProps {
    style?: any
}

const AdBanner: React.FC<AdBannerProps> = ({ style }) => {
    const adUnitId = TestIds.BANNER // Usar Test ID para banners

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
