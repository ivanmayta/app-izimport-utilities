import React, { useState } from "react"
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
import { Ionicons } from "@expo/vector-icons"

interface Module {
    id: number
    title: string
    description: string
    duration: string
    completed: boolean
}

export default function CursoScreen() {
    const [selectedModule, setSelectedModule] = useState<number | null>(null)

    const textColor = useThemeColor({}, "text")
    const cardBackgroundColor = useThemeColor(
        { light: "#fff", dark: "#18181A" },
        "background"
    )
    const borderColor = useThemeColor(
        { light: "#e0e0e0", dark: "#3a3a3c" },
        "text"
    )

    const modules: Module[] = [
        {
            id: 1,
            title: "Ética en el Comercio Exterior",
            description:
                "Principios éticos y responsabilidad social en operaciones comerciales internacionales",
            duration: "",
            completed: false,
        },
        {
            id: 2,
            title: "Gestión de Operaciones y Logística Internacional",
            description:
                "Aprende a exportar e importar productos y conquista el mercado internacional, consigue clientes y proveedores confiables",
            duration: "",
            completed: false,
        },
        {
            id: 3,
            title: "Gestión Documentaria del Comercio Exterior",
            description:
                "Domina los procesos aduaneros para emprender nuevos negocios nacionales e internacionales",
            duration: "",
            completed: false,
        },
        {
            id: 4,
            title: "Legislación y Técnica Aduanera",
            description:
                "Marco legal aduanero y técnicas especializadas para el comercio exterior",
            duration: "",
            completed: false,
        },
        {
            id: 5,
            title: "Nomenclatura, Valoración y Tributación Aduanera",
            description:
                "Clasificación arancelaria, valoración aduanera y cálculo de tributos en operaciones de comercio exterior",
            duration: "",
            completed: false,
        },
        {
            id: 6,
            title: "Operatividad del Comercio Exterior",
            description:
                "Aplicación práctica de todos los conocimientos para ascender laboralmente o trabajar en corto tiempo",
            duration: "",
            completed: false,
        },
    ]

    const handleStartModule = (moduleId: number) => {
        setSelectedModule(moduleId)
        // TODO: Implementar navegación al contenido del módulo
        console.log(`Iniciar módulo ${moduleId}`)
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
                        <Ionicons
                            name="school"
                            size={32}
                            color="#FF8C00"
                            style={styles.titleIcon}
                        />
                        <ThemedText
                            style={[styles.title, { color: textColor }]}
                        >
                            Curso de Importación
                        </ThemedText>
                    </View>
                    <ThemedText style={[styles.subtitle, { color: textColor }]}>
                        Programa completo de Comercio Exterior y Aduanas -
                        Auxiliar de Despacho Aduanero Virtual
                    </ThemedText>
                </View>

                {/* Lista de módulos */}
                <View style={styles.modulesContainer}>
                    <ThemedText
                        style={[styles.sectionTitle, { color: textColor }]}
                    >
                        Contenido del curso (6 módulos)
                    </ThemedText>

                    {modules.map((module, index) => (
                        <TouchableOpacity
                            key={module.id}
                            style={[
                                styles.moduleCard,
                                {
                                    backgroundColor: cardBackgroundColor,
                                    borderColor,
                                },
                                selectedModule === module.id &&
                                    styles.selectedModule,
                            ]}
                            onPress={() => handleStartModule(module.id)}
                        >
                            <View style={styles.moduleHeader}>
                                <View style={styles.moduleNumber}>
                                    <ThemedText style={styles.moduleNumberText}>
                                        {index + 1}
                                    </ThemedText>
                                </View>
                                <View style={styles.moduleInfo}>
                                    <ThemedText
                                        style={[
                                            styles.moduleTitle,
                                            { color: textColor },
                                        ]}
                                    >
                                        {module.title}
                                    </ThemedText>
                                    <ThemedText
                                        style={styles.moduleDescription}
                                    >
                                        {module.description}
                                    </ThemedText>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Botón de contacto */}
                <TouchableOpacity
                    style={styles.contactButton}
                    onPress={() => {
                        const phoneNumber = "972677175"
                        const message =
                            "Hola, me interesa el curso de Comercio Exterior y Aduanas"
                        const whatsappUrl = `whatsapp://send?phone=51${phoneNumber}&text=${encodeURIComponent(
                            message
                        )}`

                        Linking.canOpenURL(whatsappUrl).then((supported) => {
                            if (supported) {
                                Linking.openURL(whatsappUrl)
                            } else {
                                // Fallback para WhatsApp Web
                                const webUrl = `https://wa.me/51${phoneNumber}?text=${encodeURIComponent(
                                    message
                                )}`
                                Linking.openURL(webUrl)
                            }
                        })
                    }}
                >
                    <ThemedText style={styles.contactButtonText}>
                        📱 Contactar por WhatsApp
                    </ThemedText>
                </TouchableOpacity>
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
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        opacity: 0.7,
    },

    modulesContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 16,
    },
    moduleCard: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
        marginBottom: 12,
    },
    selectedModule: {
        borderColor: "#FF8C00",
        borderWidth: 2,
    },
    moduleHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    moduleNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#FF8C00",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    moduleNumberText: {
        color: "#fff",
        fontWeight: "600",
    },
    moduleInfo: {
        flex: 1,
    },
    moduleTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    moduleDescription: {
        fontSize: 14,
        opacity: 0.7,
        lineHeight: 18,
    },

    contactButton: {
        backgroundColor: "#25D366", // Verde WhatsApp
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        marginBottom: 20,
    },
    contactButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
})
