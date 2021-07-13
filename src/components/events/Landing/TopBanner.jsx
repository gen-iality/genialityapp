import React from 'react';
import BannerEvent from '../bannerEvent';
import { Link } from 'react-router-dom';
import { UseEventContext } from '../../../Context/eventContext';

const TopBanner = ({ currentActivity }) => {
  let cEvent = UseEventContext();
  let event = cEvent.value;

  if (!event) return null;
  let styles = event && event.styles ? event.styles : {};
  let bgImage = 'https://bulma.io/images/placeholders/1280x960.png';
  bgImage = styles.banner_image ? styles.banner_image : bgImage;

  return (
    <>
      {/* <h1>TOPBANNER{styles.show_banner ? 'yes' : 'false'}x</h1> */}
      {(styles.show_banner === undefined || styles.show_banner === 'true') && currentActivity === null && (
        <BannerEvent
          bgImage={bgImage}
          mobileBanner={styles.mobile_banner}
          bgImageText={styles.event_image}
          title={event.name}
          eventId={event._id}
          styles={styles}
          organizado={
            event.organizer && (
              <Link to={`/page/${event.organizer_id}?type=${event.organizer_type}`}>
                {event.organizer.name ? event.organizer.name : event.organizer.email}
              </Link>
            )
          }
          place={
            event.location && (
              <span>
                {event.venue} {event.location.FormattedAddress}
              </span>
            )
          }
          dateStart={event.date_start}
          dateEnd={event.date_end}
          dates={event.dates}
          type_event={event.type_event}
        />
      )}
    </>
  );
};
export default TopBanner;
