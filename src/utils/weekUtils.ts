import {formatDateToCustomStringWithDots, formatDateToCustomStringWithUnderscore} from "./dateUtils";

export function getWeekdaysProSupl(dateInput: string) {
    const date = new Date(dateInput);
    const day = date.getDay();
    const startOfWeek = new Date(date);
    const endOfWeek = new Date(date);

    if (day === 0) {
        startOfWeek.setDate(date.getDate() + 1);
        endOfWeek.setDate(date.getDate() + 5);
    } else if (day === 6) {
        startOfWeek.setDate(date.getDate() + 2);
        endOfWeek.setDate(date.getDate() + 4);
    } else {
        const offsetToMonday = day === 1 ? 0 : 1 - day;
        startOfWeek.setDate(date.getDate() + offsetToMonday);
        const offsetToFriday = day === 5 ? 0 : 5 - day;
        endOfWeek.setDate(date.getDate() + offsetToFriday);
    }

    const weekdays = [];
    const current = new Date(startOfWeek);

    while (current <= endOfWeek) {
        weekdays.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    return weekdays.map(d => formatDateToCustomStringWithUnderscore(d));
}

export function getWeekdays(dateInput: string) {
    const date = new Date(dateInput);
    const day = date.getDay();
    const startOfWeek = new Date(date);
    const endOfWeek = new Date(date);

    if (day === 0) {
        startOfWeek.setDate(date.getDate() + 1);
        endOfWeek.setDate(date.getDate() + 5);
    } else if (day === 6) {
        startOfWeek.setDate(date.getDate() + 2);
        endOfWeek.setDate(date.getDate() + 4);
    } else {
        const offsetToMonday = day === 1 ? 0 : 1 - day;
        startOfWeek.setDate(date.getDate() + offsetToMonday);
        const offsetToFriday = day === 5 ? 0 : 5 - day;
        endOfWeek.setDate(date.getDate() + offsetToFriday);
    }

    const weekdays = [];
    const current = new Date(startOfWeek);

    while (current <= endOfWeek) {
        weekdays.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    return weekdays.map(d => formatDateToCustomStringWithDots(d));
}

export function getPreviousFridayAndNextMonday(dateInput: string) {
    const date = new Date(dateInput);
    const day = date.getDay();

    const previousFriday = new Date(date);
    const nextMonday = new Date(date);

    if (day === 0) {
        previousFriday.setDate(date.getDate() - 2);
        nextMonday.setDate(date.getDate() + 8);
    } else if (day === 1) {
        previousFriday.setDate(date.getDate() - 3);
        nextMonday.setDate(date.getDate() + 7);
    } else if (day === 6) {
        previousFriday.setDate(date.getDate() - 1);
        nextMonday.setDate(date.getDate() + 9);
    } else {
        previousFriday.setDate(date.getDate() - (day + 2));
        nextMonday.setDate(date.getDate() + (8 - day));
    }

    return {
        previousFriday: formatDateToCustomStringWithDots(previousFriday),
        nextMonday: formatDateToCustomStringWithDots(nextMonday),
    };
}

export function getWeekNumber(date: Date): number {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDays = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);
}

export function isOddOrEvenWeek(date: Date = new Date()): string {
    const weekNumber = getWeekNumber(date);
    return weekNumber % 2 === 0 ? "Sudý týden" : "Lichý týden";
}