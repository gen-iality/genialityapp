// funcion para obtener el EventUser y los votos
async function getCurrentEvenUser(eventId: string, setEventUsers: any, setVoteWeight: any, cUser: any) {
  const isAssambleyMod = Object.keys(cUser.value.properties).includes('voteWeight')
  if (!!isAssambleyMod) {
    setVoteWeight(cUser.value.properties.voteWeight)
  }
}

export default getCurrentEvenUser;
