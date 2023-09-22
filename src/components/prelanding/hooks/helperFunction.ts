import { getConfiguration } from '@/components/agenda/services';
import { AgendaApi, EventsApi, SpeakersApi } from '@/helpers/request';
import { History } from 'history';
import { Agenda, ApiGeneric, Description, EventContext, LandingBlock, Speaker, Sponsor } from '../types';
//OBTENER  DATA DEL EVENTO PARA VALIDACIONES
export const obtenerData = async (
  cEvent: EventContext
): Promise<{
  description: Description[];
  speakers: Speaker[];
  agenda: Agenda[];
}> => {

  const sectionsDescription : ApiGeneric<Description> = await EventsApi.getSectionsDescriptions(cEvent?.value._id);
  
  let speakers: Speaker[] = await SpeakersApi.byEvent(cEvent?.value._id);
  
  const agenda : ApiGeneric<Agenda> = await AgendaApi.byEvent(cEvent?.value._id);

  const speakersFiltered = speakers.filter((speaker) => speaker.published || typeof speaker.published === 'undefined');
  
  const agendaConfig: Agenda[] = await obtenerConfigActivity(cEvent.value._id, agenda.data);
  
  const agendaConfigFilter = agendaConfig?.filter(
    (agendaCfg) => agendaCfg.isPublished || agendaCfg.isPublished == undefined
  );

  return {
    description: sectionsDescription?.data || [],
    speakers: speakersFiltered || [],
    agenda: agendaConfigFilter || [],
  };
};

//OBTENER DATA ACTIVIDADES DE FIREBASE
/**
 * This function obtains the configuration for a given event and agenda and returns a list of agendas
 * with their respective configurations.
 * @param {string} event - a string representing the event for which the configuration is being
 * obtained.
 * @param {Agenda[]} agenda - An array of objects representing activities in an agenda. Each object
 * should have an "_id" property.
 * @returns The function `obtenerConfigActivity` returns a Promise that resolves to an array of
 * `Agenda` objects.
 */

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
/**
 * The function determines whether a section should be visible based on the presence of data and its
 * status.
 * @param {LandingBlock} section - a LandingBlock object that represents a section of a landing page
 * @param {Description[]} description - an array of objects containing information about the event's
 * description
 * @param {Speaker[]} speakers - an array of objects representing the speakers for an event
 * @param {Agenda[]} agenda - An array of objects representing the agenda items for an event. Each
 * object contains properties such as the title, time, and description of the agenda item.
 * @param {Sponsor[]} sponsors - an array of objects representing the sponsors of an event
 * @returns The function `visibleAlert` returns a boolean value indicating whether or not to display an
 * alert message. The value returned depends on the section name and the presence of data in the
 * corresponding arrays (description, speakers, agenda, sponsors) and the status of the section.
 */
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
