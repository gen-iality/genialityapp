import React, { useState, useEffect } from 'react';
import { UseUserEvent } from '../../Context/eventUserContext';
import { isHost } from '../../helpers/helperEventUser';
import { UseEventContext } from '../../Context/eventContext';

const getMeetingPath = (platform, name, email, meeting_id, generalTabs, isHost) => {
  if (platform === 'zoom') {
    const url_conference = `https://gifted-colden-fe560c.netlify.com/?meetingNumber=`;
    return (
      url_conference +
      meeting_id +
      `&userName=${name}` +
      `&email=${email}` +
      `&disabledChat=${generalTabs?generalTabs.chat:false}` +
      `&host=${isHost}`
    );
  } else if (platform === 'vimeo') {
    return `https://player.vimeo.com/video/${meeting_id}`;
  } else if (platform === 'dolby') {
    return `https://eviusmeets.netlify.app/?username=${name}&email=${email}`;
  }
};

const IframeZoomComponent = ({ platform, name, email, meeting_id, generalTabs, isHost }) => (
  <iframe
    src={getMeetingPath(platform, name, email, meeting_id, generalTabs, isHost)}
    frameBorder='0'
    allow='autoplay; fullscreen; camera *;microphone *'
    allowFullScreen
    allowusermedia
    className='video'></iframe>
);

const ZoomIframe = ({ platform, meeting_id, generalTabs }) => {
  let cEventuser = UseUserEvent();
  let cEvent = UseEventContext();
  const [userEvent, setuserEvent] = useState({});
  useEffect(() => {
    if (!cEventuser.value || !cEvent.value) return;
    let { displayName, email } = cEventuser.value.properties;
    setuserEvent({ displayName: displayName, email: email, isHostuser: isHost(cEventuser.value, cEvent.value) });
  }, [cEventuser.value, cEvent.value]);

  return (
    <IframeZoomComponent
      platform={platform}
      name={userEvent.displayName}
      email={userEvent.email}
      meeting_id={meeting_id}
      generalTabs={generalTabs}
      isHost={userEvent.isHostuser}
    />
  );
};

export default ZoomIframe;
