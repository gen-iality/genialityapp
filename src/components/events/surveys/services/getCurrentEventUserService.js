import { TicketsApi } from '../../../../helpers/request';
import * as Cookie from 'js-cookie';

// funcion para obtener el EventUser y los votos
async function getCurrentEvenUser(eventId, setEventUsers, setVoteWeight) {
   let evius_token = Cookie.get('evius_token');
   let eventUser = [];
   let voteWeight = 1;
   if (evius_token) {
      let response = await TicketsApi.getByEvent(eventId, evius_token);

      if (response.data.length > 0) {
         voteWeight = 0;
         eventUser = response.data;
         response.data.forEach((item) => {
            if (item.properties.pesovoto) voteWeight += parseFloat(item.properties.pesovoto);
         });
      }
   }
   setEventUsers(eventUser);
   setVoteWeight(voteWeight);
}

export default getCurrentEvenUser;
