import moment from 'moment';

const equivalentToADayInMinutes = 1440;
const equivalentToAMinute = 60;

interface eventProps {
  hour_start?: string;
  date_start?: string;
}

/** @params function Allows you to disable the days before and after a certain range based on a start date and a number of additional minutes  */
export const disabledEndDate = (endValue: any, event: eventProps) => {
  const startDate = event?.date_start;
  const addExtraTime = moment(startDate).add(120 - equivalentToADayInMinutes, 'minutes');

  if (!endValue || !startDate) {
    return false;
  }

  /** Disable of days after the limit of the event */
  if (endValue.valueOf() > moment(addExtraTime).valueOf()) {
    return true;
  }

  /** Disable of days after the limit of the event */
  return endValue.valueOf() < startDate.valueOf();
};

/** @params feature Allows you to disable the hours before and after a certain range based on a start time and number of additional minutes  */
const disableHoursRange = (event: eventProps) => {
  const result = [];
  const hourStart = event?.hour_start;
  /** We add 60 more minutes to discriminate the current time, this affects the free plans */
  const addExtraTime = moment(hourStart).add(120 + equivalentToAMinute, 'minutes');

  /** We iterate to be able to discriminate the hours before the start */
  for (let InitialHour = 0; InitialHour < moment(hourStart).hour(); InitialHour++) {
    result.push(InitialHour);
  }

  /** We iterate to be able to discriminate the hours after the limit */
  for (let finalHour = addExtraTime.hour(); finalHour < 24; finalHour++) {
    result.push(finalHour);
  }

  return result;
};
/** @params function  Disables minutes different from those established in an initial hour */
const disableMinutesRange = (event: eventProps) => {
  const result = [];
  const hour_start = event.hour_start;
  /** A minute is added to be able to show the current minute of the start date available */
  const addExtraTime = moment(hour_start).add(1, 'minutes');
  /** We iterate to be able to discriminate the minutes before the start */
  for (let initialMinutes = 0; initialMinutes < moment(hour_start).minute(); initialMinutes++) {
    result.push(initialMinutes);
  }

  /** We iterate to be able to discriminate the minutes after the limit */
  for (let endMinutes = addExtraTime.minute(); endMinutes < 60; endMinutes++) {
    result.push(endMinutes);
  }

  return result;
};

export const disabledDateTime = (event: {}) => ({
  //debugger: console.log('event => ', event),
  disabledHours: () => disableHoursRange(event),
  disabledMinutes: () => disableMinutesRange(event),
  // disabledSeconds: () => [55, 56],
});
