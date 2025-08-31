import React, { useEffect, useState } from "react"
import {
    ActivityIndicator,
    Alert,
    Linking,
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
import { MaterialIcons } from "@expo/vector-icons"

export default function VendedoresScreen() {
    const [username, setUsername] = useState("")
    const [loading, setLoading] = useState(false)
    const [animatedPlaceholder, setAnimatedPlaceholder] = useState("")
    const [isTyping, setIsTyping] = useState(true)

    const textColor = useThemeColor({}, "text")
    const cardBackgroundColor = useThemeColor(
        { light: "#fff", dark: "#18181A" },
        "background"
    )
    const borderColor = useThemeColor(
        { light: "#e0e0e0", dark: "#3a3a3c" },
        "text"
    )

    // Ejemplos de usernames para la animación
    const exampleUsernames = [
        "mitienda123",
        "productos-tech",
        "fashion-store",
        "electronica-pro",
        "casa-hogar",
        "sport-zone",
        "beauty-shop",
    ]

    // Efecto para animar el placeholder
    useEffect(() => {
        let currentExampleIndex = 0
        let currentCharIndex = 0
        let timeoutId: NodeJS.Timeout

        const animatePlaceholder = () => {
            const currentExample = exampleUsernames[currentExampleIndex]

            if (isTyping) {
                // Escribir el texto
                if (currentCharIndex <= currentExample.length) {
                    setAnimatedPlaceholder(
                        currentExample.substring(0, currentCharIndex)
                    )
                    currentCharIndex++
                    timeoutId = setTimeout(animatePlaceholder, 100) // Velocidad de escritura
                } else {
                    // Pausar antes de borrar
                    setIsTyping(false)
                    timeoutId = setTimeout(animatePlaceholder, 2000) // Pausa 2 segundos
                }
            } else {
                // Borrar el texto
                if (currentCharIndex > 0) {
                    currentCharIndex--
                    setAnimatedPlaceholder(
                        currentExample.substring(0, currentCharIndex)
                    )
                    timeoutId = setTimeout(animatePlaceholder, 50) // Velocidad de borrado
                } else {
                    // Pasar al siguiente ejemplo
                    currentExampleIndex =
                        (currentExampleIndex + 1) % exampleUsernames.length
                    setIsTyping(true)
                    timeoutId = setTimeout(animatePlaceholder, 500) // Pausa antes de escribir
                }
            }
        }

        // Solo animar si el usuario no ha escrito nada
        if (!username.trim()) {
            animatePlaceholder()
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId)
            }
        }
    }, [username, isTyping]) // Dependencias para reiniciar la animación

    const handleCreateStore = async () => {
        if (!username.trim()) {
            Alert.alert("Error", "Por favor ingresa un nombre de usuario")
            return
        }

        if (username.length < 3) {
            Alert.alert(
                "Error",
                "El nombre de usuario debe tener al menos 3 caracteres"
            )
            return
        }

        // Validar que el username solo contenga caracteres válidos
        const validUsername = /^[a-zA-Z0-9-]+$/.test(username)
        if (!validUsername) {
            Alert.alert(
                "Error",
                "El nombre de usuario solo puede contener letras, números y guiones"
            )
            return
        }

        setLoading(true)

        try {
            // Redirigir a izimport.com para que inicie sesión
            const url = `https://izimport.com?username=${username.toLowerCase()}`

            // Verificar si se puede abrir la URL
            const canOpen = await Linking.canOpenURL(url)

            if (canOpen) {
                await Linking.openURL(url)
                setLoading(false)

                // Mostrar mensaje de confirmación
                Alert.alert(
                    "¡Redirigiendo!",
                    `Te hemos enviado a izimport.com para que inicies sesión y configures tu tienda: ${username.toLowerCase()}`,
                    [{ text: "Entendido" }]
                )
            } else {
                setLoading(false)
                Alert.alert(
                    "Error",
                    "No se pudo abrir el navegador. Por favor, ve manualmente a izimport.com"
                )
            }
        } catch (error) {
            setLoading(false)
            console.error("Error al abrir URL:", error)
            Alert.alert(
                "Error",
                "Hubo un problema al redirigir. Por favor, ve manualmente a izimport.com"
            )
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
                            name="storefront"
                            size={32}
                            color="#FF8C00"
                            style={styles.titleIcon}
                        />
                        <ThemedText
                            style={[styles.title, { color: textColor }]}
                        >
                            Crea tu tienda online
                        </ThemedText>
                    </View>
                    <ThemedText style={[styles.subtitle, { color: textColor }]}>
                        Ingresa tu nombre de usuario y te redirigiremos a la web
                        para crear tu tienda
                    </ThemedText>
                </View>

                <View
                    style={[
                        styles.card,
                        { backgroundColor: cardBackgroundColor, borderColor },
                    ]}
                >
                    <ThemedText
                        style={[styles.cardTitle, { color: textColor }]}
                    >
                        Tu URL personalizada
                    </ThemedText>

                    <View
                        style={[
                            styles.urlPreview,
                            { borderColor: borderColor },
                        ]}
                    >
                        <ThemedText style={styles.urlText}>
                            izimport.com/
                        </ThemedText>
                        <TextInput
                            style={[
                                styles.usernameInput,
                                { color: textColor, borderColor },
                            ]}
                            placeholder={
                                username.trim()
                                    ? "tuusuario"
                                    : animatedPlaceholder
                            }
                            placeholderTextColor={
                                username.trim() ? "#999" : "#FF8C00"
                            }
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <ThemedText style={styles.helpText}>
                        • Solo letras, números y guiones • Mínimo 3 caracteres •
                        Te redirigiremos a la web para continuar
                    </ThemedText>
                </View>

                <View
                    style={[
                        styles.card,
                        { backgroundColor: cardBackgroundColor, borderColor },
                    ]}
                >
                    <ThemedText
                        style={[styles.cardTitle, { color: textColor }]}
                    >
                        ¿Cómo funciona?
                    </ThemedText>

                    <View style={styles.featuresList}>
                        <ThemedText style={styles.feature}>
                            ✅ Ingresa tu nombre de usuario deseado
                        </ThemedText>
                        <ThemedText style={styles.feature}>
                            ✅ Te redirigimos a izimport.com
                        </ThemedText>
                        <ThemedText style={styles.feature}>
                            ✅ Inicia sesión o crea tu cuenta
                        </ThemedText>
                        <ThemedText style={styles.feature}>
                            ✅ Configura tu tienda online
                        </ThemedText>
                        <ThemedText style={styles.feature}>
                            ✅ ¡Comienza a vender!
                        </ThemedText>
                        <ThemedText style={styles.feature}>
                            🌐 Tu URL será: izimport.com/[tuusuario]
                        </ThemedText>
                    </View>
                </View>

                <TouchableOpacity
                    style={[
                        styles.createButton,
                        loading && styles.createButtonDisabled,
                    ]}
                    onPress={handleCreateStore}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <ThemedText style={styles.createButtonText}>
                            Ir a izimport.com
                        </ThemedText>
                    )}
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
    card: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 20,
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 16,
    },
    urlPreview: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "transparent",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 12,
    },
    urlText: {
        fontSize: 16,
        color: "#999",
    },
    usernameInput: {
        fontSize: 16,
        fontWeight: "600",
        flex: 1,
        borderBottomWidth: 0,
        paddingVertical: 2,
        marginLeft: 4,
    },
    helpText: {
        fontSize: 12,
        color: "#666",
        lineHeight: 16,
    },
    featuresList: {
        gap: 8,
    },
    feature: {
        fontSize: 14,
        lineHeight: 20,
    },
    createButton: {
        backgroundColor: "#FF8C00",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        marginTop: 10,
    },
    createButtonDisabled: {
        opacity: 0.6,
    },
    createButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
})
