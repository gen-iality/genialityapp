import { ReactNode, createContext, useState, useEffect } from 'react';
import { UseUserEvent } from '@/context/eventUserContext';
import * as service from '../services/meenting.service';
import { fromPlayerToScore } from '../utils/fromPlayerToScore';
import { IMeeting } from '../interfaces/meetings.interfaces';

interface NetworkingContextType {
  modal: boolean;
  edicion: boolean;
  attendees: any;
  meetings: IMeeting[];
  meentingSelect: IMeeting | undefined;
  setMeentingSelect: React.Dispatch<React.SetStateAction<IMeeting | undefined>>;
  editMeenting: (MeentingUptade: IMeeting) => void;
  closeModal: () => void;
  openModal: (mode?: string) => void;
  createMeeting:(meeting: Omit<IMeeting, 'id'>)=>void
}

export const NetworkingContext = createContext<NetworkingContextType>({} as NetworkingContextType);

interface Props {
  children: ReactNode;
}

export default function NetworkingProvider(props: Props) {
  const [attendees, setAttendees] = useState<any>([]);
  const [meetings, setMeetings] = useState<IMeeting[]>([]);
  const [meentingSelect, setMeentingSelect] = useState<IMeeting | undefined>();
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
    console.log({ attendees, meetings });
  }, [attendees, meetings]);

  const editMeenting = (meentign: IMeeting) => {
    console.log(meentign);
    setMeentingSelect(meentign);
    openModal('edit');
  };
  const openModal = (modo?: string) => {
    console.log('abirendo modal de reuniones');
    if (modo === 'edit') setEdicion(true);
    setModal(true);
  };
  const closeModal = () => {
    setModal(false);
    setEdicion(false);
    setMeentingSelect(undefined)
  };

  const createMeeting = (meeting: Omit<IMeeting, 'id'>) => {
    service.createMeeting(eventId, meeting);
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
    createMeeting
  };

  return <NetworkingContext.Provider value={values}>{props.children}</NetworkingContext.Provider>;
}
