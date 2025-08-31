import React, { useCallback, useEffect, useState } from "react"
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"

import AdBanner from "@/components/AdBanner"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { useThemeColor } from "@/hooks/useThemeColor"
import { Feather, MaterialIcons } from "@expo/vector-icons"

interface TrackingEvent {
    timestamp: string
    statusCode: string
    description: string
    location?: {
        address?: {
            addressLocality?: string
            countryCode?: string
        }
    }
}

interface LocationInfo {
    address: {
        countryCode: string
        addressLocality: string
    }
}

interface ShipmentStatus {
    timestamp: string
    statusCode: string
    status?: string
    description: string
    location?: {
        address: {
            addressLocality: string
        }
    }
}

interface Reference {
    number: string
    type: string
}

interface DgfLocation {
    "dgf:locationName": string
}

interface DgfRoute {
    "dgf:placeOfAcceptance": DgfLocation
    "dgf:portOfLoading": DgfLocation
    "dgf:portOfUnloading": DgfLocation
    "dgf:placeOfDelivery": DgfLocation
}

interface ShipmentDetails {
    carrier?: {
        "@type": string
        organizationName: string
    }
    proofOfDeliverySignedAvailable?: boolean
    totalNumberOfPieces?: number
    references?: Reference[]
    "dgf:routes"?: DgfRoute[]
    // Campos adicionales para compatibilidad con respuesta anterior
    product?: {
        productName?: string
    }
    weight?: {
        unitText?: string
        value?: number
    }
    volume?: {
        unitText?: string
        value?: number
    }
    dimensions?: {
        height?: { unitText?: string; value?: number }
        length?: { unitText?: string; value?: number }
        width?: { unitText?: string; value?: number }
    }
}

interface Shipment {
    id: string
    service?: string
    origin?: LocationInfo
    destination?: LocationInfo
    status: ShipmentStatus
    details?: ShipmentDetails
    events: TrackingEvent[]
    // Campos adicionales para compatibilidad
    division?: string
    estimatedTimeOfDelivery?: string
    serviceUrl?: string
}

interface ApiResponse {
    shipments: Shipment[]
    url?: string
    firstUrl?: string
    prevUrl?: string
    nextUrl?: string
    lastUrl?: string
}

