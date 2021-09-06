function isEventAuthor(evenUser, event) {
  let isAuthor = event.author_id === evenUser.account_id ? 1 : 0;
  return isAuthor;
}

export const isHost = (evenUser, event) =>{
  let rolhost = '5afb0efc500a7104f77189cf';
  let host = evenUser.rol_id === rolhost ? 1 : 0 || isEventAuthor(evenUser, event);
  return host;
}

