import { useState, useEffect } from 'react';
import { UseUserEvent } from '@context/eventUserContext';
import { isHost } from '../../helpers/helperEventUser';
import { UseEventContext } from '@context/eventContext';
import { getLiveStreamStatus, getLiveStreamStats, ResetLiveStream } from '../../adaptors/wowzaStreamingAPI';

const IframeZoomComponent = ({ platform, name, email, meeting_id, generalTabs, isHost }) => {
  const [ platformurl, setPlatformurl ] = useState(null);

  useEffect(() => {
    if (!meeting_id) return;
    getMeetingPath(platform, name, email, meeting_id, generalTabs, isHost);
    checkStreamStatus();
  }, [ meeting_id ]);

  const checkStreamStatus = async () => {
    let live_stream_status = await getLiveStreamStatus(meeting_id);
    setStreamStatus(live_stream_status);

    let live_stream_stats = await getLiveStreamStats(meeting_id);
    setStreamStats(live_stream_stats);

    setTimeout(checkStreamStatus, 5000);
  };

  const HandleResetLiveStream = async () => {
    await ResetLiveStream(meeting_id);
  };

  const getMeetingPath = async (platform, name, email, meeting_id, generalTabs, isHost) => {
    console.log('platform', platform);
    let url = null;
    switch (platform) {
      case 'zoom':
        let url_conference = `https://gifted-colden-fe560c.netlify.com/?meetingNumber=`;
        url =
          url_conference +
          meeting_id +
          `&userName=${name}` +
          `&email=${email}` +
          `&disabledChat=${generalTabs ? generalTabs.chat : false}` +
          `&host=${isHost}`;
        break;

      case 'vimeo':
        url = `https://player.vimeo.com/video/${meeting_id}`;
        break;
      case 'dolby':
        url = `https://stagingeviusmeet.netlify.app/?username=${name}&email=${email}`;
        break;
      case 'streaming':
        break;
    }
    /*
        let live_stream = await getLiveStreamConfig(meeting_id)

        //console.log('resss', res.data.live_stream);
        //url = res.data.live_stream.player_embed_code;
        url = live_stream.player_hls_playback_url;
      //url =  `https://stagingeviusmeet.netlify.app/?username=${name}&email=${email}`;
      setWowsaplayer(live_stream.player_id)
    }

    setPlatformurl(url);*/
    setPlatformurl(url);
  };

  return (
    <>
      {platform === 'streaming' ? (
        <>
          <WOWZAPlayer meeting_id={meeting_id} />
        </>
      ) : (
        <iframe
          src={platformurl}
          frameBorder='0'
          allow='autoplay; fullscreen; camera *;microphone *'
          allowFullScreen
          allowusermedia
          width='100%'
          height='100%'
          style={{ aspectRatio: '16/9' }}></iframe>
      )}
    </>
  );
};

const ZoomIframe = ({ platform, meeting_id, generalTabs }) => {
  let cEventuser = UseUserEvent();
  let cEvent = UseEventContext();
  const [ userEvent, setuserEvent ] = useState({});
  useEffect(() => {
    if (!cEventuser.value || !cEvent.value) return;
    let { displayName, email } = cEventuser.value.properties;
    setuserEvent({
      displayName: displayName,
      email: email,
      isHostuser: isHost(cEventuser.value, cEvent.value),
    });
  }, [ cEventuser.value, cEvent.value ]);

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
