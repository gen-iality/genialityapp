import React, { useState, useEffect, useContext } from 'react';
import WOWZAPlayer from '../../livetransmision/WOWZAPlayer';
import { getLiveStreamStatus, getLiveStreamStats } from 'adaptors/wowzaStreamingAPI';
import { CurrentUserContext } from 'Context/userContext';

function WowzaStreamingPlayer({ meeting_id,transmition,activity }) {
  const [livestreamStats, setLivestreamStats] = useState(null);
  const userContext=useContext(CurrentUserContext)
  const [visibleMeets,setVisibleMeets]=useState(true)
  //   const [livestreamStatus, setLivestreamStatus] = useState(null);
  const urlDefault='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4FLnQiNROZEVxb5XJ2yTan-j7TZKt-SI7Bw&usqp=CAU';
  const eviusmeetUrl=`https://eviusmeets.netlify.app/?meetingId=${activity._id}&rol=0&username=${userContext.value?.names}&email=${userContext.value?.email}&photo=${userContext.value?.picture || urlDefault}`;
  console.log("User_ID==>",userContext.value) 

  let timer_id = null;

  const executer_startMonitorStatus = async () => {
    let live_stream_status = null;
    let live_stream_stats = null;
    try {
      live_stream_status = await getLiveStreamStatus(meeting_id);
      //   setLivestreamStatus(live_stream_status);
      live_stream_stats = await getLiveStreamStats(meeting_id);
      setLivestreamStats(live_stream_stats);
    } catch (e) {}
    timer_id = setTimeout(executer_startMonitorStatus, 5000);

    if (live_stream_status && live_stream_status.state === 'stopped') {
      clearTimeout(timer_id);
    }
  };

  useEffect(()=>{
  if(visibleMeets){
    if(timer_id){
      clearTimeout(timer_id);
      setLivestreamStats(null);
    }
  }else{
    if(!timer_id){
      executer_startMonitorStatus();  
    }
  }
  },[visibleMeets])

  useEffect(() => {
    if (!meeting_id) return;   
    !visibleMeets && executer_startMonitorStatus();          
    return () => {
      clearTimeout(timer_id);
      setLivestreamStats(null);
    };
  }, [meeting_id]);

  return (
    <>
      {livestreamStats?.connected.value === 'Yes' ? (
        ((transmition=='EviusMeet' && !visibleMeets ) || (transmition!=='EviusMeet')) &&<WOWZAPlayer meeting_id={meeting_id} thereIsConnection={livestreamStats?.connected.value} />
      ) : (
        <>
        {((transmition=='EviusMeet' && !visibleMeets ) || (transmition!=='EviusMeet')) && <WOWZAPlayer meeting_id={meeting_id} thereIsConnection={livestreamStats?.connected.value} />}
        {transmition=='EviusMeet' && visibleMeets && <div style={{height:500}}>
          <iframe width={'100%'} style={{height:480}}
           allow='autoplay; fullscreen; camera *;microphone *'
           allowFullScreen
           allowusermedia
          src={eviusmeetUrl}></iframe>
          </div>}
        </>
      )}
      {/* {livestreamStatus?.state === 'started' ? (
        <>
          {livestreamStats?.connected.value === 'Yes' ? (
            <WOWZAPlayer meeting_id={meeting_id} />
          ) : (
            <WOWZAPlayer meeting_id={meeting_id} thereIsConnection={livestreamStats?.connected.value} />
          )}
        </>
      ) : (
        <h1>Streaming detenido</h1>
      )} */}
    </>
  );
}

export default WowzaStreamingPlayer;
