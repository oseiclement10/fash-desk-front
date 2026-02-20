import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

export const formatPrettyDate = (date: string | Date) => {
    return dayjs(date).format("Do MMM, YYYY [|] h:mm a");
};



export const formatDate = (dateString: string, full = true) => {
    if (!dateString) return "n/a";
    const date = new Date(dateString);
    if (isNaN(date?.getTime())) return "n/a";

    return date.toLocaleDateString('en-US', full ? {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    } : {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export function formatTimeTo12Hour(time: string): string {
    return dayjs(time, "HH:mm:ss").format("h A");
}