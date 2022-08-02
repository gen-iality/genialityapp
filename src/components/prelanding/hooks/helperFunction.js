import { AgendaApi, EventsApi, SpeakersApi } from '@/helpers/request';

//OBTENER  DATA DEL EVENTO PARA VALIDACIONES
export const obtenerData = async (cEvent) => {
  const sectionsDescription = await EventsApi.getSectionsDescriptions(cEvent?.value._id);
  let speakers = await SpeakersApi.byEvent(cEvent?.value._id);
  const agenda = await AgendaApi.byEvent(cEvent?.value._id);
  return {
    description: sectionsDescription?.data || [],
    speakers: speakers || [],
    agenda: agenda?.data || [],
  };
};

//VISIBILIDAD DE BOTON DE ALERTAS
export const visibleAlert = (section, description, speakers, agenda) => {
  switch (section.name) {
    case 'Contador':
      return false;
    case 'Descripción':
      if (description.length > 0 && section?.status) return false;
      else if (!section?.status) return false;
      else return true;
    case 'Conferencistas':
      if (speakers.length > 0 && section?.status) return false;
      else if (!section?.status) return false;
      else return true;
    case 'Actividades':
      if (agenda.length > 0 && section?.status) return false;
      else if (!section?.status) return false;
      else return true;
  }
};

//SETTINGS SECTIONS
export const settingsSection = (section, cEvent, history, setVisible, changeTab) => {
  switch (section?.name) {
    case 'Contador':
      setVisible(true);
      break;
    case 'Descripción':
      changeTab('4');
      break;
    case 'Conferencistas':
      history.push(`/eventadmin/${cEvent.value?._id}/speakers`);
      break;
    case 'Actividades':
      history.push(`/eventadmin/${cEvent.value?._id}/agenda`);
      break;
    default:
      break;
  }
};
