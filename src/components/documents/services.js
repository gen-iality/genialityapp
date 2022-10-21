import axios from 'axios';
import { ApiUrl } from '@helpers/constants';

export function getFiles(EventID) {
  return new Promise((resolve) => {
    let response = '';
    axios
      .get(`${ApiUrl}/api/events/${EventID}/getallfiles`)
      .then((docs) => {
        response = docs.data.data.length !== 0 ? docs.data.data : false;
        resolve(response);
      })
      .catch(() => {});
  });
}
