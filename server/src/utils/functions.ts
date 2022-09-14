export function convertHoursStringToMinutes(hourString: string) {
    const [hours, minutes] = hourString.split(':').map(Number);
    const minutesAmount = (hours * 60) + minutes;

    return minutesAmount;
}

export function convertMinutesToHoursString(minutesAmount: number) {
    const hours = String(minutesAmount / 60).padStart(2, '0');
    const minutes = String(minutesAmount % 60).padStart(2, '0');

    return `${hours}:${minutes}`;
}