
export const formatCurrency = (currency: number) => {
    return currency.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}
