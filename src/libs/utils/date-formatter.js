export function formatDate (dateString) {
    if (!dateString) return "-";
    
    try {
        const date = new Date(dateString);
        const formatter = new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",   // "dd"
            month: "2-digit", // "MM"
            year: "numeric",  // "yyyy"
            hour: "2-digit",  // "HH"
            minute: "2-digit",// "mm"
            hour12: false     // format 24 jam (hilangkan AM/PM)
        });
        const formattedDate = formatter.format(date).replace(",", "").replace(".", ":");

        return formattedDate;
    } catch {
        return dateString;
    }
};

export function jsonDateToInputDate(dateString) {
    if (!dateString) return "-";

    const dateObj = new Date(dateString);
    const formattedDate = dateObj.toISOString().split("T")[0]; 
    
    return formattedDate;
}