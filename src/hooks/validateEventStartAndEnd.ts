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
}

const secondsBetweenTwoDates = ({ startDate = null, endDate = null }: EventInitialDates) => {
  const start = new Date(`${startDate}`);
  const end = new Date(`${endDate}`);

  return start.getTime() - end.getTime();
};

export const ValidateEventStart = ({ startDate = null, callBackTheEventIsActive = ({}) => {} }: EventInitialDates) => {
  let eventStartDate = new Date(`${startDate}`);
  var localDate = new Date();

  // callBackTheEventIsActive(false);
  // return null;
  if (eventStartDate <= localDate) {
    callBackTheEventIsActive(true);
  } else {
    if (eventStartDate >= localDate) {
      const difference = secondsBetweenTwoDates({ startDate, endDate: localDate.toString() });

      // console.log('🚀 ValidateEventStart ~ difference', difference);

      setTimeout(() => {
        callBackTheEventIsActive(true);
      }, difference);
    } else {
      callBackTheEventIsActive(false);
    }
  }
  return null;
};

export const ValidateEndEvent = ({ endDate = null, callBackTheEventIsActive = ({}) => {} }: EventInitialDates) => {
  let eventEndDate = new Date(`${endDate}`);
  var localDate = new Date();

  if (eventEndDate <= localDate) {
    callBackTheEventIsActive(false);
  } else {
    if (eventEndDate >= localDate) {
      const difference = secondsBetweenTwoDates({ startDate: endDate, endDate: localDate.toString() });

      /** The status starts at true for cases where it is a newly created event, because if the value is not set to true, we get undefined from firebase and it is understood that the end date of the event is less than the user's date and time. */

      callBackTheEventIsActive(true);
      setTimeout(() => {
        callBackTheEventIsActive(false);
      }, difference);
    } else {
      callBackTheEventIsActive(true);
    }
  }
  return null;
};
