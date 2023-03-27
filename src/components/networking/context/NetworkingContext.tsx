import { ReactNode, createContext, useState, useEffect } from 'react';
import { UseUserEvent } from '@/context/eventUserContext';
import * as service from '../services/meenting.service';
import * as serviceConfig from '../services/configuration.service';
import { IMeeting, IMeetingCalendar } from '../interfaces/Meetings.interfaces';
import { DispatchMessageService } from '@/context/MessageService';
import { meetingSelectedInitial } from '../utils/utils';
import { CreateObservers, IObserver } from '../interfaces/configurations.interfaces';
import { BadgeApi, EventsApi, RolAttApi } from '@/helpers/request';
import { fieldNameEmailFirst } from '@/helpers/utils';
import { addDefaultLabels, orderFieldsByWeight } from '../components/modal-create-user/utils/KioskRegistration.utils';
import { FieldsForm } from '../components/modal-create-user/interface/KioskRegistrationApp.interface';

interface NetworkingContextType {
  eventId: string;
  modal: boolean;
  edicion: boolean;
  attendees: any;
  meetings: IMeeting[];
  observers: IObserver[];
  DataCalendar: IMeetingCalendar[];
  meentingSelect: IMeeting;
  setMeentingSelect: React.Dispatch<React.SetStateAction<IMeeting>>;
  editMeenting: (MeentingUptade: IMeeting) => void;
  closeModal: () => void;
  attendeesList: () => Omit<IObserver, 'id'>[];
  openModal: (mode?: string) => void;
  createMeeting: (meeting: Omit<IMeeting, 'id'>) => void;
  updateMeeting: (meetingId: string, meeting: IMeeting) => Promise<void>;
  deleteMeeting: (meetingId: string) => void;
  createObserver: (data: CreateObservers) => void;
  deleteObserver: (id: string) => void;
  fieldsForm: FieldsForm[];
}

export const NetworkingContext = createContext<NetworkingContextType>({} as NetworkingContextType);

interface Props {
  children: ReactNode;
}

