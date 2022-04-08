import { firestore, app } from '@/helpers/firebase';

export const remoteLogOutValidator = (params: any) => {
  // /* Creating a reference to the connection object. */
  const conectionRef = firestore.collection(`connections`);

  /**
   * It gets the last sign in time of the user.
   * @returns The last sign user time.
   */
  async function getlastSignInTime() {
    const user = app.auth().currentUser;
    if (!user) return;

    const lastSignInTime = (await user.getIdTokenResult()).authTime;
    return lastSignInTime;
  }

  /**
   * *If the change type is not an add and the email in the change is diferent as the current user's
   * email, return true.*
   * @param {object} change - The change object.
   * @returns a boolean value.
   */
  function docChangesTypeAndEmailValidation(change: any) {
    if (change.type !== 'added' && change?.doc?.data()?.email === params.user.email) return true;

    return false;
  }

  const unsubscribe = conectionRef.onSnapshot((snapshot) => {
    const changes = snapshot.docChanges();
    if (changes) {
      changes.forEach((change) => {
        if (docChangesTypeAndEmailValidation(change)) {
          getlastSignInTime().then((userlastSignInTime) => {
            if (change?.doc?.data()?.lastSignInTime !== userlastSignInTime && change.type == 'modified')
              params.helperDispatch({ type: 'logout', showNotification: true, params });
            if (change.type == 'removed') params.helperDispatch({ type: 'logout', showNotification: true, params });
          });
        }
      });
    }
  });

  return unsubscribe;
};
