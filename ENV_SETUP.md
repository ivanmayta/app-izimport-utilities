# Configuración de Variables de Entorno - AdMob

## 📋 Configuración de Ad Unit IDs

Para mantener la seguridad de tus Ad Unit IDs de AdMob, sigue estos pasos:

### 1. Crear archivo .env (RECOMENDADO - MÁS SIMPLE)

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
# Variables de entorno para Ad Unit IDs
# IMPORTANTE: Reemplaza estos valores con tus Ad Unit IDs reales de AdMob

# Ad Unit ID para anuncios intersticiales
EXPO_PUBLIC_INTERSTITIAL_AD_UNIT_ID=ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy

# Ad Unit ID para banners (si los usas en el futuro)
EXPO_PUBLIC_BANNER_AD_UNIT_ID=ca-app-pub-xxxxxxxxxxxxx/zzzzzzzzzzzzzz
```

### 2. Configurar en app.config.js (ALTERNATIVA - MÁS COMPLEJA)

Si prefieres más control, puedes configurar las variables en `app.config.js`:

```javascript
export default {
    expo: {
        // ... otras configuraciones
        extra: {
            INTERSTITIAL_AD_UNIT_ID: process.env.INTERSTITIAL_AD_UNIT_ID,
            BANNER_AD_UNIT_ID: process.env.BANNER_AD_UNIT_ID,
        },
    },
}
```

### 🤔 ¿Por qué EXPO*PUBLIC* vs Constants.expoConfig?

**Opción 1: `.env` con `EXPO_PUBLIC_` (RECOMENDADO)**

-   ✅ Más simple y directo
-   ✅ Expo lo lee automáticamente
-   ✅ Acceso directo: `process.env.EXPO_PUBLIC_MI_VARIABLE`
-   ✅ Perfecto para IDs públicos como AdMob

**Opción 2: `app.config.js` + `Constants.expoConfig`**

-   ✅ Más flexible para lógica compleja
-   ✅ Mejor para datos que NO deben ser públicos
-   ✅ Control total sobre qué se expone
-   ❌ Más código y configuración

**Para Ad Unit IDs → Usa la Opción 1** 🎯

### 3. Para EAS Build (Producción)

En producción, configura las variables de entorno en EAS:

```bash
# Configurar variables para producción
eas secret:create --scope project --name INTERSTITIAL_AD_UNIT_ID --value "tu-ad-unit-id-real"
eas secret:create --scope project --name BANNER_AD_UNIT_ID --value "tu-banner-ad-unit-id-real"
```

### 4. Obtener tus Ad Unit IDs

1. Ve a [Google AdMob Console](https://apps.admob.com/)
2. Selecciona tu aplicación
3. Ve a "Ad units"
4. Copia los IDs que tienen el formato: `ca-app-pub-xxxxxxxxx/yyyyyyyyyy`

### 5. Seguridad

-   ✅ **NUNCA** subas el archivo `.env` a Git (ya está en .gitignore)
-   ✅ Usa variables de entorno en producción
-   ✅ Usa Test IDs en desarrollo (`__DEV__ = true`)
-   ❌ **NUNCA** hardcodees los Ad Unit IDs en el código

### 6. Verificación

El AdService ahora usa automáticamente:

-   **Desarrollo**: `TestIds.INTERSTITIAL` (seguro para testing)
-   **Producción**: Tu Ad Unit ID real desde variables de entorno

```typescript
// Configuración actual en AdService.ts
private readonly adUnitId = __DEV__
    ? TestIds.INTERSTITIAL
    : ENV_CONFIG.INTERSTITIAL_AD_UNIT_ID
```
