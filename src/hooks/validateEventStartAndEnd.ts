interface EventInitialDates {
  startDate?: string | null;
  endDate?: string | null;
  /** @params function Assigns the state to disable an element, changes the state that is used to validate that the component renders only once and does not loop example:   
   * const theEventIsActive = (state) => {
    this.setState({
      iMustBlockAFunctionality: state,
      iMustValidate: false,
    });
  }; */
  callBackTheEventIsActive?: ({}) => void;
  user?: { plan: {}; expiredPlan: boolean } | undefined;
}

const oneDayInMilliseconds = 86400000;

const secondsBetweenTwoDates = ({ startDate = null, endDate = null }: EventInitialDates) => {
  const start = new Date(`${startDate}`);
  const end = new Date(`${endDate}`);

  return start.getTime() - end.getTime();
};

export const ValidateEventStart = ({
  startDate = null,
  callBackTheEventIsActive = ({}) => {},
  user,
}: EventInitialDates) => {
  /**NOTE: callBackTheEventIsActive params: true indicates function blocking, false indicates function is still available. */
  const eventStartDate = new Date(`${startDate}`);
  const localDate = new Date();

  /** If I do not have an assigned plan, the dates of the event are not blocked. */
  if (!user?.plan) {
    callBackTheEventIsActive(false);
    return null;
  }

  /** If my plan expires, the dates of my event are blocked. */
  if (user?.expiredPlan) {
    callBackTheEventIsActive(true);
    return null;
  }

  /** If the start date of my event is less than or equal to my local date, the dates are blocked. */
  if (eventStartDate <= localDate) {
    callBackTheEventIsActive(true);
    return null;
  }

  /** If the start date of my event is greater than my local date, the difference is obtained and a setTimeout is started to block the dates. */
  if (eventStartDate > localDate) {
    const difference = secondsBetweenTwoDates({ startDate, endDate: localDate.toString() });

    if (difference < oneDayInMilliseconds)
      setTimeout(() => {
        callBackTheEventIsActive(true);
      }, difference);
  } else {
    callBackTheEventIsActive(false);
  }

  return null;
};

export const ValidateEndEvent = ({
  endDate = null,
  callBackTheEventIsActive = ({}) => {},
  user,
}: EventInitialDates) => {
  /**NOTE: callBackTheEventIsActive params: true indicates that the event is about to start or in progress, false indicates that the event has already passed, therefore everything is blocked. */
  const eventEndDate = new Date(`${endDate}`);
  const localDate = new Date();

  /** If I do not have an assigned plan, the buttons will not be blocked or the text that indicates a block will be displayed. */
  if (!user?.plan) {
    callBackTheEventIsActive(true);
    return null;
  }

  /** If my plan expires, the buttons are blocked or the text indicating a block will be displayed. */
  if (user?.expiredPlan) {
    callBackTheEventIsActive(false);
    return null;
  }

  /** If my end date is less than or equal to my current date, the buttons are blocked and texts are displayed indicating the blocking */
  if (eventEndDate <= localDate) {
    callBackTheEventIsActive(false);
    return null;
  }

  /** If my event's end date is greater than my local date, the difference is fetched and a setTimeout is started to block the dates. */
  if (eventEndDate > localDate) {
    const difference = secondsBetweenTwoDates({ startDate: endDate, endDate: localDate.toString() });

    /** The status starts at true for cases where it is a newly created event, because if the value is not set to true, we get undefined from firebase and it is understood that the end date of the event is less than the user's date and time. */

    callBackTheEventIsActive(true);
    /**  We validate that the difference is not greater than one day so as not to generate an error in the setTimeout. */
    if (difference < oneDayInMilliseconds)
      setTimeout(() => {
        callBackTheEventIsActive(false);
      }, difference);
  } else {
    callBackTheEventIsActive(true);
  }

  return null;
};
