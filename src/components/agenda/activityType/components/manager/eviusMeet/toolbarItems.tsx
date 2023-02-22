import { Space, Typography } from "antd";

export const toolbarItems = [
	{ key: 'camera', icon: <></>, label: 'camera' },
	{ key: 'chat', icon: <></>, label: 'chat' },
	{ key: 'closedcaptions', icon: <></>, label: 'closedcaptions' },
	{ key: 'desktop', icon: <></>, label: 'desktop' },
	{ key: 'download', icon: <></>, label: 'download' },
	{ key: 'embedmeeting', icon: <></>, label: 'embedmeeting' },
	{ key: 'etherpad', icon: <></>, label: 'etherpad' },
	{ key: 'feedback', icon: <></>, label: 'feedback' },
	{ key: 'filmstrip', icon: <></>, label: 'filmstrip' },
	{ key: 'fullscreen', icon: <></>, label: 'fullscreen' },
	{ key: 'hangup', icon: <></>, label: 'hangup' },
	{ key: 'help', icon: <></>, label: 'help' },
	{ key: 'highlight', icon: <></>, label: 'highlight' },
	{ key: 'invite', icon: <></>, label: 'invite' },
	{ key: 'linktosalesforce', icon: <></>, label: 'linktosalesforce' },
	{ key: 'livestreaming', icon: <></>, label: 'livestreaming' },
	{ key: 'microphone', icon: <></>, label: 'microphone' },
	{ key: 'noisesuppression', icon: <></>, label: 'noisesuppression' },
	{ key: 'participants-pane icon: <></>,', label: 'participants' },
	{ key: 'profile', icon: <></>, label: 'profile' },
	{ key: 'raisehand', icon: <></>, label: 'raisehand' },
	{ key: 'recording', icon: <></>, label: 'recording' },
	{ key: 'security', icon: <></>, label: 'security' },
	{ key: 'select-background icon: <></>,', label: 'select' },
	{ key: 'settings', icon: <></>, label: 'settings' },
	{ key: 'shareaudio', icon: <></>, label: 'shareaudio' },
	{ key: 'sharedvideo', icon: <></>, label: 'sharedvideo' },
	{ key: 'shortcuts', icon: <></>, label: 'shortcuts' },
	{ key: 'stats', icon: <></>, label: 'stats' },
	{ key: 'tileview', icon: <></>, label: 'tileview' },
	{ key: 'toggle-camera icon: <></>,', label: 'toggle' },
	{ key: 'videoquality', icon: <></>, label: 'videoquality' },
	{ key: 'whiteboard', icon: <></>, label: 'whiteboard' },
].map(({ key, label, icon }) => ({
	key,
	render: (
		<Space>
			<Typography>{label}</Typography>
			<>{icon}</>
		</Space>
	),
}));
