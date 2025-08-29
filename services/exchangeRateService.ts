// Servicio para obtener el tipo de cambio desde OpenExchange API

export interface ExchangeRate {
    rate: number
    currency: string
    baseCurrency: string
    lastUpdated: Date
}

interface OpenExchangeResponse {
    disclaimer: string
    license: string
    timestamp: number
    base: string
    rates: {
        [key: string]: number
    }
}

export const getExchangeRate = async (): Promise<ExchangeRate> => {
    const APP_ID = process.env.EXPO_PUBLIC_OPENEXCHANGERATES_APP_ID

    if (!APP_ID) {
        // Fallback a datos mock si no hay API key
        console.warn(
            "No se encontró EXPO_PUBLIC_OPENEXCHANGERATES_APP_ID, usando datos mock"
        )
        return {
            rate: 3.68,
            currency: "PEN",
            baseCurrency: "USD",
            lastUpdated: new Date(),
        }
    }

    try {
        const baseUrl = "https://openexchangerates.org"
        const pathName = "/api/latest.json"
        const url = `${baseUrl}${pathName}?app_id=${APP_ID}`

        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`)
        }

        const data: OpenExchangeResponse = await response.json()

        // Obtenemos la tasa PEN (Sol peruano)
        const penRate = data.rates.PEN

        if (!penRate) {
            throw new Error("No se encontró la tasa de cambio para PEN")
        }

        return {
            rate: penRate,
            currency: "PEN",
            baseCurrency: data.base,
            lastUpdated: new Date(data.timestamp * 1000), // timestamp viene en segundos
        }
    } catch (error) {
        console.error("Error al obtener el tipo de cambio:", error)

        // Fallback a datos mock en caso de error
        return {
            rate: 3.68,
            currency: "PEN",
            baseCurrency: "USD",
            lastUpdated: new Date(),
        }
    }
}

// Función para formatear el tipo de cambio
export const formatExchangeRate = (rate: number): string => {
    return rate.toFixed(2)
}

// Función para formatear la fecha
export const formatDate = (date: Date): string => {
    const day = date.getDate()
    const month = date.toLocaleDateString("es-PE", { month: "long" })
    const year = date.getFullYear()

    return `${day} de ${month}, ${year}`
}
