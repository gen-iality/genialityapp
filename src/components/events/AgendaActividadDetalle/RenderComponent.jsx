import { useCallback, useContext, useEffect, useState } from 'react';
import WithEviusContext from '@context/withContext';
import ImageComponentwithContext from './ImageComponent';
import { useHelper } from '@context/helperContext/hooks/useHelper';
import { DolbyCard } from './DolbyCard';
import ZoomIframe from '../ZoomIframe';
import { VideoActivity } from './VideoActivity';
import GameDrawer from '../game/gameDrawer';
import { withRouter } from 'react-router-dom';
import { firestore } from '@helpers/firebase';
import HeaderColumnswithContext from './HeaderColumns';
import WowzaStreamingPlayer from './wowzaStreamingPlayer';
import AgendaContext from '@context/AgendaContext';

const RenderComponent = (props) => {
  const tabsdefault = {
    attendees: false,
    chat: true,
    games: true,
    surveys: false,
  };
  const [tabsGeneral, settabsGeneral] = useState(tabsdefault);
  const [activityState, setactivityState] = useState('');
  const [activityStateGlobal, setactivityStateGlobal] = useState('');
  const [renderGame, setRenderGame] = useState('');
  const [platform, setplatform] = useState('');
  const [meetingId, setmeetingId] = useState('');
  const [fnCiclo, setFnCiclo] = useState(false);
  // Estado para controlar origen de transmision
  const { transmition, setTransmition, setTypeActivity, typeActivity } = useContext(AgendaContext);
  const { currentActivity, chatAttendeChats, HandleChatOrAttende, HandlePublicPrivate, helperDispatch } = useHelper();

  async function listeningStateMeetingRoom(event_id, activity_id) {
    if (!fnCiclo) {
      const tempactivty = currentActivity;
      firestore
        .collection('events')
        .doc(event_id)
        .collection('activities')
        .doc(activity_id)
        .onSnapshot((infoActivity) => {
          if (!infoActivity.exists) return;
          const data = infoActivity.data();
          const { habilitar_ingreso, meeting_id, platform, tabs, avalibleGames } = data;
          setplatform(platform);
          settabsGeneral(tabs);
          setactivityState(habilitar_ingreso);
          setactivityStateGlobal(habilitar_ingreso);
          setmeetingId(meeting_id);
          setTransmition(data.transmition);
          setTypeActivity(data.typeActivity);
          if (!tabs.games) {
            HandleChatOrAttende('1');
            HandlePublicPrivate('public');
          }

          // handleChangeTabs(tabs);
          helperDispatch({ type: 'changeTabs', tabs: tabs });
          tempactivty.habilitar_ingreso = habilitar_ingreso;
          tempactivty.avalibleGames = avalibleGames;
          helperDispatch({ type: 'currentActivity', currentActivity: tempactivty });
          setFnCiclo(true);
          console.log('tempactivty', tempactivty);
        });
    }
  }
  useEffect(() => {
    async function GetStateMeetingRoom() {
      await listeningStateMeetingRoom(props.cEvent.value._id, currentActivity._id);
    }

    if (currentActivity != null) {
      GetStateMeetingRoom();
    }
  }, [currentActivity, props.cEvent]);

  useEffect(() => {
    if (chatAttendeChats === '4') {
      setRenderGame('game');
    } else {
      // No se debe quemar open meeteing room por que se cambia el estado al dar click en cualquier tab
      if (activityStateGlobal) {
        setactivityState(activityStateGlobal);
      }
    }
  }, [chatAttendeChats]);

  const RenderizarComponente = useCallback((plataforma, actividad_estado, reder_Game) => {
    switch (plataforma) {
      case 'vimeo':
        switch (actividad_estado) {
          case 'open_meeting_room':
            switch (reder_Game) {
              case 'game':
                return (
                  <>
                    <ZoomIframe platform={platform} meeting_id={meetingId} generalTabs={tabsGeneral} />
                    <GameDrawer />
                  </>
                );
            }
            return <ZoomIframe platform={platform} meeting_id={meetingId} generalTabs={tabsGeneral} />;

          case 'closed_meeting_room':
            return <ImageComponentwithContext willStartSoon />;

          case 'ended_meeting_room':
            return <VideoActivity />;
          case '':
          case 'created_meeting_room':
            return currentActivity?.video ? <VideoActivity /> : <ImageComponentwithContext />;
        }

      case 'zoom':
        switch (actividad_estado) {
          case 'open_meeting_room':
            switch (reder_Game) {
              case 'game':
                return (
                  <>
                    <ZoomIframe platform={platform} meeting_id={meetingId} generalTabs={tabsGeneral} />
                    <GameDrawer />
                  </>
                );
            }
            return <ZoomIframe platform={platform} meeting_id={meetingId} generalTabs={tabsGeneral} />;

          case 'closed_meeting_room':
            return <ImageComponentwithContext willStartSoon />;

          case 'ended_meeting_room':
            return <VideoActivity />;
          case '':
          case 'created_meeting_room':
            return currentActivity?.video ? <VideoActivity /> : <ImageComponentwithContext />;
        }

      case 'dolby':
        switch (actividad_estado) {
          case 'open_meeting_room':
            switch (reder_Game) {
              case 'game':
                return (
                  <>
                    <DolbyCard />
                    <GameDrawer />
                  </>
                );
            }
            return <DolbyCard />;

          case 'closed_meeting_room':
            return <ImageComponentwithContext willStartSoon />;

          case 'ended_meeting_room':
            return <VideoActivity />;
          case '':
          case 'created_meeting_room':
            return currentActivity?.video ? <VideoActivity /> : <ImageComponentwithContext />;
        }

      case 'wowza':
        switch (actividad_estado) {
          case 'open_meeting_room':
            switch (reder_Game) {
              case 'game':
                return (
                  <>
                    <WowzaStreamingPlayer activity={currentActivity} transmition={transmition} meeting_id={meetingId} />
                    <GameDrawer />
                  </>
                );
            }
            return (
              <>
                <WowzaStreamingPlayer activity={currentActivity} transmition={transmition} meeting_id={meetingId} />
              </>
            );

          case 'closed_meeting_room':
            {
            }
            return typeActivity === 'url' || typeActivity === 'video' ? (
              <WowzaStreamingPlayer activity={currentActivity} transmition={transmition} meeting_id={meetingId} />
            ) : (
              <ImageComponentwithContext willStartSoon />
            );

          case 'ended_meeting_room':
            return typeActivity === 'url' || typeActivity === 'video' ? (
              <WowzaStreamingPlayer activity={currentActivity} transmition={transmition} meeting_id={meetingId} />
            ) : (
              <VideoActivity />
            );
          case '':
          case 'created_meeting_room':
            return typeActivity === 'url' || typeActivity === 'video' ? (
              <WowzaStreamingPlayer activity={currentActivity} transmition={transmition} meeting_id={meetingId} />
            ) : currentActivity?.video ? (
              <VideoActivity />
            ) : (
              <ImageComponentwithContext />
            );
          case 'no_visibe':
            return <ImageComponentwithContext />;
          case null:
            return (
              <>
                <WowzaStreamingPlayer activity={currentActivity} transmition={transmition} meeting_id={meetingId} />
                <GameDrawer />
              </>
            );
        }
      case 'only':
        return (
          <>
            <WowzaStreamingPlayer activity={currentActivity} transmition={transmition} meeting_id={meetingId} />
            <GameDrawer />
          </>
        );
    }
  });

  return (
    <>
      {' '}
      <HeaderColumnswithContext isVisible activityState={activityState} />
      {RenderizarComponente(platform, activityState, renderGame)}
    </>
  );
};

export default withRouter(WithEviusContext(RenderComponent));
