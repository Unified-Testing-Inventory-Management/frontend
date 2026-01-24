
export const formatDateTime = (dateTIme: string) => {
    return new Date(dateTIme).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}
