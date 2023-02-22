import { Space, Typography } from 'antd';

export const notificationsItems = [
	{ key: 'connection.CONNFAIL', icon: <></>, label: 'shown when the connection fails,' },
	//{ key: 'dialog.cameraNotSendingData', icon: <></>, label: "shown when there's no feed from user's camera" },
	//{ key: 'dialog.kickTitle', icon: <></>, label: 'shown when user has been kicked' },
	//{ key: 'dialog.liveStreaming', icon: <></>, label: 'livestreaming notifications (pending, on, off, limits)' },
	//{ key: 'dialog.lockTitle', icon: <></>, label: 'shown when setting conference password fails' },
	//{ key: 'dialog.maxUsersLimitReached', icon: <></>, label: 'shown when maximmum users limit has been reached' },
	{ key: 'dialog.micNotSendingData', icon: <></>, label: "shown when user's mic is not sending any audio" },
	/* {
		key: 'dialog.passwordNotSupportedTitle',
		icon: <></>,
		label: 'shown when setting conference password fails due to password format',
	}, */
	//{ key: 'dialog.recording', icon: <></>, label: 'recording notifications (pending, on, off, limits)' },
	/* {
		key: 'dialog.remoteControlTitle',
		icon: <></>,
		label: 'remote control notifications (allowed, denied, start, stop, error)',
	}, */
	//{ key: 'dialog.reservationError', icon: <></>, label: '' },
	{ key: 'dialog.serviceUnavailable', icon: <></>, label: 'shown when server is not reachable' },
	{ key: 'dialog.sessTerminated', icon: <></>, label: 'shown when there is a failed conference session' },
	{
		key: 'dialog.sessionRestarted',
		icon: <></>,
		label: 'show when a client reload is initiated because of bridge migration',
	},
	//{ key: 'dialog.tokenAuthFailed', icon: <></>, label: 'show when an invalid jwt is used' },
	//{ key: 'dialog.transcribing', icon: <></>, label: 'transcribing notifications (pending, off)' },
	{ key: 'dialOut.statusMessage', icon: <></>, label: 'shown when dial out status is updated.' },
	//{ key: 'liveStreaming.busy', icon: <></>, label: 'shown when livestreaming service is busy' },
	//{ key: 'liveStreaming.failedToStart', icon: <></>, label: 'shown when livestreaming fails to start' },
	//{ key: 'liveStreaming.unavailableTitle', icon: <></>, label: 'shown when livestreaming service is not reachable' },
	/* {
		key: 'lobby.joinRejectedMessage',
		icon: <></>,
		label: "shown when while in a lobby, user's request to join is rejected",
	}, */
	/* {
		key: 'lobby.notificationTitle',
		icon: <></>,
		label: 'shown when lobby is toggled and when join requests are allowed / denied',
	}, */
	{
		key: 'notify.chatMessages',
		icon: <></>,
		label: 'shown when receiving chat messages while the chat window is closed',
	},
	{ key: 'notify.disconnected', icon: <></>, label: 'shown when a participant has left' },
	{ key: 'notify.connectedOneMember', icon: <></>, label: 'show when a participant joined' },
	{ key: 'notify.connectedTwoMembers', icon: <></>, label: 'show when two participants joined simultaneously' },
	{
		key: 'notify.connectedThreePlusMembers',
		icon: <></>,
		label: 'show when more than 2 participants joined simultaneously',
	},
	{ key: 'notify.leftOneMember', icon: <></>, label: 'show when a participant left' },
	{ key: 'notify.leftTwoMembers', icon: <></>, label: 'show when two participants left simultaneously' },
	{ key: 'notify.leftThreePlusMembers', icon: <></>, label: 'show when more than 2 participants left simultaneously' },
	{ key: 'notify.grantedTo', icon: <></>, label: 'shown when moderator rights were granted to a participant' },
	{ key: 'notify.hostAskedUnmute', icon: <></>, label: 'shown to participant when host asks them to unmute' },
	{ key: 'notify.invitedOneMember', icon: <></>, label: 'shown when 1 participant has been invited' },
	{ key: 'notify.invitedThreePlusMembers', icon: <></>, label: 'shown when 3+ participants have been invited' },
	{ key: 'notify.invitedTwoMembers', icon: <></>, label: 'shown when 2 participants have been invited' },
	//{ key: 'notify.kickParticipant', icon: <></>, label: 'shown when a participant is kicked' },
	//{ key: 'notify.linkToSalesforce', icon: <></>, label: 'shown when joining a meeting with salesforce integration' },
	//{ key: 'notify.moderationStartedTitle', icon: <></>, label: 'shown when AV moderation is activated' },
	//{ key: 'notify.moderationStoppedTitle', icon: <></>, label: 'shown when AV moderation is deactivated' },
	/* {
		key: 'notify.moderationInEffectTitle',
		icon: <></>,
		label: 'shown when user attempts to unmute audio during AV moderation',
	}, */
	/* {
		key: 'notify.moderationInEffectVideoTitle',
		icon: <></>,
		label: 'shown when user attempts to enable video during AV moderation',
	}, */
	/* {
		key: 'notify.moderationInEffectCSTitle',
		icon: <></>,
		label: 'shown when user attempts to share content during AV moderation',
	}, */
	{ key: 'notify.mutedRemotelyTitle', icon: <></>, label: 'shown when user is muted by a remote party' },
	{ key: 'notify.mutedTitle', icon: <></>, label: 'shown when user has been muted upon joining' },
	{ key: 'notify.newDeviceAudioTitle', icon: <></>, label: 'prompts the user to use a newly detected audio device' },
	{ key: 'notify.newDeviceCameraTitle', icon: <></>, label: 'prompts the user to use a newly detected camera' },
	/* {
		key: 'notify.participantWantsToJoin',
		icon: <></>,
		label: 'shown when lobby is enabled and participant requests to join meeting',
	}, */
	//{ key: 'notify.passwordRemovedRemotely', icon: <></>, label: 'shown when a password has been removed remotely' },
	//{ key: 'notify.passwordSetRemotely', icon: <></>, label: 'shown when a password has been set remotely' },
	{ key: 'notify.raisedHand', icon: <></>, label: 'shown when a partcipant used raise hand,' },
	{ key: 'notify.startSilentTitle', icon: <></>, label: 'shown when user joined with no audio' },
	//{ key: 'notify.unmute', icon: <></>, label: 'shown to moderator when user raises hand during AV moderation' },
	{ key: 'notify.videoMutedRemotelyTitle', icon: <></>, label: "shown when user's video is muted by a remote party," },
	//{ key: 'prejoin.errorDialOutDisconnected', icon: <></>, label: '' },
	//{ key: 'prejoin.errorDialOut', icon: <></>, label: '' },
	//{ key: 'prejoin.errorDialOutFailed', icon: <></>, label: '' },
	//{ key: 'prejoin.errorDialOutStatus', icon: <></>, label: '' },
	//{ key: 'prejoin.errorStatusCode', icon: <></>, label: '' },
	//{ key: 'prejoin.errorValidation', icon: <></>, label: '' },
	//{ key: 'recording.busy', icon: <></>, label: 'shown when recording service is busy' },
	//{ key: 'recording.failedToStart', icon: <></>, label: 'shown when recording fails to start' },
	//{ key: 'recording.unavailableTitle', icon: <></>, label: 'shown when recording service is not reachable' },
	{ key: 'toolbar.noAudioSignalTitle', icon: <></>, label: 'shown when a broken mic is detected' },
	{
		key: 'toolbar.noisyAudioInputTitle',
		icon: <></>,
		label: 'shown when noise is detected for the current microphone',
	},
	{ key: 'toolbar.talkWhileMutedPopup', icon: <></>, label: 'shown when user tries to speak while muted' },
	//{ key: 'transcribing.failedToStart', icon: <></>, label: 'shown when transcribing fails to start' },
].map(({ key, label, icon }) => ({
	key,
	render: (
		<Space>
			<Typography>{label}</Typography>
			<>{icon}</>
		</Space>
	),
}));
