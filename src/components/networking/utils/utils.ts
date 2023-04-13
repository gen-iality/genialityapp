import { ColumnsType } from "antd/lib/table";
import { IMeeting, IParticipants, TransferType } from '../interfaces/Meetings.interfaces';
import { MeetConfig } from "../interfaces/Index.interfaces";


export const filterOption = (inputValue: string, option: TransferType) => {
    return option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
}

export const generateRandomKey = () => {
    return Math.random().toString(36).substring(2, 10);
}

export const shortName = ( name = 'usuario',splitter = ' ') => {
  const names = name.split(splitter)
  const simpleName = `${names[0]} ${names[1] || ''}`
  return simpleName
}

export const formLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

export const columnsParticipants: ColumnsType<IParticipants> = [
    {
      title: 'Participante',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Asistencia',
      dataIndex: 'attendance',
    },
  ];

export const attendesOption = [{label : 'ninguno', value : '0'}]

export const defaultType = {
  id : '',
  nameType : 'Seleccione una opción', //'default',
  style : '#406D85'
}
export const defaultPlace = {
  id: "",
  value: "no especificado",
  label: "No especificado"
}
export const meetingSelectedInitial: Omit<IMeeting, 'startTimestap'> = {
  start: '',
  end : '',
  id: '',
  name: '',
  participants: [],
  place: defaultPlace.value,
  type: defaultType,
  dateUpdated: 0,
  participantsIds : ['']
};

export const RequestMeetingState = {
  confirmed:'confirmed',
  rejected:'rejected',
  pending:'pending'
}
export const INITIAL_MEET_CONFIG: MeetConfig = {
	openMeet: false,
	config: {
		disableInviteFunctions: false,
		welcomePage: {
			disabled: true,
			customUrl: 'https://evius.co',
		},
		enableClosePage: false,
		readOnlyName: true,
		disablePolls: false,
		disableReactions: false,
		disableReactionsModeration: false,
		disableProfile: true,
		hideConferenceTimer: false,
		hideConferenceSubject: true,
		screenshotCapture: false,
		notifications: [
			'connection.CONNFAIL',
			'dialog.micNotSendingData',
			'dialog.serviceUnavailable',
			'dialog.sessTerminated',
			'dialog.sessionRestarted',
			'dialOut.statusMessage',
			'notify.chatMessages',
			'notify.disconnected',
			'notify.connectedOneMember',
			'notify.connectedTwoMembers',
			'notify.leftOneMember',
			'notify.leftTwoMembers',
			'notify.connectedThreePlusMembers',
			'notify.leftThreePlusMembers',
			'notify.grantedTo',
			'notify.hostAskedUnmute',
			'notify.invitedOneMember',
			'notify.invitedThreePlusMembers',
			'notify.invitedTwoMembers',
			'notify.mutedRemotelyTitle',
			'notify.mutedTitle',
			'notify.newDeviceAudioTitle',
			'notify.newDeviceCameraTitle',
			'notify.raisedHand',
			'notify.startSilentTitle',
			'notify.videoMutedRemotelyTitle',
			'toolbar.noAudioSignalTitle',
			'toolbar.noisyAudioInputTitle',
			'toolbar.talkWhileMutedPopup',
		],
		toolbarButtons: ['microphone', 'camera', 'participants-pane', 'tileview', 'settings', 'fullscreen', 'raisehand', 'toggle-camera'],
	},
};