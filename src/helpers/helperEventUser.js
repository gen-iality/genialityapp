function isEventAuthor(evenUser, event) {
  const isAuthor = event.author_id === evenUser.account_id ? 1 : 0;
  return isAuthor;
}

export const isHost = (evenUser, event) =>{
  const rolhost = '5afb0efc500a7104f77189cf';
  const host = evenUser.rol_id === rolhost ? 1 : 0 || isEventAuthor(evenUser, event);
  return host;
}

