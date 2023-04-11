import { ColumnsType } from "antd/lib/table";
import { IMeeting, IParticipants, TransferType } from '../interfaces/Meetings.interfaces';


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
  label: "no especificado"
}
export const meetingSelectedInitial: IMeeting = {
  start: '',
  end : '',
  id: '',
  name: '',
  participants: [],
  place: defaultPlace.value,
  type: defaultType,
  dateUpdated: 0,
};

export const RequestMeetingState = {
  confirmed:'confirmed',
  rejected:'rejected',
  pending:'pending'
}
