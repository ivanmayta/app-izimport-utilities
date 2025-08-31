// Configuración de variables de entorno - SIN fallbacks innecesarios
const ENV_CONFIG = {
    INTERSTITIAL_AD_UNIT_ID: process.env.EXPO_PUBLIC_INTERSTITIAL_AD_UNIT_ID,
    BANNER_AD_UNIT_ID: process.env.EXPO_PUBLIC_BANNER_AD_UNIT_ID,
} as const

export default ENV_CONFIG
