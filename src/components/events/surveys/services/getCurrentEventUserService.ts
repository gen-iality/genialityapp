// funcion para obtener el EventUser y los votos
async function getCurrentEvenUser(eventId: string, setEventUsers: any, setVoteWeight: any, cUser: any) {
  console.log('test:getCurrentEvenUser Im here')
  const isAssambleyMod = Object.keys(cUser.value.properties).includes('voteWeight')
  console.log('test:getCurrentEvenUser -> isAssambleyMod', isAssambleyMod)
  if (!!isAssambleyMod) {
    console.log('test:getCurrentEvenUser -> cUser.value.properties.voteWeight', cUser.value.properties.voteWeight)
    setVoteWeight(cUser.value.properties.voteWeight)
  }
}

export default getCurrentEvenUser;
