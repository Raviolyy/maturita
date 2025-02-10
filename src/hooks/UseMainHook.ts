import { useEffect } from 'react';
import {getWeekdays, isOddOrEvenWeek} from "../utils/weekUtils";

const UseMainHook = (navigation: any,
                     selectedDate: Date | undefined,
                     selection:string |undefined,
                     setAvailableDates: (dates: string[]) => void,
                     setWeekType: (type: string) => void,
                     setIsLoading: (loading: boolean) => void,
                     getTeacher: () => Promise<any>,
                     getOfflineData: any,
                     fetchSubstituteData: any,) => {

    useEffect(() => {
        let date: string;
        setIsLoading(true);

        if (selectedDate) {
            date = selectedDate.toISOString().split('T')[0];
        } else {
            date = new Date().toISOString().split('T')[0];
        }

        const weekdays = getWeekdays(date);
        setAvailableDates(weekdays);
        setWeekType(isOddOrEvenWeek(selectedDate));

        getTeacher()
            .then(getOfflineData)
            .then(fetchSubstituteData)
            .then(() => {
                navigation.setOptions({
                    title: selection,
                });
                setIsLoading(false);

            });
    }, [selectedDate, selection, setAvailableDates, setWeekType, setIsLoading, navigation]);
};

export default UseMainHook;