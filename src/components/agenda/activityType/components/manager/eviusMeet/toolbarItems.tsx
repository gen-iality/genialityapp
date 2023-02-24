import VideoIcon from '@2fd/ant-design-icons/lib/Video';
import MessageBulletedIcon from '@2fd/ant-design-icons/lib/MessageBulleted';
import MonitorShareIcon from '@2fd/ant-design-icons/lib/MonitorShare';
import FullscreenIcon from '@2fd/ant-design-icons/lib/Fullscreen';
import WaveformIcon from '@2fd/ant-design-icons/lib/Waveform';
import MicrophoneIcon from '@2fd/ant-design-icons/lib/Microphone';
import AccountMultipleIcon from '@2fd/ant-design-icons/lib/AccountMultiple';
import HandBackRightIcon from '@2fd/ant-design-icons/lib/HandBackRight';
import ImageIcon from '@2fd/ant-design-icons/lib/Image';
import CogIcon from '@2fd/ant-design-icons/lib/Cog';
import VolumeHighIcon from '@2fd/ant-design-icons/lib/VolumeHigh';
import PlayIcon from '@2fd/ant-design-icons/lib/Play';
import ViewGridIcon from '@2fd/ant-design-icons/lib/ViewGrid';
import CameraFlipIcon from '@2fd/ant-design-icons/lib/CameraFlip';
import SpeedometerIcon from '@2fd/ant-design-icons/lib/Speedometer';


export const toolbarItems = [
	{ key: 'camera', icon: <VideoIcon />, label: 'Cámara' },
	{ key: 'chat', icon: <MessageBulletedIcon />, label: 'Chat' },
	/* { key: 'closedcaptions', icon: <></>, label: 'Subtítulos' }, */
	{ key: 'desktop', icon: <MonitorShareIcon />, label: 'Compartir pantalla' },
	/* { key: 'download', icon: <></>, label: 'Descargar' }, */
	/* { key: 'embedmeeting', icon: <></>, label: 'Incrustarreunión' }, */
	/* { key: 'etherpad', icon: <></>, label: 'Etherpad' }, */
	/* { key: 'feedback', icon: <></>, label: 'Comentario' }, */
	/* { key: 'filmstrip', icon: <></>, label: 'Tira de película' }, */
	{ key: 'fullscreen', icon: <FullscreenIcon />, label: 'Pantalla completa' },
	/* { key: 'hangup', icon: <></>, label: 'Colgar' }, */
	/* { key: 'help', icon: <></>, label: 'Ayuda' }, */
	/* { key: 'highlight', icon: <></>, label: 'Destacar' }, */
	/* { key: 'invite', icon: <></>, label: 'Invitar' }, */
	/* { key: 'linktosalesforce', icon: <></>, label: 'Enlace a la fuerza de ventas' }, */
	/* { key: 'livestreaming', icon: <></>, label: 'Transmisión en vivo' }, */
	{ key: 'microphone', icon: <MicrophoneIcon />, label: 'Micrófono' },
	{ key: 'noisesuppression', icon: <WaveformIcon />, label: 'Supresión de ruido' },
	{ key: 'participants-pane', icon: <AccountMultipleIcon />, label: 'Participantes' },
	/* { key: 'profile', icon: <></>, label: 'Perfil' }, */
	{ key: 'raisehand', icon: <HandBackRightIcon />, label: 'Levantar la mano' },
	/* { key: 'recording', icon: <></>, label: 'Grabación' }, */
	/* { key: 'security', icon: <></>, label: 'Seguridad' }, */
	{ key: 'select-background', icon: <ImageIcon />, label: 'Seleccionar fondo' },
	{ key: 'settings', icon: <CogIcon />, label: 'Ajustes' },
	{ key: 'shareaudio', icon: <VolumeHighIcon />, label: 'Compartir audio' },
	{ key: 'sharedvideo', icon: <PlayIcon />, label: 'Compartir video' },
	/* { key: 'shortcuts', icon: <></>, label: 'Atajos' }, */
	/* { key: 'stats', icon: <></>, label: 'Estadísticas' }, */
	{ key: 'tileview', icon: <ViewGridIcon />, label: 'Vista de mosaico' },
	{ key: 'toggle-camera', icon: <CameraFlipIcon />, label: 'Alternar cámara' },
	{ key: 'videoquality', icon: <SpeedometerIcon />, label: 'Calidad de video' },
	/* { key: 'whiteboard', icon: <></>, label: 'whiteboard' }, */
];
