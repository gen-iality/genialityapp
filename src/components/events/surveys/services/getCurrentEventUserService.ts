// funcion para obtener el EventUser y los votos
async function getCurrentEvenUser(eventId: string, setEventUsers: any, setVoteWeight: any, cUser: any, cEvent : any) {
    
   const isAssambleyMod =
     Object.keys(cUser.value.properties).includes('voteWeight') &&
     cEvent.value.user_properties.some((property: any) => property.type === 'voteWeight');

   if (isAssambleyMod) {
     setVoteWeight(cUser.value.properties.voteWeight);
   }
}

export default getCurrentEvenUser;
