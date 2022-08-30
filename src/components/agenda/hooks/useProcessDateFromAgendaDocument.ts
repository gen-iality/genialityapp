import AgendaType from '@Utilities/types/AgendaType';
import moment from 'moment';

function processDateFromAgendaDocument(document: AgendaType) {
  /* console.log(document, 'entro en handleDate'); */
  const date = moment(document.datetime_end, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD');
  const hour_start = moment(document.datetime_start, 'YYYY-MM-DD HH:mm').toDate();
  const hour_end = moment(document.datetime_end, 'YYYY-MM-DD HH:mm').toDate();
  return { date, hour_start, hour_end };
}

export default function useProcessDateFromAgendaDocument() {
  return processDateFromAgendaDocument;
}
