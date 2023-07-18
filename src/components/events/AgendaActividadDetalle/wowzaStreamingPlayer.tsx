import { useState, useEffect, useContext } from 'react';
import WOWZAPlayer from '../../livetransmision/WOWZAPlayer';
import { CurrentUserContext } from '../../../context/userContext';
import { Grid, Result } from 'antd';
import AgendaContext from '../../../context/AgendaContext';
import { CurrentEventUserContext } from '../../../context/eventUserContext';
import { getLiveStreamStatus } from '../../../adaptors/gcoreStreamingApi';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { UseEventContext } from '@/context/eventContext';
import { firestore } from '@/helpers/firebase';
import { MeetConfig } from '@/components/agenda/activityType/components/manager/ShareMeetLinkCard';
import Loading from '@/components/loaders/loading';
import IMeetingProps from '@jitsi/react-sdk/lib/types/IMeetingProps';

const { useBreakpoint } = Grid;

interface RenderEviusMeetProps {
	eventId: string;
	activityId: string;
	userInfo: IMeetingProps['userInfo'];
}

export function RenderEviusMeet(props: RenderEviusMeetProps) {
	const { userInfo, activityId, eventId } = props;
	const [meetConfig, setMeetConfig] = useState<MeetConfig | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!!eventId && !!activityId) {
			console.log('Heyyyy One');
			console.log(`events/${eventId}/activities/${activityId}`);
			const unsubscribe = firestore
				.collection('events')
				.doc(eventId)
				.collection('activities')
				.doc(activityId)
				.onSnapshot(snapshot => {
					console.log('Heyyyy');
					const data = snapshot.data();
					if (data && Object.keys(data).includes('meetConfig')) {
						console.log(data);
						setMeetConfig(data.meetConfig);
					}
				});
			return () => unsubscribe();
		}
	}, [eventId, activityId]);

	if (loading) return <Loading />;
	if (!meetConfig) return <Result title={'La reunión aún no ha comenzado'} />;
	if (!!meetConfig && !meetConfig.openMeet) return <Result title={'La reunión ha finalizado'} />;
	if (!!meetConfig && !!meetConfig.openMeet)
		return (
			<JitsiMeeting
				domain='meet.evius.co'
				roomName={activityId}
				configOverwrite={{ ...meetConfig.config }}
				userInfo={userInfo}
				getIFrameRef={wrapperRef => {
					wrapperRef.style.height = '600px';
					wrapperRef.lang = 'es';
				}}
				onApiReady={externalApi => {
					console.log(externalApi);
				}}
			/>
		);
	return null;
}

interface Props {
	meeting_id: string;
	transmition: string;
	activity: any;
}

function WowzaStreamingPlayer(props: Props) {
	const { meeting_id, transmition, activity } = props;
	const contextEvent = UseEventContext();
	const screens = useBreakpoint();
	const [livestreamStats, setLivestreamStats] = useState<any>(null);
	const userContext = useContext(CurrentUserContext);
	const agendaContext = useContext(AgendaContext);
	const { request, typeActivity } = agendaContext;
	const eventUser = useContext(CurrentEventUserContext);
	const [visibleMeets, setVisibleMeets] = useState(false);
	const [timer_id, setTimerId] = useState<NodeJS.Timeout | null>(null);
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
		// console.log('executer_startMonitorStatus==>', meeting_id, typeActivity);
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

	// useEffect(() => {
	// 	console.log({ meeting_id, typeActivity, livestreamStats });
	// }, [meeting_id, typeActivity, livestreamStats]);

	if (typeActivity === 'meeting')
		return (
			<RenderEviusMeet
				activityId={activity._id}
				eventId={contextEvent?.value?._id}
				userInfo={{ displayName: eventUser?.value?.user?.names, email: eventUser?.value?.user?.email }}
			/>
		);

	return (
		<>
			{livestreamStats?.live ? (
				<>
					{((transmition == 'EviusMeet' && !visibleMeets) || transmition !== 'EviusMeet') && (
						<WOWZAPlayer meeting_id={meeting_id} thereIsConnection={livestreamStats?.live} />
					)}
					{transmition == 'EviusMeet' && visibleMeets && (
						<div style={{ aspectRatio: screens.xs ? '9/12' : '16/9' }}>
							<iframe
								width={'100%'}
								style={{ height: '100%' }}
								allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; camera; microphone;allow-top-navigation;allow-same-origin;allow-scripts;allow-popups;allow-forms;allow-modals;allow-orientation-lock'
								allowFullScreen
								src={eviusmeetUrl}></iframe>
						</div>
					)}
				</>
			) : (
				<>
					{((transmition == 'EviusMeet' && !visibleMeets) || transmition !== 'EviusMeet') && (
						<WOWZAPlayer meeting_id={meeting_id} thereIsConnection={livestreamStats?.live} />
					)}
					{transmition == 'EviusMeet' && visibleMeets && (
						// <p>Render Evius Meet 4</p>
						<div style={{ aspectRatio: screens.xs ? '9/12' : '16/9' }}>
							<iframe
								width={'100%'}
								style={{ height: '100%' }}
								allow='autoplay; fullscreen; camera *;microphone *'
								allowFullScreen
								src={eviusmeetUrl}></iframe>
						</div>
					)}
				</>
			)}
		</>
	);
}

export default WowzaStreamingPlayer;
