import { ReactNode, createContext, useState, useEffect } from 'react';
import { UseUserEvent } from '@/context/eventUserContext';
import * as service from '../services/meenting.service';
import { fromPlayerToScore } from '../utils/fromPlayerToScore';
import { IMeeting } from '../interfaces/Meetings.interfaces';

interface NetworkingContextType {
  modal: boolean;
  edicion: boolean;
  attendees: any;
  meetings: IMeeting[];
  meentingSelect: IMeeting;
  setMeentingSelect: React.Dispatch<React.SetStateAction<IMeeting>>;
  editMeenting: (MeentingUptade: IMeeting) => void;
  closeModal: () => void;
  openModal: (mode?: string) => void;
  createMeeting:(meeting: Omit<IMeeting, 'id'>)=>void,
  updateMeeting:(meetingId: string, meeting: IMeeting)=>void
  eventId:string
  deleteMeeting:( meetingId: string)=>void
}

export const NetworkingContext = createContext<NetworkingContextType>({} as NetworkingContextType);

interface Props {
  children: ReactNode;
}

const meetingSelectedInitial:IMeeting ={
  date:'',
  horas:[],
  id:'',
  name:'',
  participants:[],
  place:''
}

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

  useEffect(() => {
  }, [attendees, meetings]);

  const editMeenting = (meentign: IMeeting) => {
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
    setMeentingSelect(meetingSelectedInitial)
  };

  const createMeeting = async (meeting: Omit<IMeeting, 'id'>) => {
    await service.createMeeting(eventId, meeting);
  };
  const updateMeeting = async ( meetingId: string, meeting: IMeeting) => {
   await  service.updateMeeting(eventId,meetingId,meeting);
  };
  const deleteMeeting = async( meetingId: string) => {
    await service.deleteMeeting(eventId,meetingId);
  };
  const values = {
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
    deleteMeeting
  };

  return <NetworkingContext.Provider value={values}>{props.children}</NetworkingContext.Provider>;
}
