import { firestore, app } from '@helpers/firebase';
import { remoteLogoutNotification } from './remoteLogoutNotification';
import { logoutInterface } from '../interfaces/interfaces';

let initialStateEvenUserContext = { status: 'LOADING', value: null };
let initialStateUserContext = { status: 'LOADING', value: undefined };

/**
 * @function logout - Close session in firebase and eliminate active session validator, set userContext and eventUserContext to default states
 * @param {boolean} showNotification If the value is true the remote logout notification is displayed
 */

export const logout = async ({ showNotification, params }: logoutInterface) => {
  const { formatMessage, user, handleChangeTypeModal, setuserEvent, setCurrentUser, history } = params;

  const currentUser = app.auth()?.currentUser;

  if (!currentUser) return;

  /* Creating a reference to the connection object. */
  const conectionRef = firestore.collection(`connections`);

  const lastSignInTime = (await currentUser.getIdTokenResult()).authTime;

  app
    .auth()
    .signOut()
    .then(async () => {
      const currentUserConnect = await conectionRef.doc(user.uid).get();

      if (currentUserConnect?.data()?.lastSignInTime === lastSignInTime) await conectionRef.doc(user.uid).delete();
      const routeUrl = window.location.href;
      const weAreOnTheLanding = routeUrl.includes('landing');
      handleChangeTypeModal(null);
      setuserEvent(initialStateEvenUserContext);
      setCurrentUser(initialStateUserContext);
      if (showNotification) remoteLogoutNotification({ type: 'info', names: user.names, formatMessage });
      if (!weAreOnTheLanding) {
        history.push('/');
      }
    })
    .catch(function(error) {
      console.error('error', error);
    });

  return null;
};
