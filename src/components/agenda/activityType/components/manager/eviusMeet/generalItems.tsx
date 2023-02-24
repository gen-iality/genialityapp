import { Switch } from 'antd';
import { ElementProps } from '../ShareMeetLinkCard';

interface GeneralItem {
	key: string;
	label: string;
	element: (props: ElementProps) => JSX.Element;
	value: string;
}

export const generalItems: GeneralItem[] = [
	{
		key: 'disableInviteFunctions',
		label: 'Desactivar opción de invitar',
		element: (props: ElementProps) => (
			<Switch
				checked={props.meetConfig.config.disableInviteFunctions}
				onChange={checked =>
					props.setMeetConfig(prev => ({ ...prev, config: { ...prev.config, disableInviteFunctions: checked } }))
				}
			/>
		),
		value: 'config.disableInviteFunctions',
	},
	// {
	// 	key: 'enableWelcomePage',
	// 	label: 'enableWelcomePage', // este debe ser false en todo momento para los participamntes dentro de evius
	// 	element: (props: ElementProps) => (
	// 		<Switch
	// 			checked={props.meetConfig.config.enableWelcomePage}
	// 			onChange={checked =>
	// 				props.setMeetConfig(prev => ({ ...prev, config: { ...prev.config, enableWelcomePage: checked } }))
	// 			}
	// 		/>
	// 	),
	// 	value: 'config.enableWelcomePage',
	// },
	// {
	// 	key: 'readOnlyName',
	// 	label: 'readOnlyName', // este debe ser true en todo momento para los participamntes dentro de evius
	// 	element: (props: ElementProps) => (
	// 		<Switch
	// 			checked={props.meetConfig.config.readOnlyName}
	// 			onChange={checked =>
	// 				props.setMeetConfig(prev => ({ ...prev, config: { ...prev.config, readOnlyName: checked } }))
	// 			}
	// 		/>
	// 	),
	// 	value: 'config.readOnlyName',
	// },
	{
		key: 'disablePolls',
		label: 'Desactivar encuestas',
		element: (props: ElementProps) => (
			<Switch
				checked={props.meetConfig.config.disablePolls}
				onChange={checked =>
					props.setMeetConfig(prev => ({ ...prev, config: { ...prev.config, disablePolls: checked } }))
				}
			/>
		),
		value: 'config.disablePolls',
	},
	{
		key: 'disableReactions',
		label: 'Deshabilitar reacciones',
		element: (props: ElementProps) => (
			<Switch
				checked={props.meetConfig.config.disableReactions}
				onChange={checked =>
					props.setMeetConfig(prev => ({ ...prev, config: { ...prev.config, disableReactions: checked } }))
				}
			/>
		),
		value: 'config.disableReactions',
	},
	{
		key: 'disableReactionsModeration',
		label: 'Reacciones siempre silenciadas',
		element: (props: ElementProps) => (
			<Switch
				checked={props.meetConfig.config.disableReactionsModeration}
				onChange={checked =>
					props.setMeetConfig(prev => ({ ...prev, config: { ...prev.config, disableReactionsModeration: checked } }))
				}
			/>
		),
		value: 'config.disableReactionsModeration',
	},
	// {
	// 	key: 'disableProfile',
	// 	label: 'disableProfile', // este debe ser true en todo momento para los participamntes dentro de evius
	// 	element: (props: ElementProps) => (
	// 		<Switch
	// 			checked={props.meetConfig.config.disableProfile}
	// 			onChange={checked =>
	// 				props.setMeetConfig(prev => ({ ...prev, config: { ...prev.config, disableProfile: checked } }))
	// 			}
	// 		/>
	// 	),
	// 	value: 'config.disableProfile',
	// },
	{
		key: 'hideConferenceTimer',
		label: 'Ocultar el temporizador de conferencia',
		element: (props: ElementProps) => (
			<Switch
				checked={props.meetConfig.config.hideConferenceTimer}
				onChange={checked =>
					props.setMeetConfig(prev => ({ ...prev, config: { ...prev.config, hideConferenceTimer: checked } }))
				}
			/>
		),
		value: 'config.hideConferenceTimer',
	},
	// {
	// 	key: 'hideConferenceSubject',
	// 	label: 'hideConferenceSubject', // este debe ser true en todo momento para los participamntes dentro de evius
	// 	element: (props: ElementProps) => (
	// 		<Switch
	// 			checked={props.meetConfig.config.hideConferenceSubject}
	// 			onChange={checked =>
	// 				props.setMeetConfig(prev => ({ ...prev, config: { ...prev.config, hideConferenceSubject: checked } }))
	// 			}
	// 		/>
	// 	),
	// 	value: 'config.hideConferenceSubject',
	// },
];
