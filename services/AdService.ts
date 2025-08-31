// import AsyncStorage from "@react-native-async-storage/async-storage" // Temporalmente deshabilitado
import {
    AdEventType,
    InterstitialAd,
    TestIds,
} from "react-native-google-mobile-ads"
import ENV_CONFIG from "../config/env"

class AdService {
    private static instance: AdService
    private interstitial: InterstitialAd
    private isAdLoaded = false
    private clickCounter = 0
    private readonly STORAGE_KEY = "ad_click_counter"
    private readonly CLICKS_BEFORE_AD = 2

    // Ad Unit ID usando variables de entorno de forma segura
    private readonly adUnitId = this.getAdUnitId()

    private getAdUnitId(): string {
        if (__DEV__) {
            return TestIds.INTERSTITIAL
        }
        
        const productionAdUnitId = ENV_CONFIG.INTERSTITIAL_AD_UNIT_ID
        if (!productionAdUnitId) {
            throw new Error(
                "❌ EXPO_PUBLIC_INTERSTITIAL_AD_UNIT_ID no está configurado. " +
                "Revisa tu archivo .env o variables de entorno de EAS."
            )
        }
        
        return productionAdUnitId
    }

    private constructor() {
        // Crear el anuncio una sola vez
        this.interstitial = InterstitialAd.createForAdRequest(this.adUnitId)
        this.setupAdListeners()
        this.loadClickCounter()
        this.loadAd()
    }

    public static getInstance(): AdService {
        if (!AdService.instance) {
            AdService.instance = new AdService()
        }
        return AdService.instance
    }

    private setupAdListeners() {
        this.interstitial.addAdEventListener(AdEventType.LOADED, () => {
            console.log("✅ Anuncio intersticial cargado")
            this.isAdLoaded = true
        })

        this.interstitial.addAdEventListener(AdEventType.OPENED, () => {
            console.log("🎯 Anuncio mostrado")
        })

        this.interstitial.addAdEventListener(AdEventType.CLOSED, () => {
            console.log("❌ Anuncio cerrado, recargando...")
            this.isAdLoaded = false
            this.loadAd() // Recargar para el próximo uso
        })

        this.interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
            console.log("🚨 Error en anuncio:", error)
            this.isAdLoaded = false
        })
    }

    private loadAd() {
        console.log("⏳ Cargando anuncio intersticial...")
        this.interstitial.load()
    }

    private async loadClickCounter() {
        // Temporalmente sin persistencia - usar solo memoria
        this.clickCounter = 0
        console.log(
            `📊 Contador iniciado (sin persistencia): ${this.clickCounter}/${this.CLICKS_BEFORE_AD}`
        )
    }

    private async saveClickCounter() {
        // Temporalmente sin persistencia - solo log
        console.log(
            `💾 Contador: ${this.clickCounter}/${this.CLICKS_BEFORE_AD} (no persistido)`
        )
    }

    public async onCalculateButtonPressed(): Promise<boolean> {
        this.clickCounter++
        console.log(`🔢 Click ${this.clickCounter}/${this.CLICKS_BEFORE_AD}`)

        await this.saveClickCounter()

        if (this.clickCounter >= this.CLICKS_BEFORE_AD) {
            // Resetear contador
            this.clickCounter = 0
            await this.saveClickCounter()

            // Mostrar anuncio si está cargado
            if (this.isAdLoaded) {
                console.log("🎯 Mostrando anuncio intersticial")
                this.interstitial.show()
                return true // Anuncio mostrado
            } else {
                console.log("⚠️ Anuncio no está listo, intentando cargar...")
                this.loadAd()
                return false // Anuncio no mostrado
            }
        }

        return false // No mostrar anuncio aún
    }

    public getClickProgress(): {
        current: number
        total: number
        remaining: number
    } {
        return {
            current: this.clickCounter,
            total: this.CLICKS_BEFORE_AD,
            remaining: this.CLICKS_BEFORE_AD - this.clickCounter,
        }
    }
}

export default AdService