export default function NetworkingProvider(props: Props) {
  const [attendees, setAttendees] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<IMeeting[]>([]);
  const [DataCalendar, setDataCalendar] = useState<IMeetingCalendar[]>([]);
  const [observers, setObservers] = useState<IObserver[]>([]);
  const [meentingSelect, setMeentingSelect] = useState<IMeeting>(meetingSelectedInitial);
  const [modal, setModal] = useState(false);
  const [edicion, setEdicion] = useState(false);
  const cUser = UseUserEvent();
  const eventId = cUser?.value?.event_id;
  const [fieldsForm, setFieldsForm] = useState<any[]>([] as any[]);
  useEffect(() => {
    if (!!eventId) {
      const unsubscribeAttendees = service.listenAttendees(eventId, setAttendees);
      const unsubscribeMeetings = service.listenMeetings(eventId, setMeetings);
      const unsubscribeObservers = serviceConfig.listenObervers(eventId, setObservers);
      getFields();
      return () => {
        unsubscribeAttendees();
        unsubscribeMeetings();
        unsubscribeObservers();
      };
    }
  }, []);

  useEffect(() => {
    if (observers.length) {
      const dataArray: IMeetingCalendar[] = [];
      observers.map((observer) => {
        meetings.map((meeting) => {
          if (meeting.participants.map((item) => item.id).includes(observer.value)) {
            dataArray.push({ ...meeting, assigned: observer.value });
          }
        });
      });
      setDataCalendar(dataArray);
    }
  }, [meetings, observers]);

  const editMeenting = (meentign: IMeeting) => {
    setMeentingSelect(meentign);
    openModal('edit');
  };

  const attendeesList = (): Omit<IObserver, 'id'>[] => {
    const observersId = observers.map((item) => item.value);
    const participants: Omit<IObserver, 'id'>[] = attendees.map((asistente: any) => ({
      value: asistente.user._id,
      label: asistente.user.names,
    }));
    return participants.filter((item) => !observersId.includes(item.value));
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

  /* funciones crud para las reuniones */
  const createMeeting = async (meeting: Omit<IMeeting, 'id'>) => {
    const newMeenting: Omit<IMeeting, 'id'> = {
      name: meeting.name,
      dateUpdated: meeting.dateUpdated,
      participants: meeting.participants,
      place: meeting.place,
      start: meeting.start,
      end: meeting.end,
    };
    const response = await service.createMeeting(eventId, newMeenting);
    DispatchMessageService({
      type: response ? 'success' : 'warning',
      msj: response ? 'Información guardada correctamente!' : 'No se logro guardar la informacion',
      action: 'show',
    });
  };
  const updateMeeting = async (meetingId: string, meeting: IMeeting) => {
    const newMeenting: Omit<IMeeting, 'id'> = {
      name: meeting.name,
      dateUpdated: meeting.dateUpdated,
      participants: meeting.participants,
      place: meeting.place,
      start: meeting.start,
      end: meeting.end,
    };
    const response = await service.updateMeeting(eventId, meetingId, newMeenting);

    DispatchMessageService({
      type: response ? 'success' : 'warning',
      msj: response ? 'Información guardada correctamente!' : 'No se logro guardar la informacion',
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
      type: response ? 'success' : 'warning',
      msj: response ? 'Información guardada correctamente!' : 'No ha sido posible eliminar el campo',
      action: 'show',
    });
  };

  /* --------------------------------- */
  const createObserver = async ({ data }: CreateObservers) => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: ' Por favor espere...',
      action: 'show',
    });
    const observers = attendeesList().filter((attendee) => data.includes(attendee.value));
    const responses = [];
    for (const item of observers) {
      const response = await serviceConfig.creatObserver(eventId, item);
      responses.push(response);
    }
    DispatchMessageService({
      key: 'loading',
      action: 'destroy',
    });
    DispatchMessageService({
      type: !responses.includes(false) ? 'success' : 'warning',
      msj: !responses.includes(false)
        ? 'Información guardada correctamente!'
        : 'No se logro guardar la informacion completa',
      action: 'show',
    });
  };

  const deleteObserver = async (observerID: string) => {
    const response = await serviceConfig.deleteObserver(eventId, observerID);
    DispatchMessageService({
      type: response ? 'success' : 'warning',
      msj: response ? 'Información guardada correctamente!' : 'No se logro guardar la informacion',
      action: 'show',
    });
  };

  const getFields = async () => {
    try {
      const event = await EventsApi.getOne(eventId);
      const rolesList = await RolAttApi.byEventRolsGeneral();
      const properties = event.user_properties;
      // const rolesList = await RolAttApi.byEventRolsGeneral();
      const badgeEvent = await BadgeApi.get(eventId);

      let extraFields = fieldNameEmailFirst(properties);

      extraFields = addDefaultLabels(extraFields);
      extraFields = orderFieldsByWeight(extraFields);
      let fieldsForm = Array.from(extraFields);
      let rolesOptions = rolesList.map((rol: any) => {
        return {
          label: rol.name,
          value: rol._id,
        };
      });
      fieldsForm.push({
        author: null,
        categories: [],
        label: 'Rol',
        mandatory: true,
        name: 'rol_id',
        organizer: null,
        tickets: [],
        type: 'list',
        fields_conditions: [],
        unique: false,
        options: rolesOptions,
        visibleByAdmin: false,
        visibleByContacts: 'public',
        _id: { $oid: '614260d226e7862220497eac1' },
      });

      fieldsForm.push({
        author: null,
        categories: [],
        label: 'Checkin',
        mandatory: false,
        name: 'checked_in',
        organizer: null,
        tickets: [],
        type: 'boolean',
        fields_conditions: [],
        unique: false,
        visibleByAdmin: false,
        visibleByContacts: 'public',
        _id: { $oid: '614260d226e7862220497eac2' },
      });
      console.log('fieldsForm',fieldsForm)
      setFieldsForm(fieldsForm);
      return fieldsForm;
    } catch (error) {
      console.log(error);
    }
  };

  const values = {
    modal,
    openModal,
    closeModal,
    edicion,
    meetings,
    setMeetings,
    editMeenting,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    meentingSelect,
    setMeentingSelect,
    attendees,
    setAttendees,
    attendeesList,
    eventId,
    observers,
    createObserver,
    deleteObserver,
    DataCalendar,
    fieldsForm,
  };

  return <NetworkingContext.Provider value={values}>{props.children}</NetworkingContext.Provider>;
}
