import { ReactNode, createContext, useState, useEffect } from 'react';
import { UseUserEvent } from '@/context/eventUserContext';
import * as service from '../services/meenting.service';
import { IMeeting } from '../interfaces/Meetings.interfaces';
import { DispatchMessageService } from '@/context/MessageService';

interface NetworkingContextType {
  meetingSelectedInitial : IMeeting
  modal: boolean;
  edicion: boolean;
  attendees: any;
  meetings: IMeeting[];
  meentingSelect: IMeeting;
  setMeentingSelect: React.Dispatch<React.SetStateAction<IMeeting>>;
  editMeenting: (MeentingUptade: IMeeting) => void;
  closeModal: () => void;
  openModal: (mode?: string) => void;
  createMeeting: (meeting: Omit<IMeeting, 'id'>) => void;
  updateMeeting: (meetingId: string, meeting: IMeeting) => Promise<void>;
  eventId: string;
  deleteMeeting: (meetingId: string) => void;
}

export const NetworkingContext = createContext<NetworkingContextType>({} as NetworkingContextType);

interface Props {
  children: ReactNode;
}

const meetingSelectedInitial: IMeeting = {
  start: '',
  end : '',
  id: '',
  name: '',
  participants: [],
  place: '',
  dateUpdated: 0,
};

export default function NetworkingProvider(props: Props) {
  const [attendees, setAttendees] = useState<any>([]);
  const [meetings, setMeetings] = useState<IMeeting[]>([]);
  const [meentingSelect, setMeentingSelect] = useState<IMeeting>(meetingSelectedInitial);
  const [modal, setModal] = useState(false);
  const [edicion, setEdicion] = useState(false);
  const cUser = UseUserEvent();
  const eventId = cUser?.value?.event_id;

  useEffect(() => {
    if (!!eventId) {
      const unsubscribeAttendees = service.listenAttendees(eventId, setAttendees);
      const unsubscribeMeetings = service.listenMeetings(eventId, setMeetings);
      return () => {
        unsubscribeAttendees();
        unsubscribeMeetings();
      };
    }
  }, []);

  useEffect(() => {console.log(meetings,attendees)}, [attendees, meetings]);

  const editMeenting = (meentign: IMeeting) => {
    console.log('algo',meentign)
    setMeentingSelect(meentign);
    openModal('edit');
  };
  const openModal = (modo?: string) => {
    if (modo === 'edit') setEdicion(true);
    setModal(true);
  };
  const closeModal = () => {
    setModal(false);
    setEdicion(false);
    setMeentingSelect(meetingSelectedInitial);
  };

  const createMeeting = async (meeting: Omit<IMeeting, 'id'>) => {
   const response = await service.createMeeting(eventId, meeting);
    DispatchMessageService({
      type: response ? 'success' : 'error',
      msj: response ? 'Información guardada correctamente!' : 'Error al guardar la informacion',
      action: 'show',
    });
  };
  const updateMeeting = async (meetingId: string, meeting: IMeeting) => {

    const response = await service.updateMeeting(eventId, meetingId, meeting);

    DispatchMessageService({
      type: response ? 'success' : 'error',
      msj: response ? 'Información guardada correctamente!' : 'Error al guardar la informacion',
      action: 'show',
    });

  };
  const deleteMeeting = async (meetingId: string) => {
      DispatchMessageService({
        type: 'loading',
        key: 'loading',
        msj: ' Por favor espere mientras se borra la información...',
        action: 'show',
      });

      const response = await service.deleteMeeting(eventId, meetingId);
      DispatchMessageService({
        key: 'loading',
        action: 'destroy',
      });
      DispatchMessageService({
        type: response ? 'success' : 'error',
        msj: response ? 'Información guardada correctamente!' : 'No ha sido posible eliminar el campo',
        action: 'show',
      });
  };
  const values = {
    meetingSelectedInitial,
    modal,
    openModal,
    closeModal,
    edicion,
    meetings,
    setAttendees,
    meentingSelect,
    setMeentingSelect,
    attendees,
    setMeetings,
    editMeenting,
    createMeeting,
    updateMeeting,
    eventId,
    deleteMeeting,
  };

  return <NetworkingContext.Provider value={values}>{props.children}</NetworkingContext.Provider>;
}
