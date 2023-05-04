import { getConfiguration } from '@/components/agenda/services';
import { AgendaApi, EventsApi, SpeakersApi } from '@/helpers/request';
import { History } from 'history';
import { Agenda, Description, EventContext, LandingBlock, Speaker, Sponsor } from '../types';
//OBTENER  DATA DEL EVENTO PARA VALIDACIONES
export const obtenerData = async (
  cEvent: EventContext
): Promise<{
  description: Description[];
  speakers: Speaker[];
  agenda: Agenda[];
}> => {

  const sectionsDescription = await EventsApi.getSectionsDescriptions(cEvent?.value._id);
  
  let speakers: Speaker[] = await SpeakersApi.byEvent(cEvent?.value._id);
  
  const agenda = await AgendaApi.byEvent(cEvent?.value._id);
  
  const speakersFiltered = speakers.filter((speaker) => speaker.published || typeof speaker.published === 'undefined');
  
  const agendaConfig: Agenda[] = await obtenerConfigActivity(cEvent.value._id, agenda.data);
  
  const agendaConfigFilter = agendaConfig?.filter(
    (agendaCfg) => agendaCfg.isPublished || agendaCfg.isPublished == undefined
  );

  return {
    description: (sectionsDescription?.data as Description[]) || [],
    speakers: speakersFiltered || [],
    agenda: agendaConfigFilter || [],
  };
};

//OBTENER DATA ACTIVIDADES DE FIREBASE

export const obtenerConfigActivity = async (event: string, agenda: Agenda[]): Promise<Agenda[]> => {
  const listAgenda: Agenda[] = [];
  if (agenda) {
    await Promise.all(
      agenda.map(async (activity) => {
        const config = await getConfiguration(event, activity._id);
        const activityData = { ...activity, ...config };
        listAgenda.push(activityData);
      })
    );
  }
  return listAgenda;
};

//VISIBILIDAD DE BOTON DE ALERTAS
export const visibleAlert = (
  section: LandingBlock,
  description: Description[],
  speakers: Speaker[],
  agenda: Agenda[],
  sponsors: Sponsor[]
) => {
  switch (section.name) {
    case 'Contador':
      return false;
    case 'Descripción':
      return (description.length > 0 && section?.status) ? false : section?.status
    case 'Conferencistas':
      return (speakers.length > 0 && section?.status) ? false : section?.status
    case 'Actividades':
      return (agenda.length > 0 && section?.status) ? false : section?.status
    case 'Patrocinadores':
      return (sponsors.length > 0 && section?.status) ? false : section?.status
  }
};

//SETTINGS SECTIONS
export const settingsSection = (
  section: LandingBlock,
  cEvent: EventContext,
  history: History,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
  changeTab: (params: string) => void
) => {
  console.log('ceventxd',cEvent)
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
    case 'Patrocinadores':
      history.push(`/eventadmin/${cEvent.value?._id}/empresas`);
      break;
    default:
      break;
  }
};
