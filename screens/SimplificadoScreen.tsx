import { useEffect, useState } from "react"
import {
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"

import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { useThemeColor } from "@/hooks/useThemeColor"

interface FormData {
    unit_price: number | string
    quantity: number | string
    fob_value: number
    international_freight: number | string
    freight_dot_fob: number
    comission_platform: number | string
    comission_total: number
    total_transfer: number
    seguro: number | string
    seguro_total: number
    valor_aduanas: number
    ad_valorem: number
    ipm: number
    igv: number
    total_tributos: number
    cost_administrative: number | string
    total: number
    // Rentabilidad
    exchange_rate: number | string
    total_cost_soles: number
    unit_price_final: number
    unit_price_final_soles: number
    sale_price_soles: number | string
    sale_price_dollars: number
    income_soles: number
    income_dollars: number
    profit_soles: number
    profit_dollars: number
}

export default function SimplificadoScreen() {
    const textColor = useThemeColor({}, "text")
    const backgroundColor = useThemeColor({}, "background")
    const borderColor = useThemeColor(
        { light: "#e0e0e0", dark: "#3a3a3c" },
        "text"
    )
    const inputBackgroundColor = useThemeColor(
        { light: "#f9f9f9", dark: "#2a2a2a" },
        "background"
    )

    const [formData, setFormData] = useState<FormData>({
        unit_price: "",
        quantity: "",
        fob_value: 0,
        international_freight: "",
        freight_dot_fob: 0,
        comission_platform: "",
        comission_total: 0,
        total_transfer: 0,
        seguro: "",
        seguro_total: 0,
        valor_aduanas: 0,
        ad_valorem: 0,
        ipm: 0,
        igv: 0,
        total_tributos: 0,
        cost_administrative: "",
        total: 0,
        // Rentabilidad
        exchange_rate: "",
        total_cost_soles: 0,
        unit_price_final: 0,
        unit_price_final_soles: 0,
        sale_price_soles: "",
        sale_price_dollars: 0,
        income_soles: 0,
        income_dollars: 0,
        profit_soles: 0,
        profit_dollars: 0,
    })

    const handleChange = (name: keyof FormData, value: string) => {
        if (value === "") {
            setFormData((prevData) => ({
                ...prevData,
                [name]: "",
            }))
            return
        }

        const numericRegex = /^\d*\.?\d*$/
        if (!numericRegex.test(value)) {
            return
        }

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const toNumber = (value: number | string): number => {
        if (typeof value === "string") {
            return value === "" ? 0 : parseFloat(value) || 0
        }
        return value
    }

    useEffect(() => {
        const unit_price = toNumber(formData.unit_price)
        const quantity = toNumber(formData.quantity)
        const international_freight = toNumber(formData.international_freight)
        const comission_platform = toNumber(formData.comission_platform)
        const seguro = toNumber(formData.seguro)
        const cost_administrative = toNumber(formData.cost_administrative)
        const exchange_rate = toNumber(formData.exchange_rate)
        const sale_price_soles = toNumber(formData.sale_price_soles)

        const fob_value = unit_price * quantity
        const freight_dot_fob = fob_value + international_freight
        const comission_total = (freight_dot_fob * comission_platform) / 100
        const total_transfer = freight_dot_fob + comission_total
        const seguro_total = (fob_value * seguro) / 100
        const valor_aduanas = freight_dot_fob + seguro_total
        const ad_valorem = (valor_aduanas * 4) / 100
        const ipm = ((valor_aduanas + ad_valorem) * 2) / 100
        const igv = ((valor_aduanas + ad_valorem) * 16) / 100
        const total_tributos = ad_valorem + ipm + igv
        const total = total_transfer + total_tributos + cost_administrative

        // Rentabilidad calculations
        const unit_price_final = quantity > 0 ? total / quantity : 0
        const total_cost_soles = total * exchange_rate
        const unit_price_final_soles = unit_price_final * exchange_rate
        const sale_price_dollars =
            exchange_rate > 0 ? sale_price_soles / exchange_rate : 0
        const income_soles = quantity * sale_price_soles
        const income_dollars =
            exchange_rate > 0 ? income_soles / exchange_rate : 0
        const profit_dollars = income_dollars - total
        const profit_soles = profit_dollars * exchange_rate

        setFormData((prevData) => ({
            ...prevData,
            fob_value: Number(fob_value.toFixed(2)),
            freight_dot_fob: Number(freight_dot_fob.toFixed(2)),
            comission_total: Number(comission_total.toFixed(2)),
            total_transfer: Number(total_transfer.toFixed(2)),
            seguro_total: Number(seguro_total.toFixed(2)),
            valor_aduanas: Number(valor_aduanas.toFixed(2)),
            ad_valorem: Number(ad_valorem.toFixed(2)),
            ipm: Number(ipm.toFixed(2)),
            igv: Number(igv.toFixed(2)),
            total_tributos: Number(total_tributos.toFixed(2)),
            total: Number(total.toFixed(2)),
            // Rentabilidad
            unit_price_final: Number(unit_price_final.toFixed(2)),
            total_cost_soles: Number(total_cost_soles.toFixed(2)),
            unit_price_final_soles: Number(unit_price_final_soles.toFixed(2)),
            sale_price_dollars: Number(sale_price_dollars.toFixed(2)),
            income_soles: Number(income_soles.toFixed(2)),
            income_dollars: Number(income_dollars.toFixed(2)),
            profit_soles: Number(profit_soles.toFixed(2)),
            profit_dollars: Number(profit_dollars.toFixed(2)),
        }))
    }, [
        formData.unit_price,
        formData.quantity,
        formData.international_freight,
        formData.comission_platform,
        formData.seguro,
        formData.cost_administrative,
        formData.exchange_rate,
        formData.sale_price_soles,
    ])

    const formatValue = (value: number | string) => {
        if (value === 0 || value === "") return ""
        return value.toString()
    }

    const resetForm = () => {
        setFormData({
            unit_price: "",
            quantity: "",
            fob_value: 0,
            international_freight: "",
            freight_dot_fob: 0,
            comission_platform: "",
            comission_total: 0,
            total_transfer: 0,
            seguro: "",
            seguro_total: 0,
            valor_aduanas: 0,
            ad_valorem: 0,
            ipm: 0,
            igv: 0,
            total_tributos: 0,
            cost_administrative: "",
            total: 0,
            // Rentabilidad
            exchange_rate: "",
            total_cost_soles: 0,
            unit_price_final: 0,
            unit_price_final_soles: 0,
            sale_price_soles: "",
            sale_price_dollars: 0,
            income_soles: 0,
            income_dollars: 0,
            profit_soles: 0,
            profit_dollars: 0,
        })
    }

    const LabelResults = ({
        children,
        title,
        currency = "$",
    }: {
        children: React.ReactNode
        title: string
        currency?: string
    }) => {
        const hasValue = children !== "" && children !== "0" && children !== 0
        return (
            <View style={styles.resultContainer}>
                <ThemedText style={[styles.resultLabel, { color: textColor }]}>
                    {title}
                </ThemedText>
                <View style={styles.resultValueContainer}>
                    <ThemedText
                        style={[
                            styles.resultText,
                            {
                                color: hasValue ? "#3dd68c" : textColor,
                                fontWeight: hasValue ? "600" : "normal",
                            },
                        ]}
                    >
                        {hasValue ? `${currency}${children}` : "---"}
                    </ThemedText>
                </View>
            </View>
        )
    }

    return (
        <ThemedView style={[styles.container, { backgroundColor }]}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <ThemedText style={[styles.subtitle, { color: textColor }]}>
                        Importaciones de $200 a $2000 dólares.
                    </ThemedText>
                </View>

                <View style={styles.form}>
                    {/* Primera fila */}
                    <View style={styles.row}>
                        <View style={styles.inputContainer}>
                            <ThemedText
                                style={[styles.label, { color: textColor }]}
                            >
                                Precio Unitario:
                            </ThemedText>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: inputBackgroundColor,
                                        borderColor: borderColor,
                                        color: textColor,
                                    },
                                ]}
                                value={formatValue(formData.unit_price)}
                                onChangeText={(value) =>
                                    handleChange("unit_price", value)
                                }
                                placeholder="0.00"
                                placeholderTextColor="#9E9E9E"
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <ThemedText
                                style={[styles.label, { color: textColor }]}
                            >
                                Cantidad:
                            </ThemedText>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: inputBackgroundColor,
                                        borderColor: borderColor,
                                        color: textColor,
                                    },
                                ]}
                                value={formatValue(formData.quantity)}
                                onChangeText={(value) =>
                                    handleChange("quantity", value)
                                }
                                placeholder="0"
                                placeholderTextColor="#9E9E9E"
                                keyboardType="numeric"
                            />
                        </View>
                        <LabelResults title="Valor FOB:" currency="$">
                            {formatValue(formData.fob_value)}
                        </LabelResults>
                    </View>

                    {/* Flete Internacional */}
                    <View style={styles.row}>
                        <View style={styles.wideInputContainer}>
                            <ThemedText
                                style={[styles.label, { color: textColor }]}
                            >
                                Flete Internacional:
                            </ThemedText>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: inputBackgroundColor,
                                        borderColor: borderColor,
                                        color: textColor,
                                    },
                                ]}
                                value={formatValue(
                                    formData.international_freight
                                )}
                                onChangeText={(value) =>
                                    handleChange("international_freight", value)
                                }
                                placeholder="0.00"
                                placeholderTextColor="#9E9E9E"
                                keyboardType="numeric"
                            />
                        </View>
                        <LabelResults title="Flete + FOB:" currency="$">
                            {formatValue(formData.freight_dot_fob)}
                        </LabelResults>
                    </View>

                    {/* Comisión */}
                    <View style={styles.row}>
                        <View style={styles.wideInputContainer}>
                            <ThemedText
                                style={[styles.label, { color: textColor }]}
                            >
                                Comisión de plataforma (%):
                            </ThemedText>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: inputBackgroundColor,
                                        borderColor: borderColor,
                                        color: textColor,
                                    },
                                ]}
                                value={formatValue(formData.comission_platform)}
                                onChangeText={(value) =>
                                    handleChange("comission_platform", value)
                                }
                                placeholder="2.99% - Alibaba"
                                placeholderTextColor="#9E9E9E"
                                keyboardType="numeric"
                            />
                        </View>
                        <LabelResults title="Comisión:" currency="$">
                            {formatValue(formData.comission_total)}
                        </LabelResults>
                    </View>

                    {/* A Transferir */}
                    <View style={styles.row}>
                        <View style={styles.transferContainer}>
                            <ThemedText
                                style={[
                                    styles.transferLabel,
                                    { color: textColor },
                                ]}
                            >
                                A Transferir:
                            </ThemedText>
                        </View>
                        <View style={styles.transferResultContainer}>
                            <ThemedText
                                style={[
                                    styles.transferValue,
                                    {
                                        color:
                                            formData.total_transfer > 0
                                                ? "#3dd68c"
                                                : textColor,
                                    },
                                ]}
                            >
                                {formData.total_transfer > 0
                                    ? `$${formatValue(formData.total_transfer)}`
                                    : "---"}
                            </ThemedText>
                        </View>
                    </View>

                    {/* Seguro */}
                    <View style={styles.row}>
                        <View style={styles.wideInputContainer}>
                            <ThemedText
                                style={[styles.label, { color: textColor }]}
                            >
                                Seguro (%):
                            </ThemedText>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: inputBackgroundColor,
                                        borderColor: borderColor,
                                        color: textColor,
                                    },
                                ]}
                                value={formatValue(formData.seguro)}
                                onChangeText={(value) =>
                                    handleChange("seguro", value)
                                }
                                placeholder="0.75% - Impositivo SUNAT"
                                placeholderTextColor="#9E9E9E"
                                keyboardType="numeric"
                            />
                        </View>
                        <LabelResults title="Total Seguro:" currency="$">
                            {formatValue(formData.seguro_total)}
                        </LabelResults>
                    </View>

                    {/* Valor Aduanas (CIF) */}
                    <View style={styles.row}>
                        <View style={styles.transferContainer}>
                            <ThemedText
                                style={[
                                    styles.transferLabel,
                                    { color: textColor },
                                ]}
                            >
                                Valor Aduanas (CIF):
                            </ThemedText>
                        </View>
                        <View style={styles.transferResultContainer}>
                            <ThemedText
                                style={[
                                    styles.transferValue,
                                    {
                                        color:
                                            formData.valor_aduanas > 0
                                                ? "#3dd68c"
                                                : textColor,
                                    },
                                ]}
                            >
                                {formData.valor_aduanas > 0
                                    ? `$${formatValue(formData.valor_aduanas)}`
                                    : "---"}
                            </ThemedText>
                        </View>
                    </View>

                    {/* Sección Tributos Aduaneros */}
                    <View style={styles.tributosSection}>
                        <ThemedText
                            style={[styles.sectionTitle, { color: "#FF8C00" }]}
                        >
                            Tributos Aduaneros
                        </ThemedText>

                        <View style={styles.tributosContent}>
                            {/* AD VALOREM */}
                            <View style={styles.tributeRow}>
                                <View style={styles.inputContainer}>
                                    <ThemedText
                                        style={[
                                            styles.label,
                                            { color: textColor },
                                        ]}
                                    >
                                        AD. VALOREM:
                                    </ThemedText>
                                </View>
                                <View style={styles.percentageContainer}>
                                    <ThemedText
                                        style={[
                                            styles.percentageText,
                                            { color: textColor },
                                        ]}
                                    >
                                        4%
                                    </ThemedText>
                                </View>
                                <View style={styles.tributeResultContainer}>
                                    <ThemedText
                                        style={[
                                            styles.tributeResultText,
                                            {
                                                color:
                                                    formData.ad_valorem > 0
                                                        ? "#FF8C00"
                                                        : textColor,
                                                fontWeight:
                                                    formData.ad_valorem > 0
                                                        ? "600"
                                                        : "normal",
                                            },
                                        ]}
                                    >
                                        {formData.ad_valorem > 0
                                            ? `$${formatValue(
                                                  formData.ad_valorem
                                              )}`
                                            : "---"}
                                    </ThemedText>
                                </View>
                            </View>

                            {/* IPM */}
                            <View style={styles.tributeRow}>
                                <View style={styles.inputContainer}>
                                    <ThemedText
                                        style={[
                                            styles.label,
                                            { color: textColor },
                                        ]}
                                    >
                                        IPM:
                                    </ThemedText>
                                </View>
                                <View style={styles.percentageContainer}>
                                    <ThemedText
                                        style={[
                                            styles.percentageText,
                                            { color: textColor },
                                        ]}
                                    >
                                        2%
                                    </ThemedText>
                                </View>
                                <View style={styles.tributeResultContainer}>
                                    <ThemedText
                                        style={[
                                            styles.tributeResultText,
                                            {
                                                color:
                                                    formData.ipm > 0
                                                        ? "#FF8C00"
                                                        : textColor,
                                                fontWeight:
                                                    formData.ipm > 0
                                                        ? "600"
                                                        : "normal",
                                            },
                                        ]}
                                    >
                                        {formData.ipm > 0
                                            ? `$${formatValue(formData.ipm)}`
                                            : "---"}
                                    </ThemedText>
                                </View>
                            </View>

                            {/* IGV */}
                            <View style={styles.tributeRow}>
                                <View style={styles.inputContainer}>
                                    <ThemedText
                                        style={[
                                            styles.label,
                                            { color: textColor },
                                        ]}
                                    >
                                        IGV:
                                    </ThemedText>
                                </View>
                                <View style={styles.percentageContainer}>
                                    <ThemedText
                                        style={[
                                            styles.percentageText,
                                            { color: textColor },
                                        ]}
                                    >
                                        16%
                                    </ThemedText>
                                </View>
                                <View style={styles.tributeResultContainer}>
                                    <ThemedText
                                        style={[
                                            styles.tributeResultText,
                                            {
                                                color:
                                                    formData.igv > 0
                                                        ? "#FF8C00"
                                                        : textColor,
                                                fontWeight:
                                                    formData.igv > 0
                                                        ? "600"
                                                        : "normal",
                                            },
                                        ]}
                                    >
                                        {formData.igv > 0
                                            ? `$${formatValue(formData.igv)}`
                                            : "---"}
                                    </ThemedText>
                                </View>
                            </View>
                        </View>

                        {/* Total Tributos */}
                        <View style={styles.row}>
                            <View style={styles.transferContainer}>
                                <ThemedText
                                    style={[
                                        styles.transferLabel,
                                        { color: textColor },
                                    ]}
                                >
                                    Total Tributos:
                                </ThemedText>
                            </View>
                            <View style={styles.transferResultContainer}>
                                <ThemedText
                                    style={[
                                        styles.transferValue,
                                        {
                                            color:
                                                formData.total_tributos > 0
                                                    ? "#FF8C00"
                                                    : textColor,
                                        },
                                    ]}
                                >
                                    {formData.total_tributos > 0
                                        ? `$${formatValue(
                                              formData.total_tributos
                                          )}`
                                        : "---"}
                                </ThemedText>
                            </View>
                        </View>
                    </View>

                    {/* Gastos Administrativos y Costo Total */}
                    <View style={styles.row}>
                        <View style={styles.wideInputContainer}>
                            <ThemedText
                                style={[styles.label, { color: textColor }]}
                            >
                                Gastos Administrativos:
                            </ThemedText>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: inputBackgroundColor,
                                        borderColor: borderColor,
                                        color: textColor,
                                    },
                                ]}
                                value={formatValue(
                                    formData.cost_administrative
                                )}
                                onChangeText={(value) =>
                                    handleChange("cost_administrative", value)
                                }
                                placeholder="11.8 - DHL"
                                placeholderTextColor="#9E9E9E"
                                keyboardType="numeric"
                            />
                        </View>
                        <LabelResults title="Costo Total:" currency="$">
                            {formatValue(formData.total)}
                        </LabelResults>
                    </View>

                    {/* Sección de Rentabilidad */}
                    <View style={styles.rentabilitySection}>
                        <ThemedText
                            style={[styles.sectionTitle, { color: "#3dd68c" }]}
                        >
                            Rentabilidad
                        </ThemedText>

                        {/* Tipo de cambio */}
                        <View style={styles.row}>
                            <View style={styles.inputContainer}>
                                <ThemedText
                                    style={[styles.label, { color: textColor }]}
                                >
                                    Tipo de cambio:
                                </ThemedText>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor:
                                                inputBackgroundColor,
                                            borderColor: borderColor,
                                            color: textColor,
                                        },
                                    ]}
                                    value={formatValue(formData.exchange_rate)}
                                    onChangeText={(value) =>
                                        handleChange("exchange_rate", value)
                                    }
                                    placeholder="3.75"
                                    placeholderTextColor="#9E9E9E"
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.resultContainer}>
                                <View style={styles.resultValueContainer}>
                                    <ThemedText
                                        style={[
                                            styles.resultText,
                                            {
                                                color: "#3dd68c",
                                                fontWeight: "600",
                                            },
                                        ]}
                                    >
                                        $1.00
                                    </ThemedText>
                                </View>
                            </View>
                        </View>

                        {/* Costo Total en ambas monedas */}
                        <View style={styles.row}>
                            <View style={styles.inputContainer}>
                                <ThemedText
                                    style={[styles.label, { color: textColor }]}
                                >
                                    Costo Total:
                                </ThemedText>
                            </View>
                            <LabelResults title="" currency="S/">
                                {formatValue(formData.total_cost_soles)}
                            </LabelResults>
                            <LabelResults title="" currency="$">
                                {formatValue(formData.total)}
                            </LabelResults>
                        </View>

                        {/* Precio unitario en ambas monedas */}
                        <View style={styles.row}>
                            <View style={styles.inputContainer}>
                                <ThemedText
                                    style={[styles.label, { color: textColor }]}
                                >
                                    Precio unitario:
                                </ThemedText>
                            </View>
                            <LabelResults title="" currency="S/">
                                {formatValue(formData.unit_price_final_soles)}
                            </LabelResults>
                            <LabelResults title="" currency="$">
                                {formatValue(formData.unit_price_final)}
                            </LabelResults>
                        </View>

                        {/* Precio de venta */}
                        <View style={styles.row}>
                            <View style={styles.inputContainer}>
                                <ThemedText
                                    style={[styles.label, { color: textColor }]}
                                >
                                    Precio de venta:
                                </ThemedText>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor:
                                                inputBackgroundColor,
                                            borderColor: borderColor,
                                            color: textColor,
                                        },
                                    ]}
                                    value={formatValue(
                                        formData.sale_price_soles
                                    )}
                                    onChangeText={(value) =>
                                        handleChange("sale_price_soles", value)
                                    }
                                    placeholder="S/ 0.00"
                                    placeholderTextColor="#9E9E9E"
                                    keyboardType="numeric"
                                />
                            </View>
                            <LabelResults title="" currency="$">
                                {formatValue(formData.sale_price_dollars)}
                            </LabelResults>
                        </View>

                        {/* Ingresos */}
                        <View style={styles.row}>
                            <View style={styles.inputContainer}>
                                <ThemedText
                                    style={[styles.label, { color: textColor }]}
                                >
                                    Ingresos:
                                </ThemedText>
                            </View>
                            <LabelResults title="" currency="S/">
                                {formatValue(formData.income_soles)}
                            </LabelResults>
                            <LabelResults title="" currency="$">
                                {formatValue(formData.income_dollars)}
                            </LabelResults>
                        </View>

                        {/* Ganancias */}
                        <View style={styles.row}>
                            <View style={styles.inputContainer}>
                                <ThemedText
                                    style={[styles.label, { color: textColor }]}
                                >
                                    Ganancia:
                                </ThemedText>
                            </View>
                            <View style={styles.profitContainer}>
                                <View style={styles.profitValueContainer}>
                                    <ThemedText
                                        style={[
                                            styles.profitText,
                                            {
                                                color:
                                                    formData.profit_soles > 0
                                                        ? "#4CAF50"
                                                        : formData.profit_soles <
                                                          0
                                                        ? "#F44336"
                                                        : textColor,
                                                fontWeight:
                                                    formData.profit_soles !== 0
                                                        ? "700"
                                                        : "normal",
                                            },
                                        ]}
                                    >
                                        {formData.profit_soles !== 0
                                            ? `S/${formatValue(
                                                  formData.profit_soles
                                              )}`
                                            : "---"}
                                    </ThemedText>
                                </View>
                            </View>
                            <View style={styles.profitContainer}>
                                <View style={styles.profitValueContainer}>
                                    <ThemedText
                                        style={[
                                            styles.profitText,
                                            {
                                                color:
                                                    formData.profit_dollars > 0
                                                        ? "#4CAF50"
                                                        : formData.profit_dollars <
                                                          0
                                                        ? "#F44336"
                                                        : textColor,
                                                fontWeight:
                                                    formData.profit_dollars !==
                                                    0
                                                        ? "700"
                                                        : "normal",
                                            },
                                        ]}
                                    >
                                        {formData.profit_dollars !== 0
                                            ? `$${formatValue(
                                                  formData.profit_dollars
                                              )}`
                                            : "---"}
                                    </ThemedText>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Botones de acción */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={styles.resetButton}
                            onPress={resetForm}
                        >
                            <ThemedText style={styles.resetButtonText}>
                                volver a cotizar
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
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
        padding: 16,
    },
    header: {
        marginBottom: 24,
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.7,
    },
    form: {
        gap: 16,
    },
    row: {
        flexDirection: "row",
        gap: 18,
        alignItems: "flex-end",
    },
    inputContainer: {
        flex: 1,
    },
    wideInputContainer: {
        flex: 2,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 6,
    },
    input: {
        height: 38,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        textAlignVertical: "center",
        paddingTop: 0,
        paddingBottom: 0,
        includeFontPadding: false,
    },
    resultContainer: {
        flex: 1,
        alignItems: "center",
    },
    resultLabel: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 6,
        textAlign: "center",
    },
    resultValueContainer: {
        height: 48,
        justifyContent: "center",
        alignItems: "center",
        minWidth: 80,
        width: "100%",
    },
    resultText: {
        fontSize: 16,
        textAlign: "center",
    },
    tributosSection: {
        marginTop: 28,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: "#FF8C00",
    },
    rentabilitySection: {
        marginTop: 28,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: "#3a3a3c",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 24,
    },
    transferContainer: {
        flex: 2,
        paddingTop: 10,
        justifyContent: "center",
        alignItems: "flex-end",
        paddingRight: 1,
    },
    transferLabel: {
        fontSize: 16,
        fontWeight: "600",
        textAlign: "right",
    },
    transferResultContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    transferValue: {
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
    profitContainer: {
        flex: 1,
        alignItems: "center",
    },
    profitValueContainer: {
        height: 48,
        justifyContent: "center",
        alignItems: "center",
        minWidth: 80,
        width: "100%",
    },
    profitText: {
        fontSize: 16,
        textAlign: "center",
    },
    actionButtons: {
        marginTop: 32,
        marginBottom: 80,
        alignItems: "center",
    },
    resetButton: {
        paddingHorizontal: 18,
        paddingVertical: 6,
        borderRadius: 8,
        borderColor: "#d8d3d4",
        borderWidth: 1,
    },
    resetButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "500",
    },
    percentageContainer: {
        flex: 0.8,
        justifyContent: "center",
        alignItems: "center",
    },
    percentageText: {
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
    tributeResultContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    tributeResultText: {
        fontSize: 16,
        textAlign: "center",
        fontWeight: "600",
    },
    tributosContent: {
        gap: 20,
    },
    tributeRow: {
        flexDirection: "row",
        gap: 18,
        alignItems: "flex-end",
        marginBottom: 4,
    },
})
