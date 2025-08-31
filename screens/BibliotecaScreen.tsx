import React from "react"
import {
    Linking,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native"

import AdBanner from "@/components/AdBanner"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { useThemeColor } from "@/hooks/useThemeColor"
import { Feather, MaterialIcons } from "@expo/vector-icons"

interface Resource {
    id: number
    title: string
    type: "SEMINARIO" | "CURSO PRACTICO"
    description: string
}

export default function BibliotecaScreen() {
    const textColor = useThemeColor({}, "text")
    const cardBackgroundColor = useThemeColor(
        { light: "#fff", dark: "#18181A" },
        "background"
    )
    const borderColor = useThemeColor(
        { light: "#e0e0e0", dark: "#3a3a3c" },
        "text"
    )

    const resources: Resource[] = [
        {
            id: 1,
            title: "Incoterms 2020",
            type: "SEMINARIO",
            description: "Términos comerciales internacionales actualizados",
        },
        {
            id: 2,
            title: "Permiso de internamiento VUCE",
            type: "SEMINARIO",
            description: "Ventanilla Única de Comercio Exterior",
        },
        {
            id: 3,
            title: "Actualización a la Ley General de Aduanas",
            type: "SEMINARIO",
            description: "Marco legal aduanero actualizado",
        },
        {
            id: 4,
            title: "Cadena suministros SCM enfoque COVID",
            type: "SEMINARIO",
            description: "Supply Chain Management en pandemia",
        },
        {
            id: 5,
            title: "Importaciones y exportaciones digitales",
            type: "SEMINARIO",
            description: "Comercio exterior en la era digital",
        },
        {
            id: 6,
            title: "Manejo de sistema VUCE - Juguetes y Celulares",
            type: "CURSO PRACTICO",
            description: "Aplicación casos prácticos específicos",
        },
        {
            id: 7,
            title: "Valoración Aduanera",
            type: "SEMINARIO",
            description: "Métodos de valoración en aduanas",
        },
        {
            id: 8,
            title: "Manejo de sistema VUCE - PARTE II",
            type: "CURSO PRACTICO",
            description: "Casos prácticos avanzados",
        },
        {
            id: 9,
            title: "Técnicas de investigación y redacción",
            type: "SEMINARIO",
            description: "Metodología de investigación aplicada",
        },
        {
            id: 10,
            title: "Importación fácil, envíos de entrega rápida",
            type: "CURSO PRACTICO",
            description: "Casos prácticos de importación express",
        },
        {
            id: 11,
            title: "Incoterms 2020 (Actualizado)",
            type: "SEMINARIO",
            description: "Versión actualizada de términos comerciales",
        },
        {
            id: 12,
            title: "Valoración y Tributación Aduanera",
            type: "SEMINARIO",
            description: "Cálculo de tributos en operaciones aduaneras",
        },
        {
            id: 13,
            title: "Cómo crear un Curriculum Vitae exitoso",
            type: "SEMINARIO",
            description: "Desarrollo profesional en comercio exterior",
        },
        {
            id: 14,
            title: "Cómo vender productos peruanos al mundo",
            type: "SEMINARIO",
            description: "Guía para exportar con éxito",
        },
        {
            id: 15,
            title: "Calcular los costos de importación China-Perú",
            type: "SEMINARIO",
            description: "Costeo específico de importaciones asiáticas",
        },
        {
            id: 16,
            title: "Clase Magistral: Gestión de Carga Internacional",
            type: "SEMINARIO",
            description: "Logística y transporte internacional",
        },
        {
            id: 17,
            title: "Gestión de Recursos Humanos",
            type: "SEMINARIO",
            description: "RRHH aplicado al comercio exterior",
        },
        {
            id: 18,
            title: "Funciones de Auxiliares de Despacho Aduanero",
            type: "SEMINARIO",
            description: "Ámbito laboral y responsabilidades",
        },
        {
            id: 19,
            title: "Cómo importar de Amazon a Perú",
            type: "SEMINARIO",
            description: "Importación desde plataformas digitales",
        },
    ]

    const handleOpenDrive = () => {
        const driveUrl =
            "https://drive.google.com/drive/folders/1NgeBnqskBvdgeyUdtgOfQnYDGas1Enak"
        Linking.openURL(driveUrl)
    }

    const getResourceIcon = (type: string) => {
        return type === "CURSO PRACTICO" ? "settings" : "book"
    }

    const getResourceColor = (type: string) => {
        return type === "CURSO PRACTICO" ? "#4CAF50" : "#2196F3"
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
                        <Feather
                            name="book-open"
                            size={32}
                            color="#FF8C00"
                            style={styles.titleIcon}
                        />
                        <ThemedText
                            style={[styles.title, { color: textColor }]}
                        >
                            Biblioteca Virtual
                        </ThemedText>
                    </View>
                    <ThemedText style={[styles.subtitle, { color: textColor }]}>
                        Recursos gratuitos de comercio exterior y aduanas
                    </ThemedText>
                </View>

                {/* Botón de acceso directo */}
                <TouchableOpacity
                    style={styles.driveButton}
                    onPress={handleOpenDrive}
                >
                    <MaterialIcons name="folder" size={24} color="#fff" />
                    <ThemedText style={styles.driveButtonText}>
                        Abrir Google Drive
                    </ThemedText>
                </TouchableOpacity>

                {/* Card con lista completa de recursos */}
                <View
                    style={[
                        styles.resourcesCard,
                        { backgroundColor: cardBackgroundColor, borderColor },
                    ]}
                >
                    <ThemedText
                        style={[styles.cardTitle, { color: textColor }]}
                    >
                        📚 Recursos disponibles ({resources.length})
                    </ThemedText>

                    {resources.map((resource, index) => (
                        <View
                            key={resource.id}
                            style={[
                                styles.resourceItem,
                                index < resources.length - 1 &&
                                    styles.resourceItemBorder,
                            ]}
                        >
                            <View style={styles.resourceItemRow}>
                                <View style={styles.resourceItemNumber}>
                                    <ThemedText
                                        style={styles.resourceNumberText}
                                    >
                                        {resource.id}
                                    </ThemedText>
                                </View>
                                <View style={styles.resourceItemContent}>
                                    <ThemedText
                                        style={[
                                            styles.resourceItemTitle,
                                            { color: textColor },
                                        ]}
                                    >
                                        {resource.title}
                                    </ThemedText>
                                    <ThemedText
                                        style={styles.resourceItemDescription}
                                    >
                                        {resource.description}
                                    </ThemedText>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Botón de acceso directo (abajo) */}
                <TouchableOpacity
                    style={styles.driveButton}
                    onPress={handleOpenDrive}
                >
                    <MaterialIcons name="folder" size={24} color="#fff" />
                    <ThemedText style={styles.driveButtonText}>
                        Abrir Google Drive
                    </ThemedText>
                </TouchableOpacity>

                {/* Información adicional */}
                <View
                    style={[
                        styles.infoCard,
                        { backgroundColor: cardBackgroundColor, borderColor },
                    ]}
                >
                    <ThemedText
                        style={[styles.infoTitle, { color: textColor }]}
                    >
                        📚 Información importante
                    </ThemedText>
                    <ThemedText style={styles.infoText}>
                        • Todos los recursos son completamente gratuitos
                    </ThemedText>
                    <ThemedText style={styles.infoText}>
                        • Acceso directo desde Google Drive
                    </ThemedText>
                    <ThemedText style={styles.infoText}>
                        • Seminarios y cursos prácticos especializados
                    </ThemedText>
                    <ThemedText style={styles.infoText}>
                        • Contenido actualizado de comercio exterior
                    </ThemedText>
                </View>
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
    driveButton: {
        backgroundColor: "#1976D2", // Azul Google Drive
        borderRadius: 12,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
    driveButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 8,
    },
    resourcesCard: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 20,
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 16,
        textAlign: "center",
    },
    resourceItem: {
        paddingVertical: 12,
    },
    resourceItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    resourceItemRow: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    resourceItemNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#FF8C00",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
        marginTop: 2,
    },
    resourceNumberText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    resourceItemContent: {
        flex: 1,
    },
    resourceItemTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    resourceItemDescription: {
        fontSize: 14,
        opacity: 0.7,
        lineHeight: 18,
    },
    infoCard: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 20,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        marginBottom: 6,
        color: "#666",
    },
})
