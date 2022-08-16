import dayjs from 'dayjs';

const equivalentToADayInMinutes = 1440;
const equivalentToAHourInMinute = 60;

interface eventProps {
  hour_start?: string;
  date_start?: string;
  date_end?: string;
}
interface userConsumptionProps {
  start_date?: string;
  end_date?: string;
}

/** @function used for input type date in which the initial date of an event is captured, this will block days before an established date  */
export const disabledStartDate = (endValue: any, streamingHours: number, userConsumption: userConsumptionProps) => {
  /** by default the 365 days of the year are added, this is for users without a plan or with a basic plan. */
  let aditionalDays = 365;
  const startDate = new Date();

  const userConsumptionEndDate = userConsumption?.end_date;

  /** We look for the difference between the current day and the end of the user's plan */
  if (userConsumptionEndDate) {
    aditionalDays = dayjs(userConsumptionEndDate)
      .add(1, 'day')
      .diff(startDate, 'days');
  }

  if (!streamingHours) return;

  const addExtraTime = dayjs(startDate).add(aditionalDays, 'days');

  if (!endValue || !startDate) {
    return false;
  }

  /** Disable of days after the limit of the event */
  if (endValue.valueOf() > dayjs(addExtraTime).valueOf()) {
    return true;
  }

  /** Disable of days before the limit of the event */
  return endValue.valueOf() < startDate.valueOf();
};

/** @function used for input type date in which the end date of an event is captured, this will block days before and days after an established date  */
export const disabledEndDate = (endValue: any, event: eventProps, streamingHours: number) => {
  const startDate = event?.date_start;

  if (!streamingHours) return;

  const addExtraTime = dayjs(startDate).add(streamingHours - equivalentToADayInMinutes, 'minutes');

  if (!endValue || !startDate) {
    return false;
  }

  /** Disable of days after the limit of the event */
  if (endValue.valueOf() > dayjs(addExtraTime).valueOf()) {
    return true;
  }

  /** Disable of days after the limit of the event */
  return endValue.valueOf() < startDate.valueOf();
};

export const disabledStartDateTime = (event: {}, streamingHours: number) => ({
  disabledHours: () => disableStartHoursRange(event, streamingHours),
  disabledMinutes: () => disableMinutesRange(event, streamingHours),
  // disabledSeconds: () => [55, 56],
});

export const disabledEndDateTime = (event: {}, streamingHours: number) => ({
  disabledHours: () => disableEndHoursRange(event, streamingHours),
  disabledMinutes: () => disableMinutesRange(event, streamingHours),
  // disabledSeconds: () => [55, 56],
});

/** @function Allows you to disable the hours before and after a certain range based on a start time and number of additional minutes  */
const disableStartHoursRange = (event: eventProps, streamingHours: number) => {
  const result = [];
  const currentDate = new Date();
  /** We set the user's current time as the start time plus 30 minutes to ensure that when we finish creating the event, it does not start with the start and end dates blocked. */
  const hourStart = new Date(new Date().setMinutes(currentDate.getMinutes() + 30));

  if (!streamingHours) return;
  /** We add 60 more minutes to discriminate the current time, this affects the free plans */
  //   if(){}
  const addExtraTime = dayjs(hourStart).add(streamingHours + equivalentToAHourInMinute, 'minutes');

  const extraTimeHour = addExtraTime.hour();

  /** We iterate to be able to discriminate the hours before the start */
  for (let InitialHour = 0; InitialHour < dayjs(hourStart).hour(); InitialHour++) {
    result.push(InitialHour);
  }

  return result;
};

/** @function Allows you to disable the hours before and after a certain range based on a start time and number of additional minutes  */
const disableEndHoursRange = (event: eventProps, streamingHours: number) => {
  const result = [];
  let limit = 0;
  const hourStart = event?.hour_start;

  // const endDate = event?.date_end;
  if (!streamingHours) return;
  /** We add 60 more minutes to discriminate the current time, this affects the free plans */
  //   if(){}
  const addExtraTime = dayjs(hourStart).add(streamingHours + equivalentToAHourInMinute, 'minutes');
  const extraTimeHour = addExtraTime.hour();

  /** This validation is carried out, since when the start date was set to more than 8 at night, an end date cannot be chosen, since the for disables all the hours */
  if (extraTimeHour <= 2) {
    limit = 21;
  } else {
    limit = 24;
  }

  /** We iterate to be able to discriminate the hours before the start */
  for (let InitialHour = 0; InitialHour < dayjs(hourStart).hour(); InitialHour++) {
    result.push(InitialHour);
  }

  /** We iterate to be able to discriminate the hours after the limit */
  for (let finalHour = extraTimeHour; finalHour < limit; finalHour++) {
    if (streamingHours <= 120) result.push(finalHour);
  }

  return result;
};

/** @function Disables minutes different from those established in an initial hour */
const disableMinutesRange = (event: eventProps, streamingHours: number) => {
  const result = [];
  const hour_start = event.hour_start;
  if (!streamingHours) return;
  /** A minute is added to be able to show the current minute of the start date available */
  const addExtraTime = dayjs(hour_start).add(1, 'minutes');
  /** We iterate to be able to discriminate the minutes before the start */
  for (let initialMinutes = 0; initialMinutes < dayjs(hour_start).minute(); initialMinutes++) {
    result.push(initialMinutes);
  }

  /** We iterate to be able to discriminate the minutes after the limit */
  for (let endMinutes = addExtraTime.minute(); endMinutes < 60; endMinutes++) {
    result.push(endMinutes);
  }

  return result;
};
