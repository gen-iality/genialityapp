import { getEventDates } from '@/Utilities/functions/getEventDates';
import { firestore } from '@/helpers/firebase';
import moment from 'moment';
import { ArrayToStringCerti, replaceAllTagValues } from '.';
import { CertifiRow } from '@/components/agenda/types';
import { CertsApi } from '@/helpers/request';

export const generate = (event: any,certificatesRow:CertifiRow[], image:string) => {
  const { date_end, date_start } = getEventDates(event);
  event.datetime_from = moment(date_end).format('DD-MM-YYYY');
  event.datetime_to = moment(date_start).format('DD-MM-YYYY');
  const userRef = firestore.collection(`${event._id}_event_attendees`);
  userRef
    .orderBy('updated_at', 'desc')
    .limit(1)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const oneUser = querySnapshot.docs[0].data();
        const rowsWithData = replaceAllTagValues(event, oneUser, [], certificatesRow);
        const stringCerti = ArrayToStringCerti(rowsWithData);
        const body = {
          content: stringCerti,
          image,
        };

        CertsApi.generateCert(body).then((file) => {
          //@ts-ignore
          const blob = new Blob([file.blob], { type: file.type, charset: 'UTF-8' });

          const data = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.type = 'json';
          link.href = data;
          link.target = '_blank';
          link.dispatchEvent(new MouseEvent('click'));
          setTimeout(() => {
            // For Firefox it is necessary to delay revoking the ObjectURL
            window.URL.revokeObjectURL(data);
          }, 60);
        });
      }
    });
};
