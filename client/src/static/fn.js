export const handleNumber = (number) => {
    if (number > Math.pow(10, 6)) {
        return `${Math.round(number * 10 / Math.pow(10, 6)) / 10}M`
    } else if (number > Math.pow(10, 3)) {
        return `${Math.round(number * 10 / Math.pow(10, 3)) / 10}K`
    } else {
        return number
    }
}

