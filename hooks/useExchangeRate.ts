import {
    ExchangeRate,
    formatDate,
    formatExchangeRate,
    getExchangeRate,
} from "@/services/exchangeRateService"
import { useEffect, useState } from "react"

export const useExchangeRate = () => {
    const [exchangeData, setExchangeData] = useState<ExchangeRate | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchExchangeRate = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await getExchangeRate()
            setExchangeData(data)
        } catch (err) {
            setError("Error al cargar el tipo de cambio")
            console.error("Exchange rate fetch error:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchExchangeRate()
    }, [])

    const formattedRate = exchangeData
        ? formatExchangeRate(exchangeData.rate)
        : "0.00"
    const formattedDate = exchangeData
        ? formatDate(exchangeData.lastUpdated)
        : formatDate(new Date())

    return {
        exchangeData,
        formattedRate,
        formattedDate,
        loading,
        error,
        refresh: fetchExchangeRate,
    }
}
