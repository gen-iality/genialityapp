import moment from "moment";
import { useIntl } from 'react-intl';

const useDateFormat = () => {
    
    const defaultFormat = 'DD/MM/YYYY';   
    const defaultFormatHours = 'hh:mm A';
    const intl = useIntl();
    moment.locale(intl.locale);  

    const dateFormat = (date? : string | Date, format = defaultFormat) =>{
        const defaultDate = '01/01/1999'
        return moment(date || defaultDate).format(format)
    }

    const hoursFormat = (hours : string[], format = defaultFormatHours) =>{
      const defaultHours = ['00:00: AM','00:00 AM']  
      const hoursFormat = hours.map((hour) => moment(hour).format(format))
      return hoursFormat.length > 0 ? hoursFormat : defaultHours
    }


    return {
        dateFormat,
        hoursFormat
    }
 }

 export default useDateFormat;