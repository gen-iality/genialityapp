import moment from "moment";
const useDateForm = () => {
    
    const defaultFormat = 'DD/MM/YYY'   
    const defaultFormatHours = 'hh:mm A'   

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

 export default useDateForm;