/**
 * escuchamos los cambios a los datos en la base de datos directamente
 *
 */

function updateAttendees(currentAttendees, snapshot) {
  let newItems = currentAttendees;

  let user = 0;
  snapshot.docChanges().forEach((change) => {
    user = change.doc.data();
  //  console.log("USER==>", user)
      user = { ...user, ...user.properties,checkedin_at:user.checkedin_at };

    //por si acas
    if (!user._id) {
      user._id = change.doc.id;
    }

    user.created_at = user.created_at && user.created_at.toDate ? user.created_at.toDate() : null;
    user.updated_at = user.updated_at && user.updated_at.toDate ? user.updated_at.toDate() : null;
    //SE LE SUMA 5 HORAS PARA QUE NOS DE LA HORA EXACTA
    user.checkedin_at = user.checkedin_at && user.checkedin_at.toDate ? user.checkedin_at.toDate() : null;   
    switch (change.type) {
      case 'added':
        change.newIndex === 0 ? newItems.unshift(user) : newItems.push(user);
        break;
      case 'modified':
        // Removed the information of user updated of newItems array
        newItems.splice(change.oldIndex, 1);
        // Added the information of user of newItems array
        newItems.splice(change.newIndex, 0, user);
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
