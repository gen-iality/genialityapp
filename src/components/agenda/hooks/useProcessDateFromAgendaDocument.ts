import dayjs from 'dayjs';
import AgendaDocumentType from '../types/AgendaDocumentType';

function processDateFromAgendaDocument (document: AgendaDocumentType) {
  /* console.log(document, 'entro en handleDate'); */
  const date = dayjs(document.datetime_end, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD');
  const hour_start = dayjs(document.datetime_start, 'YYYY-MM-DD HH:mm').toDate();
  const hour_end = dayjs(document.datetime_end, 'YYYY-MM-DD HH:mm').toDate();
  return { date, hour_start, hour_end };
}

export default function useProcessDateFromAgendaDocument () {
  return processDateFromAgendaDocument;
}