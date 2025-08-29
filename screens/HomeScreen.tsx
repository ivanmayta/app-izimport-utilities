import { useNavigation } from "@react-navigation/native"
import { Image } from "expo-image"
import {
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native"

import ParallaxScrollView from "@/components/ParallaxScrollView"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { useExchangeRate } from "@/hooks/useExchangeRate"
import { useThemeColor } from "@/hooks/useThemeColor"

export default function HomeScreen() {
    const navigation = useNavigation()
    const { formattedRate, formattedDate, loading, error } = useExchangeRate()

    // Colores adaptativos al tema
    const textColor = useThemeColor({}, "text")
    const cardBackgroundColor = useThemeColor(
        { light: "#fff", dark: "#18181A" },
        "background"
    )
    const borderColor = useThemeColor(
        { light: "#e0e0e0", dark: "#3a3a3c" },
        "text"
    )

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: "#121b17", dark: "#121b17" }}
            headerImage={
                <ThemedView
                    style={[
                        styles.fixedExchangeContainer,
                        { backgroundColor: cardBackgroundColor },
                    ]}
                >
                    <Image
                        source={require("@/assets/images/logo.png")}
                        style={styles.logo}
                        contentFit="contain"
                    />
                    <View style={styles.fixedExchangeCard}>
                        <View style={styles.fixedExchangeRateSection}>
                            <View style={styles.fixedExchangeRateRow}>
                                <ThemedText
                                    style={[
                                        styles.fixedCurrencySymbol,
                                        { color: textColor },
                                    ]}
                                >
                                    s/
                                </ThemedText>
                                {loading ? (
                                    <ActivityIndicator
                                        size="small"
                                        color="#FF8C00"
                                    />
                                ) : (
                                    <ThemedText
                                        style={[
                                            styles.fixedExchangeRate,
                                            { color: textColor },
                                        ]}
                                    >
                                        {error ? "--" : formattedRate}
                                    </ThemedText>
                                )}
                            </View>
                            <View style={styles.fixedUsdBadge}>
                                <ThemedText style={styles.fixedUsdText}>
                                    1.00 USD
                                </ThemedText>
                            </View>
                        </View>

                        <View style={styles.fixedInfoSection}>
                            <View style={styles.fixedExchangeTypeContainer}>
                                <ThemedText
                                    style={styles.fixedExchangeTypeIcon}
                                >
                                    💰
                                </ThemedText>
                                <ThemedText
                                    style={styles.fixedExchangeTypeText}
                                >
                                    Tipo de cambio
                                </ThemedText>
                            </View>
                            <ThemedText
                                style={[
                                    styles.fixedDateText,
                                    { color: textColor },
                                ]}
                            >
                                {formattedDate}
                            </ThemedText>
                        </View>
                    </View>
                </ThemedView>
            }
        >
            <ThemedView style={styles.titleContainer}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 4,
                    }}
                >
                    <ThemedText type="title">izimport.com</ThemedText>
                    <ThemedText
                        style={{ fontSize: 14, color: "#757575" }}
                        type="title"
                    >
                        / utilidades
                    </ThemedText>
                </View>
            </ThemedView>

            <ThemedView style={styles.stepContainer}>
                <ThemedText style={{ fontSize: 14, color: "#757575" }}>
                    Cotiza tus importaciones de las siguientes modalidades:
                </ThemedText>
            </ThemedView>

            <ThemedView style={styles.cardsContainer}>
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate("Exonerado" as never)}
                >
                    <ThemedView
                        style={[
                            styles.cardContent,
                            { borderColor: borderColor },
                        ]}
                    >
                        <ThemedText
                            type="defaultSemiBold"
                            style={styles.cardTitle}
                        >
                            💰 Proceso Exonerado
                        </ThemedText>
                        <ThemedText style={styles.cardDescription}>
                            Importaciones de hasta $200 dólares. Exonerado de
                            impuestos.
                        </ThemedText>
                        <View style={styles.cardButtonContainer}>
                            <View style={styles.cardButton}>
                                <ThemedText style={styles.cardButtonText}>
                                    Calcular →
                                </ThemedText>
                            </View>
                        </View>
                    </ThemedView>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate("Simplificado" as never)}
                >
                    <ThemedView
                        style={[
                            styles.cardContent,
                            { borderColor: borderColor },
                        ]}
                    >
                        <ThemedText
                            type="defaultSemiBold"
                            style={styles.cardTitle}
                        >
                            📦 Proceso Simplificado
                        </ThemedText>
                        <ThemedText style={styles.cardDescription}>
                            Importaciones de $200 a $2000 dólares. Con aranceles
                            aplicables.
                        </ThemedText>
                        <View style={styles.cardButtonContainer}>
                            <View style={styles.cardButton}>
                                <ThemedText style={styles.cardButtonText}>
                                    Calcular →
                                </ThemedText>
                            </View>
                        </View>
                    </ThemedView>
                </TouchableOpacity>
            </ThemedView>
        </ParallaxScrollView>
    )
}

const styles = StyleSheet.create({
    // Header Section
    fixedExchangeContainer: {
        elevation: 2,
        shadowColor: "#000",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        shadowOpacity: 0.1,
    },
    logo: {
        height: 250,
        width: 320,
        bottom: -90,
        left: -90,
        position: "absolute",
        opacity: 0.4,
    },
    fixedExchangeCard: {
        flexDirection: "row",
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    fixedExchangeRateSection: {
        flex: 1,
        paddingRight: 16,
    },
    fixedExchangeRateRow: {
        flexDirection: "row",
        alignItems: "baseline",
        marginBottom: 8,
    },
    fixedCurrencySymbol: {
        fontSize: 16,
        fontWeight: "bold",
        marginRight: 6,
        marginTop: 8,
    },
    fixedExchangeRate: {
        fontSize: 32,
        fontWeight: "bold",
    },
    fixedUsdBadge: {
        backgroundColor: "#121b17",
        paddingHorizontal: 8,
        paddingVertical: 0,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#28684a",
        alignSelf: "flex-start",
    },
    fixedUsdText: {
        color: "#3dd68c",
        fontSize: 10,
        fontWeight: "bold",
    },

    // Fixed Info Section
    fixedInfoSection: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    fixedExchangeTypeContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#9E9E9E",
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginBottom: 6,
    },
    fixedExchangeTypeIcon: {
        fontSize: 12,
        marginRight: 4,
    },
    fixedExchangeTypeText: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#9E9E9E",
    },
    fixedDateText: {
        fontSize: 12,
        fontWeight: "bold",
    },

    // Content Section
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 16,
    },
    cardsContainer: {
        gap: 12,
        marginBottom: 24,
    },
    card: {
        borderRadius: 12,
        overflow: "hidden",
    },
    cardContent: {
        padding: 16,
        borderWidth: 1,
        borderRadius: 12,
        backgroundColor: "transparent",
    },
    cardTitle: {
        fontSize: 18,
        marginBottom: 8,
    },
    cardDescription: {
        fontSize: 13,
        opacity: 0.6,
    },
    cardButtonContainer: {
        alignItems: "flex-end",
    },
    cardButton: {
        paddingHorizontal: 4,
    },
    cardButtonText: {
        color: "#FF8C00",
        fontSize: 12,
        fontWeight: "500",
        opacity: 0.8,
    },
})
