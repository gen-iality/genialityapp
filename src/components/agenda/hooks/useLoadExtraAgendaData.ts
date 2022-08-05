import { CategoriesAgendaApi, eventTicketsApi, RolAttApi, SpacesApi, SpeakersApi } from "@/helpers/request";
import { handleSelect } from "@/helpers/utils";
import moment from "moment";
import EventType from "../types/EventType";
import SelectOptionType from "../types/SelectOptionType";

type FunctionSetter = (x: SelectOptionType[]) => void;

type HookCallbackConfig = {
  setTickets: FunctionSetter,
  setDays: FunctionSetter,
  setHosts: FunctionSetter,
  setRoles: FunctionSetter,
  setSpaces: FunctionSetter,
  setCategories: FunctionSetter,
};

export default async function useLoadExtraAgendaData (event: EventType, callbacks: HookCallbackConfig) {
  try {
    // NOTE: The tickets are not used
    const remoteTickets = await eventTicketsApi.getAll(event?._id);
    const newAllTickets = remoteTickets.map((ticket: any) => ({
      item: ticket,
      label: ticket.title,
      value: ticket._id,
    }));
    callbacks.setTickets(newAllTickets);
  } catch (e) {
    console.error(e);
  }

  // If dates exist, then iterate the specific dates array, formating specially.
  if (event.dates && event.dates.length > 0) {
    const newDays = event.dates.map((dates) => {
      const formatDate = moment(dates, ['YYYY-MM-DD']).format('YYYY-MM-DD');
      return { value: formatDate, label: formatDate };
    });
    callbacks.setDays(newDays);
  } else {
    // Si no, recibe la fecha inicio y la fecha fin y le da el formato
    // especifico a mostrar
    const initMoment = moment(event.date_start);
    const endMoment = moment(event.date_end);
    const dayDiff = endMoment.diff(initMoment, 'days');
    // Se hace un for para sacar los días desde el inicio hasta el fin, inclusivos
    const newDays = [];
    for (let i = 0; i < dayDiff + 1; i++) {
      const formatDate = moment(initMoment)
        .add(i, 'd')
        .format('YYYY-MM-DD');
      newDays.push({ value: formatDate, label: formatDate });
    }
    callbacks.setDays(newDays);
  }

  // Get more data from this event
  const remoteHosts = await SpeakersApi.byEvent(event._id);
  const remoteRoles = await RolAttApi.byEvent(event._id);
  const remoteSpaces = await SpacesApi.byEvent(event._id);
  const remoteCategories = await CategoriesAgendaApi.byEvent(event._id);

  // The object struct should be like [{ label, value }] for the Select components
  const newAllHosts = handleSelect(remoteHosts) || [];
  const newAllRoles = handleSelect(remoteRoles) || [];
  const newAllSpaces = handleSelect(remoteSpaces) || [];
  const newAllCategories = handleSelect(remoteCategories) || [];

  callbacks.setHosts(newAllHosts);
  callbacks.setRoles(newAllRoles);
  callbacks.setSpaces(newAllSpaces);
  callbacks.setCategories(newAllCategories);
}