export default function SeguimientoScreen({
    route,
}: {
    route?: { params?: { trackingNumber?: string } }
}) {
    const [trackingNumber, setTrackingNumber] = useState(
        route?.params?.trackingNumber || ""
    )
    const [loading, setLoading] = useState(false)
    const [shipmentData, setShipmentData] = useState<Shipment | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [detailsExpanded, setDetailsExpanded] = useState(false)

    const textColor = useThemeColor({}, "text")
    const cardBackgroundColor = useThemeColor(
        { light: "#fff", dark: "#18181A" },
        "background"
    )
    const borderColor = useThemeColor(
        { light: "#e0e0e0", dark: "#3a3a3c" },
        "text"
    )

    const API_BASE_URL = "https://izimport.com"

    const getCountryName = (countryCode?: string): string | null => {
        if (!countryCode || typeof countryCode !== "string") {
            return null
        }

        const countryNames: { [key: string]: string } = {
            GB: "Reino Unido",
            US: "Estados Unidos",
            PE: "Perú",
            DE: "Alemania",
            FR: "Francia",
            ES: "España",
            IT: "Italia",
            BR: "Brasil",
            AR: "Argentina",
            CL: "Chile",
            CO: "Colombia",
            MX: "México",
            CA: "Canadá",
            AU: "Australia",
            JP: "Japón",
            CN: "China",
            KR: "Corea del Sur",
            IN: "India",
            NL: "Países Bajos",
            BE: "Bélgica",
            CH: "Suiza",
            AT: "Austria",
            SE: "Suecia",
            NO: "Noruega",
            DK: "Dinamarca",
            FI: "Finlandia",
            PL: "Polonia",
            CZ: "República Checa",
            HU: "Hungría",
            RO: "Rumania",
            BG: "Bulgaria",
            HR: "Croacia",
            SI: "Eslovenia",
            SK: "Eslovaquia",
            EE: "Estonia",
            LV: "Letonia",
            LT: "Lituania",
            PT: "Portugal",
            IE: "Irlanda",
            GR: "Grecia",
            CY: "Chipre",
            MT: "Malta",
            LU: "Luxemburgo",
        }

        const upperCode = countryCode.toUpperCase()
        return countryNames[upperCode] || countryCode
    }

    const handleTrackShipment = useCallback(async () => {
        if (!trackingNumber.trim()) {
            Alert.alert("Error", "Por favor ingresa un número de seguimiento")
            return
        }

        setLoading(true)
        setError(null)
        setShipmentData(null)

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/shipment?trackingNumber=${encodeURIComponent(
                    trackingNumber.trim()
                )}`
            )

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("Número de seguimiento no encontrado")
                } else if (response.status >= 500) {
                    throw new Error("Error del servidor. Intenta más tarde")
                } else {
                    throw new Error(`Error HTTP: ${response.status}`)
                }
            }

            const data: ApiResponse = await response.json()

            if (!data.shipments || data.shipments.length === 0) {
                throw new Error(
                    "No se encontraron datos para este número de seguimiento"
                )
            }

            // Tomar el primer envío de la respuesta
            const shipment = data.shipments[0]
            setShipmentData(shipment)
        } catch (error) {
            console.error("Error al rastrear envío:", error)

            let errorMessage = "Error desconocido"
            if (error instanceof Error) {
                errorMessage = error.message
            }

            setError(errorMessage)
            Alert.alert("Error al rastrear envío", errorMessage, [
                { text: "OK" },
            ])
        } finally {
            setLoading(false)
        }
    }, [trackingNumber])

    const handleRefresh = () => {
        if (shipmentData && trackingNumber) {
            handleTrackShipment()
        }
    }

    const formatDate = (timestamp: string) => {
        try {
            if (!timestamp) return "Fecha no disponible"

            const date = new Date(timestamp)

            // Verificar si la fecha es válida
            if (isNaN(date.getTime())) {
                return "Fecha inválida"
            }

            return date.toLocaleString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
                timeZoneName: "short",
            })
        } catch (error) {
            console.warn("Error formateando fecha:", error)
            return "Error al formatear fecha"
        }
    }

    // Buscar automáticamente solo al montar el componente si llega con un número
    useEffect(() => {
        const initialTrackingNumber = route?.params?.trackingNumber
        if (initialTrackingNumber && initialTrackingNumber.trim()) {
            // Llamar la función de búsqueda directamente con el número inicial
            handleInitialSearch(initialTrackingNumber.trim())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // Solo ejecutar una vez al montar, sin dependencias para evitar búsquedas repetidas

    const handleInitialSearch = async (number: string) => {
        setLoading(true)
        setError(null)
        setShipmentData(null)

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/shipment?trackingNumber=${encodeURIComponent(
                    number
                )}`
            )

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("Número de seguimiento no encontrado")
                } else if (response.status >= 500) {
                    throw new Error("Error del servidor. Intenta más tarde")
                } else {
                    throw new Error(`Error HTTP: ${response.status}`)
                }
            }

            const data: ApiResponse = await response.json()

            if (!data.shipments || data.shipments.length === 0) {
                throw new Error(
                    "No se encontraron datos para este número de seguimiento"
                )
            }

            const shipment = data.shipments[0]
            setShipmentData(shipment)
        } catch (error) {
            console.error("Error al rastrear envío:", error)

            let errorMessage = "Error desconocido"
            if (error instanceof Error) {
                errorMessage = error.message
            }

            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <ThemedView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Banner */}
                <AdBanner />

                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <MaterialIcons
                            name="local-shipping"
                            size={32}
                            color="#FF8C00"
                            style={styles.titleIcon}
                        />
                        <ThemedText
                            style={[styles.title, { color: textColor }]}
                        >
                            Seguimiento DHL
                        </ThemedText>
                    </View>
                    <ThemedText style={[styles.subtitle, { color: textColor }]}>
                        Rastrea tus envíos internacionales en tiempo real
                    </ThemedText>
                </View>

                {/* Input de seguimiento */}
                <View
                    style={[
                        styles.searchCard,
                        { backgroundColor: cardBackgroundColor, borderColor },
                    ]}
                >
                    <ThemedText
                        style={[styles.searchTitle, { color: textColor }]}
                    >
                        Número de seguimiento
                    </ThemedText>

                    <View style={[styles.inputContainer, { borderColor }]}>
                        <TextInput
                            style={[styles.trackingInput, { color: textColor }]}
                            placeholder="Ej: 1234567890"
                            placeholderTextColor="#999"
                            value={trackingNumber}
                            onChangeText={setTrackingNumber}
                            autoCapitalize="characters"
                            autoCorrect={false}
                        />
                        <TouchableOpacity
                            style={styles.searchButton}
                            onPress={handleTrackShipment}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <MaterialIcons
                                    name="search"
                                    size={24}
                                    color="#fff"
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Resultado del seguimiento */}
                {shipmentData && (
                    <>
                        {/* Estado principal */}
                        <View
                            style={[
                                styles.statusCard,
                                {
                                    backgroundColor: cardBackgroundColor,
                                    borderColor,
                                },
                            ]}
                        >
                            <View style={styles.statusHeader}>
                                <View style={styles.statusInfo}>
                                    <ThemedText
                                        style={[
                                            styles.statusTitle,
                                            { color: textColor },
                                        ]}
                                    >
                                        {shipmentData.status?.status ||
                                            shipmentData.status?.description ||
                                            "Estado desconocido"}
                                    </ThemedText>
                                    <ThemedText style={styles.trackingCode}>
                                        Código de Rastreo:{" "}
                                        {shipmentData.id
                                            ?.split?.("")
                                            .join(" ") || "N/A"}
                                    </ThemedText>
                                    {shipmentData.status?.timestamp && (
                                        <ThemedText style={styles.statusDate}>
                                            {formatDate(
                                                shipmentData.status.timestamp
                                            )}
                                        </ThemedText>
                                    )}
                                </View>
                                <TouchableOpacity
                                    style={[
                                        styles.refreshButton,
                                        { borderColor },
                                    ]}
                                    onPress={handleRefresh}
                                >
                                    <Feather
                                        name="refresh-cw"
                                        size={16}
                                        color={textColor}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Ruta origen-destino */}
                            <View style={styles.routeContainer}>
                                <View style={styles.routeLayout}>
                                    {/* Origen - lado izquierdo */}
                                    <View style={styles.originContainer}>
                                        <ThemedText style={styles.routeLabel}>
                                            Origen
                                        </ThemedText>
                                        <ThemedText
                                            style={[
                                                styles.routeLocation,
                                                { color: textColor },
                                            ]}
                                        >
                                            {shipmentData.origin?.address
                                                ?.addressLocality ||
                                                getCountryName(
                                                    shipmentData.origin?.address
                                                        ?.countryCode
                                                ) ||
                                                "No especificado"}
                                        </ThemedText>
                                    </View>

                                    {/* Avión centrado */}
                                    <View style={styles.planeContainer}>
                                        <MaterialIcons
                                            name="flight"
                                            size={28}
                                            color="#FF8C00"
                                        />
                                    </View>

                                    {/* Destino - lado derecho */}
                                    <View style={styles.destinationContainer}>
                                        <ThemedText style={styles.routeLabel}>
                                            Destino
                                        </ThemedText>
                                        <ThemedText
                                            style={[
                                                styles.routeLocation,
                                                { color: textColor },
                                            ]}
                                        >
                                            {shipmentData.destination?.address
                                                ?.addressLocality ||
                                                getCountryName(
                                                    shipmentData.destination
                                                        ?.address?.countryCode
                                                ) ||
                                                "No especificado"}
                                        </ThemedText>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Más Detalles del Embarque - Desplegable */}
                        {shipmentData.details && (
                            <View
                                style={[
                                    styles.detailsCard,
                                    {
                                        backgroundColor: cardBackgroundColor,
                                        borderColor,
                                    },
                                ]}
                            >
                                <TouchableOpacity
                                    style={styles.detailsHeader}
                                    onPress={() =>
                                        setDetailsExpanded(!detailsExpanded)
                                    }
                                >
                                    <ThemedText
                                        style={[
                                            styles.detailsTitle,
                                            { color: textColor },
                                        ]}
                                    >
                                        Más Detalles del Embarque
                                    </ThemedText>
                                    <MaterialIcons
                                        name={
                                            detailsExpanded
                                                ? "keyboard-arrow-up"
                                                : "keyboard-arrow-down"
                                        }
                                        size={24}
                                        color={textColor}
                                    />
                                </TouchableOpacity>

                                {detailsExpanded && (
                                    <View style={styles.detailsContent}>
                                        {/* Piezas Totales */}
                                        {shipmentData.details
                                            .totalNumberOfPieces && (
                                            <View style={styles.detailItem}>
                                                <ThemedText
                                                    style={
                                                        styles.detailItemLabel
                                                    }
                                                >
                                                    Piezas Totales
                                                </ThemedText>
                                                <ThemedText
                                                    style={[
                                                        styles.detailItemValue,
                                                        { color: textColor },
                                                    ]}
                                                >
                                                    {
                                                        shipmentData.details
                                                            .totalNumberOfPieces
                                                    }
                                                </ThemedText>
                                            </View>
                                        )}

                                        {/* Servicio */}
                                        {shipmentData.details.product
                                            ?.productName && (
                                            <View style={styles.detailItem}>
                                                <ThemedText
                                                    style={
                                                        styles.detailItemLabel
                                                    }
                                                >
                                                    Servicio
                                                </ThemedText>
                                                <ThemedText
                                                    style={[
                                                        styles.detailItemValue,
                                                        { color: textColor },
                                                    ]}
                                                >
                                                    {
                                                        shipmentData.details
                                                            .product.productName
                                                    }
                                                </ThemedText>
                                            </View>
                                        )}

                                        {/* Peso */}
                                        {shipmentData.details.weight && (
                                            <View style={styles.detailItem}>
                                                <ThemedText
                                                    style={
                                                        styles.detailItemLabel
                                                    }
                                                >
                                                    Peso
                                                </ThemedText>
                                                <ThemedText
                                                    style={[
                                                        styles.detailItemValue,
                                                        { color: textColor },
                                                    ]}
                                                >
                                                    {
                                                        shipmentData.details
                                                            .weight.value
                                                    }{" "}
                                                    {
                                                        shipmentData.details
                                                            .weight.unitText
                                                    }
                                                </ThemedText>
                                            </View>
                                        )}

                                        {/* Volumen */}
                                        {shipmentData.details.volume && (
                                            <View style={styles.detailItem}>
                                                <ThemedText
                                                    style={
                                                        styles.detailItemLabel
                                                    }
                                                >
                                                    Volumen (cm³)
                                                </ThemedText>
                                                <ThemedText
                                                    style={[
                                                        styles.detailItemValue,
                                                        { color: textColor },
                                                    ]}
                                                >
                                                    {
                                                        shipmentData.details
                                                            .volume.value
                                                    }
                                                </ThemedText>
                                            </View>
                                        )}
                                    </View>
                                )}
                            </View>
                        )}

                        {/* Timeline de eventos */}
                        <View
                            style={[
                                styles.timelineCard,
                                {
                                    backgroundColor: cardBackgroundColor,
                                    borderColor,
                                },
                            ]}
                        >
                            <ThemedText
                                style={[
                                    styles.timelineTitle,
                                    { color: textColor },
                                ]}
                            >
                                Historial de seguimiento
                            </ThemedText>

                            <View style={styles.timeline}>
                                {(shipmentData.events || []).map(
                                    (event, index) => (
                                        <View
                                            key={index}
                                            style={styles.timelineItem}
                                        >
                                            <View
                                                style={styles.timelineIndicator}
                                            >
                                                <View
                                                    style={[
                                                        styles.timelineDot,
                                                        index === 0 &&
                                                            styles.timelineDotActive,
                                                    ]}
                                                >
                                                    <MaterialIcons
                                                        name="local-shipping"
                                                        size={16}
                                                        color={
                                                            index === 0
                                                                ? "#fff"
                                                                : "#666"
                                                        }
                                                    />
                                                </View>
                                                {index <
                                                    (shipmentData.events
                                                        ?.length || 1) -
                                                        1 && (
                                                    <View
                                                        style={
                                                            styles.timelineLine
                                                        }
                                                    />
                                                )}
                                            </View>
                                            <View
                                                style={styles.timelineContent}
                                            >
                                                <ThemedText
                                                    style={[
                                                        styles.eventDescription,
                                                        { color: textColor },
                                                    ]}
                                                >
                                                    {event?.description ||
                                                        "Evento sin descripción"}
                                                </ThemedText>
                                                {event?.timestamp && (
                                                    <ThemedText
                                                        style={
                                                            styles.eventTimestamp
                                                        }
                                                    >
                                                        {formatDate(
                                                            event.timestamp
                                                        )}
                                                    </ThemedText>
                                                )}
                                                {event?.location?.address
                                                    ?.addressLocality && (
                                                    <ThemedText
                                                        style={
                                                            styles.eventLocation
                                                        }
                                                    >
                                                        📍{" "}
                                                        {
                                                            event.location
                                                                .address
                                                                .addressLocality
                                                        }
                                                    </ThemedText>
                                                )}
                                            </View>
                                        </View>
                                    )
                                )}
                            </View>
                        </View>
                    </>
                )}

                {/* Mensaje de error */}
                {error && !loading && (
                    <View
                        style={[
                            styles.errorCard,
                            {
                                backgroundColor: cardBackgroundColor,
                                borderColor: "#FF6B6B",
                            },
                        ]}
                    >
                        <MaterialIcons
                            name="error-outline"
                            size={24}
                            color="#FF6B6B"
                            style={styles.errorIcon}
                        />
                        <ThemedText
                            style={[styles.errorText, { color: "#FF6B6B" }]}
                        >
                            {error}
                        </ThemedText>
                    </View>
                )}
            </ScrollView>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        marginBottom: 20,
        alignItems: "center",
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    titleIcon: {
        marginRight: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        opacity: 0.7,
    },
    searchCard: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 20,
        marginBottom: 20,
    },
    searchTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 16,
    },
    inputContainer: {
        flexDirection: "row",
        borderWidth: 1,
        borderRadius: 8,
        overflow: "hidden",
    },
    trackingInput: {
        flex: 1,
        padding: 12,
        fontSize: 16,
    },
    searchButton: {
        backgroundColor: "#FF8C00",
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 50,
    },
    statusCard: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 20,
        marginBottom: 20,
    },
    statusHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 20,
    },
    statusInfo: {
        flex: 1,
    },
    statusTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 4,
    },
    trackingCode: {
        fontSize: 14,
        color: "#666",
        marginBottom: 4,
    },
    statusDate: {
        fontSize: 13,
        color: "#666",
        fontStyle: "italic",
    },
    refreshButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderRadius: 8,
        gap: 6,
    },
    refreshText: {
        fontSize: 14,
    },
    routeContainer: {
        marginTop: 8,
    },
    routeLayout: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 16,
    },
    originContainer: {
        flex: 1,
        alignItems: "flex-start",
    },
    destinationContainer: {
        flex: 1,
        alignItems: "flex-end",
    },
    planeContainer: {
        flex: 0,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
    },
    routeLabel: {
        fontSize: 12,
        color: "#666",
        fontWeight: "500",
        marginBottom: 4,
        textTransform: "uppercase",
    },
    routeLocation: {
        fontSize: 14,
        fontWeight: "600",
        textAlign: "left",
    },

    timelineCard: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 20,
    },
    timelineTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 16,
    },
    timeline: {
        flex: 1,
    },
    timelineItem: {
        flexDirection: "row",
        marginBottom: 20,
    },
    timelineIndicator: {
        alignItems: "center",
        marginRight: 16,
    },
    timelineDot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#f0f0f0",
        alignItems: "center",
        justifyContent: "center",
    },
    timelineDotActive: {
        backgroundColor: "#FF8C00",
    },
    timelineLine: {
        width: 2,
        height: 40,
        backgroundColor: "#e0e0e0",
        marginTop: 8,
    },
    timelineContent: {
        flex: 1,
        paddingTop: 4,
    },
    eventDescription: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    eventTimestamp: {
        fontSize: 14,
        color: "#666",
        marginBottom: 4,
    },
    eventLocation: {
        fontSize: 14,
        color: "#666",
    },

    detailsCard: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 20,
        marginBottom: 20,
    },
    detailsHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 8,
    },
    detailsTitle: {
        fontSize: 18,
        fontWeight: "600",
        flex: 1,
    },
    detailsContent: {
        paddingTop: 16,
    },
    detailItem: {
        marginBottom: 16,
    },
    detailItemLabel: {
        fontSize: 14,
        color: "#666",
        fontWeight: "500",
        marginBottom: 4,
    },
    detailItemValue: {
        fontSize: 16,
        fontWeight: "600",
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    detailLabel: {
        fontSize: 14,
        color: "#666",
        fontWeight: "500",
    },
    detailValue: {
        fontSize: 14,
        fontWeight: "600",
        flex: 1,
        textAlign: "right",
    },
    errorCard: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    errorIcon: {
        marginRight: 12,
    },
    errorText: {
        fontSize: 14,
        flex: 1,
        lineHeight: 20,
    },
})
