import moment from "moment";

export const getDateEvent = (event) => {
    if (!event) return <></>;
    const MIN_DATES = 1;
    const EVENT_WITH_ONE_DATE = 1;
    const FIRST_DATE = 0;
    if (event.dates?.length >= MIN_DATES) {
      const LAST_DATE = event.dates?.length - 1;
      if (event.dates?.length === EVENT_WITH_ONE_DATE) {
        return (
          <time dateTime={event.dates[FIRST_DATE]?.start}>
            {moment(event.dates[FIRST_DATE]?.start).format('DD MMM YYYY')}
          </time>
        );
      } else {
        return (
          <>
            <time dateTime={event.dates[FIRST_DATE]?.start}>
              {moment(event.dates[FIRST_DATE]?.start).format('DD MMM YYYY')}
            </time>
            {'-'}
            <time dateTime={event.dates[LAST_DATE]?.end}>
              {moment(event.dates[LAST_DATE].end)?.format('DD MMM YYYY')}
            </time>
          </>
        );
      }
    }
    if (moment(event.datetime_from).format('DD MMM YYYY') === moment(event.datetime_to).format('DD MMM YYYY')) {
      return (
        <>
          <time dateTime={event.datetime_from}>{moment(event.datetime_from).format('DD MMM YYYY')}</time>
        </>
      );
    }
    return (
      <>
        <time dateTime={event.datetime_from}>{moment(event.datetime_from).format('DD MMM YYYY')}</time>
        {'-'}
        <time dateTime={event.datetime_to}>{moment(event.datetime_to).format('DD MMM YYYY')}</time>
      </>
    );
  };