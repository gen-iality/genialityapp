/**
 * escuchamos los cambios a los datos en la base de datos directamente
 *
 */

function updateAttendees(currentAttendees, snapshot) {
  let newItems = currentAttendees;
  let user;

  snapshot.docChanges().forEach((change) => {
    user = change.doc.data();

    let userPropeties = { ...user.properties };
    delete userPropeties['_id'];
    user = { ...userPropeties, checkedin_at: user.checkedin_at, ...user };

    //por si acas
    if (!user._id) {
      user._id = change.doc.id;
    }

    switch (change.type) {
      case 'added':
        change.newIndex === 0 ? newItems.unshift(user) : newItems.push(user);
        break;
      case 'modified':
        newItems = newItems.map((item) => {
          if (item._id === user._id) return user;
          else return item;
        });
        break;

      case 'removed':
        newItems.splice(change.oldIndex, 1);
        break;

      default:
        break;
    }
  });

  return newItems;
}
export default updateAttendees;
