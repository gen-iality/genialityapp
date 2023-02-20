import { useState, useEffect, useContext } from 'react';
import WOWZAPlayer from '../../livetransmision/WOWZAPlayer';
import { CurrentUserContext } from '../../../context/userContext';
import { Grid } from 'antd';
import AgendaContext from '../../../context/AgendaContext';
import { CurrentEventUserContext } from '../../../context/eventUserContext';
import { getLiveStreamStatus } from '../../../adaptors/gcoreStreamingApi';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { UseEventContext } from '@/context/eventContext';

const { useBreakpoint } = Grid;

interface Props {
	meeting_id: string;
	transmition: string;
	activity: any;
}

function WowzaStreamingPlayer(props: Props) {
	const { meeting_id, transmition, activity } = props;
	console.log(transmition);
	const screens = useBreakpoint();
	const [livestreamStats, setLivestreamStats] = useState<any>(null);
	const userContext = useContext(CurrentUserContext);
	// const eventContext = UseEventContext()
	const agendaContext = useContext(AgendaContext);
	const { request, typeActivity } = agendaContext;
	const eventUser = useContext(CurrentEventUserContext);
	console.log({ agendaContext });
	const [visibleMeets, setVisibleMeets] = useState(false);
	const [timer_id, setTimerId] = useState<NodeJS.Timeout | null>(null);

	//   const [livestreamStatus, setLivestreamStatus] = useState(null);
	const urlDefault =
		'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4FLnQiNROZEVxb5XJ2yTan-j7TZKt-SI7Bw&usqp=CAU';
	const eviusmeetUrl = `https://stagingeviusmeet.netlify.app/?meetingId=${activity?._id}&rol=0&username=${
		userContext.value?.names
	}&email=${userContext.value?.email}&photo=${userContext.value?.picture || urlDefault}`;

	useEffect(() => {
		if (transmition !== 'EviusMeet' || !eventUser?.value) return;
		if (request && request[eventUser?.value?._id] && request[eventUser?.value?._id].active) {
			setVisibleMeets(true);
		} else {
			setVisibleMeets(false);
		}
	}, [transmition, request, eventUser?.value]);

	const executer_startMonitorStatus = async () => {
		console.log('executer_startMonitorStatus==>', meeting_id, typeActivity);
		if (meeting_id === null || meeting_id === '' || typeActivity === 'url' || typeActivity === 'video') return;
		let live_stream_status = null;
		try {
			//console.log('meeting_id INGRESA ACA==>', meeting_id == null, meeting_id == undefined, typeof meeting_id);
			live_stream_status = await getLiveStreamStatus(meeting_id);
			//   setLivestreamStatus(live_stream_status);
			live_stream_status && setLivestreamStats(live_stream_status);
			/* console.log('live_stream_status=>', live_stream_status); */
			//!live_stream_status?.active && timer_id && clearInterval(timer_id )
			const timerId = setTimeout(executer_startMonitorStatus, 5000);
			setTimerId(timerId);
			// console.log('live_stream_status===>', live_stream_status);
		} catch (e) {
			//console.log("EXCEPCION===>",e)
			timer_id && clearInterval(timer_id);
		}
	};
	//ESCUCHA CUANDO LA TRANSMISION SE DETIENE
	useEffect(() => {
		if (!livestreamStats?.active) {
			if (timer_id) clearTimeout(timer_id);
			setTimerId(null);
		}
	}, [livestreamStats]);

	// SI EXISTE UN MEETING ID SE EJECUTA EL MONITOR, PERO SE QUEDA COLGADO (TIMER)
	useEffect(() => {
		/* console.log('meeting_ID==>', meeting_id); */
		if (!meeting_id && timer_id) clearTimeout(timer_id);
		if (!meeting_id && (typeActivity == 'youTube' || typeActivity == 'vimeo' || !typeActivity)) return;
		executer_startMonitorStatus();
		return () => {
			if (timer_id) clearTimeout(timer_id);
			setLivestreamStats(null);
		};
	}, [meeting_id, typeActivity]);

	return (
		<>
			{livestreamStats?.live ? (
				<>
					{((transmition == 'EviusMeet' && !visibleMeets) || transmition !== 'EviusMeet') && (
						// <p>Render Evius Meet 1</p>
						<WOWZAPlayer meeting_id={meeting_id} thereIsConnection={livestreamStats?.live} />
					)}
					{transmition == 'EviusMeet' && visibleMeets && (
						// <p>Render Evius Meet 2</p>
						<div style={{ aspectRatio: screens.xs ? '9/12' : '16/9' }}>
							<iframe
								width={'100%'}
								style={{ height: '100%' }}
								allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; camera; microphone;allow-top-navigation;allow-same-origin;allow-scripts;allow-popups;allow-forms;allow-modals;allow-orientation-lock'
								// allow='autoplay; fullscreen; camera *;microphone *'
								// sandbox='allow-scripts;allow-presentation; allow-modals'
								allowFullScreen
								// allowusermedia
								src={eviusmeetUrl}></iframe>
						</div>
					)}
				</>
			) : (
				<>
					{console.log({ activity })}
					{((transmition == 'EviusMeet' && !visibleMeets) || transmition !== 'EviusMeet') && (
						// <p>Render Evius Meet 3</p>
						<JitsiMeeting
							domain='meet.evius.co'
							roomName={activity?._id}
							invitees={[]}
							configOverwrite={{
								disableInviteFunctions: true,
								// dynamicBrandingUrl:
								// 	'https://github.com/jitsi/jitsi-meet/blob/master/resources/custom-theme/custom-theme.json',
								readOnlyName: true,
								disablePolls: true,
								disableReactions: true,
								disableReactionsModeration: true,
								// enableClosePage: true,
								defaultLanguage: 'es',
								disableProfile: true,
								// hideConferenceTimer: true,
								hideConferenceSubject: true,
								// startSilent: true,
								// screenshotCapture: {
								// 	//  Enables the screensharing capture feature.
								// 	enabled: true,

								// 	//  The mode for the screenshot capture feature.
								// 	//  Can be either 'recording' - screensharing screenshots are taken
								// 	//  only when the recording is also on,
								// 	//  or 'always' - screensharing screenshots are always taken.
								// 	mode: 'recording',
								// },
								disabledNotifications: [
									'notify.chatMessages', // shown when receiving chat messages while the chat window is closed
								],
								toolbarButtons: [
									'hangup',
									// 'desktop',  // Optional
									'microphone',
									'camera',
									// 'chat',  // Optional
									// 'raisehand',  // Optional
									'participants-pane',
									'tileview',
									'settings',
									'fullscreen',
									// 'feedback',
									//    'closedcaptions',
									//    'download',
									//    'embedmeeting',
									//    'etherpad',
									//    'filmstrip',
									//    'help',
									//    'highlight',
									//    'invite',
									//    'linktosalesforce',
									//    'livestreaming',
									//    'noisesuppression',
									//    'profile',
									//    'recording',
									//    'security',
									//    'select-background',
									//    'shareaudio',
									// 'sharedvideo',
									//    'shortcuts',
									//    'stats',
									//    'toggle-camera',
									//    'videoquality',
									//    'whiteboard',
								],

								// welcomePage: {
								// 	// Whether to disable welcome page. In case it's disabled a random room
								// 	// will be joined when no room is specified.
								// 	disabled: false,
								// 	// If set,landing page will redirect to this URL.
								// 	customUrl: '',
								// },
							}}
							// interfaceConfigOverwrite={{
							// 	BRAND_WATERMARK_LINK: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
							// 	DEFAULT_WELCOME_PAGE_LOGO_URL:
							// 		'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
							// 	SHOW_BRAND_WATERMARK: true,
							// }}
							userInfo={{
								displayName: eventUser?.value?.user?.names,
								email: eventUser?.value?.user?.email,
							}}
							getIFrameRef={wrapperRef => {
								wrapperRef.style.height = '600px';
								wrapperRef.lang = 'es';
								const iframeRef = wrapperRef.children[0];
								console.log(iframeRef);
								if (iframeRef instanceof HTMLIFrameElement) {
									// iframeRef.src = '';
									// iframeRef.contentWindow?.location.reload();
								}
							}}
							onApiReady={externalApi => {
								// externalApi.
								// console.log('Eyyyyyyyy');
								// console.log(externalApi.eventNames);
								// // externalApi.isModerationOn().then(res => console.log(res))
								// console.log({ participants: externalApi.getParticipantsInfo() });
								// externalApi.dispose()
							}}
						/>
						// <WOWZAPlayer meeting_id={meeting_id} thereIsConnection={livestreamStats?.live} />
					)}
					{transmition == 'EviusMeet' && visibleMeets && (
						// <p>Render Evius Meet 4</p>
						<div style={{ aspectRatio: screens.xs ? '9/12' : '16/9' }}>
							<iframe
								width={'100%'}
								style={{ height: '100%' }}
								allow='autoplay; fullscreen; camera *;microphone *'
								// sandbox='allow-scripts;allow-presentation; allow-modals'
								allowFullScreen
								// allowusermedia
								src={eviusmeetUrl}></iframe>
						</div>
					)}
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
