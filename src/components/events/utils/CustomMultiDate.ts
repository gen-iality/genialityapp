import { DateRangeEvius, dayToKey } from "../hooks/useCustomDateEvent";

export const dateToCustomDate = (dateStart: Date, dateEnd: Date): DateRangeEvius[] => {
    let currentDate = new Date(dateStart);
    let newDateRanges: DateRangeEvius[] = [];
    while (currentDate <= dateEnd) {

        const currentDateStart = new Date(currentDate);
        const curretDateEnd = new Date(currentDate);

        
        curretDateEnd.setHours(dateEnd.getHours())
        curretDateEnd.setMinutes(dateEnd.getMinutes())
        
        console.log({currentDateStart,curretDateEnd})
        const newDateRange = {
            id: dayToKey(new Date(currentDateStart)),
            start: new Date(currentDateStart),
            end: new Date(curretDateEnd),
        };
        newDateRanges.push(newDateRange);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return newDateRanges
}