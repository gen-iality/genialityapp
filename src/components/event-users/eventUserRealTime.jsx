
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
//             console.log(error);
//             //this.setState({ timeout: true, errorData: { message: error, status: 708 } });
//         }
//     );



// }

function updateAttendees(currentAttendees, snapshot) {

    let checkIn = 0;
    let newItems = currentAttendees;
    let changeItem = false;

    // Set data localChanges with hasPendingWrites
    let localChanges = snapshot.metadata.hasPendingWrites ? "Local" : "Server";
    //this.setState({ localChanges });
    console.log("snapshot", snapshot);
    let user, acompanates = 0;
    snapshot.docChanges().forEach((change) => {
        //console.log("change", change, change.doc.data());
        /* change structure: type: "added",doc:doc,oldIndex: -1,newIndex: 0*/
        // console.log("cambios", change);
        // Condicional, toma el primer registro que es el mas reciente
        //!snapshot.metadata.fromCache && this.setState({ lastUpdate: new Date() });

        user = change.doc.data();
        console.log("userchange", user, change);
        user = { ...user, ...user.properties }

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

        user.created_at = (user.created_at && user.created_at.toDate) ? user.created_at.toDate() : null;
        user.updated_at = (user.updated_at && user.updated_at.toDate) ? user.updated_at.toDate() : null;
        user.checkedin_at = (user.checkedin_at && user.checkedin_at.toDate) ? user.checkedin_at.toDate() : null;

        //user.tiquete = listTickets.find((ticket) => ticket._id === user.ticket_id);

        switch (change.type) {
            case "added":
                change.newIndex === 0 ? newItems.unshift(user) : newItems.push(user);
                if (user.properties.acompanates && user.properties.acompanates.match(/^[0-9]*$/))
                    acompanates += parseInt(user.properties.acompanates, 10);
                break;
            case "modified":

                // Removed the information of user updated of newItems array
                newItems.splice(change.oldIndex, 1);
                // Added the information of user of newItems array
                newItems.splice(change.newIndex, 0, user);
                break;
            case "removed":
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
