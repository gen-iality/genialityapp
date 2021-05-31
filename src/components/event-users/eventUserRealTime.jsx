/**
 * escuchamos los cambios a los datos en la base de datos directamente
 *
 */
// function eventUserRealTime(usersRef) {

//     let userListener = null;

//     userListener = usersRef.orderBy("updated_at", "desc").onSnapshot(
//         {
//             // Listen for document metadata changes
//             //includeMetadataChanges: true
//         }, xxx,
//         (error) => {
//
//             //this.setState({ timeout: true, errorData: { message: error, status: 708 } });
//         }
//     );

// }

function updateAttendees(currentAttendees, snapshot) {
  let newItems = currentAttendees;

  //this.setState({ localChanges });

  let user = 0;
  snapshot.docChanges().forEach((change) => {
    //
    /* change structure: type: "added",doc:doc,oldIndex: -1,newIndex: 0*/
    //
    // Condicional, toma el primer registro que es el mas reciente
    //!snapshot.metadata.fromCache && this.setState({ lastUpdate: new Date() });

    user = change.doc.data();

    user = { ...user, ...user.properties };

    //por si acas
    if (!user._id) {
      user._id = change.doc.id;
    }
    /*user.rol_name = user.rol_name
            ? user.rol_name
            : user.rol_id
                ? rolesList.find(({ name, _id }) => (_id === user.rol_id ? name : ""))
                : "";
        */

    user.created_at = user.created_at && user.created_at.toDate ? user.created_at.toDate() : null;
    user.updated_at = user.updated_at && user.updated_at.toDate ? user.updated_at.toDate() : null;
    user.checkedin_at = user.checkedin_at && user.checkedin_at.toDate ? user.checkedin_at.toDate() : null;

    //user.tiquete = listTickets.find((ticket) => ticket._id === user.ticket_id);

    switch (change.type) {
      case 'added':
        change.newIndex === 0 ? newItems.unshift(user) : newItems.push(user);
        if (user.properties.acompanates && user.properties.acompanates.match(/^[0-9]*$/))
          acompanates += parseInt(user.properties.acompanates, 10);
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

  /*this.setState((prevState) => {
        const usersToShow =
            ticket.length <= 0 || stage.length <= 0 ? [...newItems].slice(0, 50) : [...prevState.users];
        this.percentChecked(newItems)
        this.sumPesoVoto(newItems);
        return {
            userReq: newItems,
            auxArr: newItems,
            users: usersToShow,
            changeItem,
            listTickets,
            loading: false,
            total: newItems.length + acompanates,
            checkIn,
            clearSearch: !prevState.clearSearch,
        };
    });*/

  return newItems;
}
export default updateAttendees;
