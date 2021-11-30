import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { getLiveStream, getLiveStreamStatus, getLiveStreamStats } from 'adaptors/wowzaStreamingAPI';

function WOWZAPlayer({ meeting_id }) {
  const [wowsaplayer, setWowsaplayer] = useState(null);
  const [platformurl, setPlatformurl] = useState(null);
  const [streamStatus, setStreamStatus] = useState(null);
  const [streamStats, setStreamStats] = useState(null);

  useEffect(() => {
    if (!meeting_id) return;
    checkStreamStatus();

    let asyncfunction = async () => {
      let live_stream = await getLiveStream(meeting_id);
      //url = res.data.live_stream.player_embed_code;
      let url = live_stream.player_hls_playback_url;
      //url =  `https://eviusmeets.netlify.app/?username=${name}&email=${email}`;
      setWowsaplayer(live_stream.player_id);
      setPlatformurl(url);
    };

    asyncfunction();
  }, [meeting_id]);

  useEffect(() => {
    if (!wowsaplayer) return;
    console.log('rerender', wowsaplayer);
    const script = document.createElement('script');
    script.id = 'player_embed';
    script.src = '//player.cloud.wowza.com/hosted/' + wowsaplayer + '/wowza.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [wowsaplayer]);

  const checkStreamStatus = async () => {
    return;
    let live_stream_status = await getLiveStreamStatus(meeting_id);
    setStreamStatus(live_stream_status);

    let live_stream_stats = await getLiveStreamStats(meeting_id);
    setStreamStats(live_stream_stats);

    setTimeout(checkStreamStatus, 5000);
  };

  // useEffect(() => {
  //   if (!wowsaplayer) return;

  //   let scripSource = `WowzaPlayer.create('wowza_player',
  // 	{
  // 	"license":"AQUI LA LICENCIA CUANDO SE COMPRE",
  // 	"title":"My Wowza Player Autoplay Test",
  // 	"description":"This is my Wowza Player Video description.",
  // 	"sourceURL":"${platformurl}",
  // 	"autoPlay":true,
  // 	"mute":true,
  // 	"loop":false,
  // 	"audioOnly":false,
  // 	"uiShowQuickRewind":true,
  // 	"uiQuickRewindSeconds":"30"
  // 	}
  // );`;

  //   const scriptP = document.createElement('script');
  //   scriptP.id = 'player_embed';
  //   scriptP.text = scripSource;
  //   scriptP.async = true;
  //   document.body.appendChild(scriptP);
  //   return () => {
  //     document.body.removeChild(scriptP);
  //   };
  // }, [wowsaplayer]);

  return (
    <>
      <div id='wowza_player'></div>
      {/* <ReactPlayer
        width={'100%'}
        height={'35vw'}
        style={{
          display: 'block',
          margin: '0 auto',
        }}
        url={platformurl}
        controls
        config={{
          file: {
            forceHLS: true,
          },
        }}
      /> */}

      <p>
        {streamStatus && (
          <>
            <b>Streaming Status: </b>
            {streamStatus.state}
            <br />
          </>
        )}
        {streamStats && (
          <>
            <b>Origin Connected:</b> {streamStats.connected.value}
            <br />
          </>
        )}
        {streamStats && (
          <>
            <b>Origin Status:</b> {streamStats.connected.status}
            <br />
          </>
        )}
        {streamStats && (
          <>
            <b>Origin Problem reason: </b>
            {streamStats.connected.text}
            <br />
          </>
        )}
      </p>
    </>
  );
}

export default React.memo(WOWZAPlayer);
