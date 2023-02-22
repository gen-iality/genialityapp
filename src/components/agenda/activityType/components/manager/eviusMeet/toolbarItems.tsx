import { Space, Typography } from "antd";

export const toolbarItems = [
	{ key: 'camera', icon: <></>, label: 'Cámara' },
	{ key: 'chat', icon: <></>, label: 'Charlar' },
	{ key: 'closedcaptions', icon: <></>, label: 'Subtítulos' },
	{ key: 'desktop', icon: <></>, label: 'Escritorio' },
	{ key: 'download', icon: <></>, label: 'Descargar' },
	{ key: 'embedmeeting', icon: <></>, label: 'Incrustarreunión' },
	{ key: 'etherpad', icon: <></>, label: 'Etherpad' },
	{ key: 'feedback', icon: <></>, label: 'Comentario' },
	{ key: 'filmstrip', icon: <></>, label: 'Tira de película' },
	{ key: 'fullscreen', icon: <></>, label: 'Pantalla completa' },
	{ key: 'hangup', icon: <></>, label: 'Colgar' },
	{ key: 'help', icon: <></>, label: 'Ayuda' },
	{ key: 'highlight', icon: <></>, label: 'Destacar' },
	{ key: 'invite', icon: <></>, label: 'Invitar' },
	{ key: 'linktosalesforce', icon: <></>, label: 'Enlace a la fuerza de ventas' },
	{ key: 'livestreaming', icon: <></>, label: 'Transmisión en vivo' },
	{ key: 'microphone', icon: <></>, label: 'Micrófono' },
	{ key: 'noisesuppression', icon: <></>, label: 'Supresión de ruido' },
	{ key: 'participants-pane', icon: <></>, label: 'Participantes' },
	{ key: 'profile', icon: <></>, label: 'Perfil' },
	{ key: 'raisehand', icon: <></>, label: 'Levantar la mano' },
	{ key: 'recording', icon: <></>, label: 'Grabación' },
	{ key: 'security', icon: <></>, label: 'Seguridad' },
	{ key: 'select-background icon: <></>,', label: 'Seleccionar fondo' },
	{ key: 'settings', icon: <></>, label: 'Ajustes' },
	{ key: 'shareaudio', icon: <></>, label: 'Compartiraudio' },
	{ key: 'sharedvideo', icon: <></>, label: 'Video compartido' },
	{ key: 'shortcuts', icon: <></>, label: 'Atajos' },
	{ key: 'stats', icon: <></>, label: 'Estadísticas' },
	{ key: 'tileview', icon: <></>, label: 'Vista de mosaico' },
	{ key: 'toggle-camera', icon: <></>, label: 'Alternar cámara' },
	{ key: 'videoquality', icon: <></>, label: 'Calidad de video' },
	/* { key: 'whiteboard', icon: <></>, label: 'whiteboard' }, */
].map(({ key, label, icon }) => ({
	key,
	render: (
		<Space>
			<Typography>{label}</Typography>
			<>{icon}</>
		</Space>
	),
}));
