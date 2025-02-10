export function formatDateToCustomStringWithDots(dateInput:Date) {
    const date = new Date(dateInput);

    const day = date.getDate();
    const month = date.getMonth() + 1;

    return `${day}. ${month}.`;
}
export function formatDateToCustomStringWithUnderscore(dateInput:Date) {
    const date = new Date(dateInput);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}_${month}_${day}`;
}