import { Card } from 'antd';
import Transfer, { TransferDirection } from 'antd/lib/transfer';
import React, { useState } from 'react';

const NOTIFICATIONS = [
	'connection.CONNFAIL', // shown when the connection fails,
	'dialog.cameraNotSendingData', // shown when there's no feed from user's camera
	'dialog.kickTitle', // shown when user has been kicked
	'dialog.liveStreaming', // livestreaming notifications (pending, on, off, limits)
	'dialog.lockTitle', // shown when setting conference password fails
	'dialog.maxUsersLimitReached', // shown when maximmum users limit has been reached
	'dialog.micNotSendingData', // shown when user's mic is not sending any audio
	'dialog.passwordNotSupportedTitle', // shown when setting conference password fails due to password format
	'dialog.recording', // recording notifications (pending, on, off, limits)
	'dialog.remoteControlTitle', // remote control notifications (allowed, denied, start, stop, error)
	'dialog.reservationError',
	'dialog.serviceUnavailable', // shown when server is not reachable
	'dialog.sessTerminated', // shown when there is a failed conference session
	'dialog.sessionRestarted', // show when a client reload is initiated because of bridge migration
	'dialog.tokenAuthFailed', // show when an invalid jwt is used
	'dialog.transcribing', // transcribing notifications (pending, off)
	'dialOut.statusMessage', // shown when dial out status is updated.
	'liveStreaming.busy', // shown when livestreaming service is busy
	'liveStreaming.failedToStart', // shown when livestreaming fails to start
	'liveStreaming.unavailableTitle', // shown when livestreaming service is not reachable
	'lobby.joinRejectedMessage', // shown when while in a lobby, user's request to join is rejected
	'lobby.notificationTitle', // shown when lobby is toggled and when join requests are allowed / denied
	'notify.chatMessages', // shown when receiving chat messages while the chat window is closed
	'notify.disconnected', // shown when a participant has left
	'notify.connectedOneMember', // show when a participant joined
	'notify.connectedTwoMembers', // show when two participants joined simultaneously
	'notify.connectedThreePlusMembers', // show when more than 2 participants joined simultaneously
	'notify.leftOneMember', // show when a participant left
	'notify.leftTwoMembers', // show when two participants left simultaneously
	'notify.leftThreePlusMembers', // show when more than 2 participants left simultaneously
	'notify.grantedTo', // shown when moderator rights were granted to a participant
	'notify.hostAskedUnmute', // shown to participant when host asks them to unmute
	'notify.invitedOneMember', // shown when 1 participant has been invited
	'notify.invitedThreePlusMembers', // shown when 3+ participants have been invited
	'notify.invitedTwoMembers', // shown when 2 participants have been invited
	'notify.kickParticipant', // shown when a participant is kicked
	'notify.linkToSalesforce', // shown when joining a meeting with salesforce integration
	'notify.moderationStartedTitle', // shown when AV moderation is activated
	'notify.moderationStoppedTitle', // shown when AV moderation is deactivated
	'notify.moderationInEffectTitle', // shown when user attempts to unmute audio during AV moderation
	'notify.moderationInEffectVideoTitle', // shown when user attempts to enable video during AV moderation
	'notify.moderationInEffectCSTitle', // shown when user attempts to share content during AV moderation
	'notify.mutedRemotelyTitle', // shown when user is muted by a remote party
	'notify.mutedTitle', // shown when user has been muted upon joining,
	'notify.newDeviceAudioTitle', // prompts the user to use a newly detected audio device
	'notify.newDeviceCameraTitle', // prompts the user to use a newly detected camera
	'notify.participantWantsToJoin', // shown when lobby is enabled and participant requests to join meeting
	'notify.passwordRemovedRemotely', // shown when a password has been removed remotely
	'notify.passwordSetRemotely', // shown when a password has been set remotely
	'notify.raisedHand', // shown when a partcipant used raise hand,
	'notify.startSilentTitle', // shown when user joined with no audio
	'notify.unmute', // shown to moderator when user raises hand during AV moderation
	'notify.videoMutedRemotelyTitle', // shown when user's video is muted by a remote party,
	'prejoin.errorDialOut',
	'prejoin.errorDialOutDisconnected',
	'prejoin.errorDialOutFailed',
	'prejoin.errorDialOutStatus',
	'prejoin.errorStatusCode',
	'prejoin.errorValidation',
	'recording.busy', // shown when recording service is busy
	'recording.failedToStart', // shown when recording fails to start
	'recording.unavailableTitle', // shown when recording service is not reachable
	'toolbar.noAudioSignalTitle', // shown when a broken mic is detected
	'toolbar.noisyAudioInputTitle', // shown when noise is detected for the current microphone
	'toolbar.talkWhileMutedPopup', // shown when user tries to speak while muted
	'transcribing.failedToStart', // shown when transcribing fails to start
];

const transferValues = NOTIFICATIONS.map(key => ({ key, label: key }));

const DEFAULT_DISABLE_NOTIFICATIONS = ['notify.chatMessages', 'notify.disconnected'];

interface Props {
	values?: string[];
	onChange?: (list: string[]) => void;
}

export default function Notifications(props: Props) {
	const [targetKeys, setTargetKeys] = useState(props.values || DEFAULT_DISABLE_NOTIFICATIONS);
	const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

	const onChange = (nextTargetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
		if (props.onChange) props.onChange(nextTargetKeys);
		setTargetKeys(nextTargetKeys);
	};

	const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
		setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
	};

	return (
		<Card title='Notificaciones de reunión'>
			<Transfer
				dataSource={transferValues}
				titles={['Activos', 'Desactivadoss']}
				targetKeys={targetKeys}
				selectedKeys={selectedKeys}
				onChange={onChange}
				onSelectChange={onSelectChange}
				render={item => item.label}
			/>
		</Card>
	);
}
