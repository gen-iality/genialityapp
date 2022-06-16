import { fireRealtime, app } from '../helpers/firebase';
import { uniqueID } from '@/helpers/utils';
import momemt from 'moment';
let initBroadcastViewers = async (event_id: string, activity_id: string, activity_name: string, userContext: any) => {
  const userAnonimo = localStorage.getItem('userAnonimo');
  if (!userContext.value) {
    if (userAnonimo) {
      // Set user anonimo
      initUserPresenceInner(JSON.parse(userAnonimo), event_id, activity_id);
    } else {
      let uid = uniqueID();
      let user = {
        names: activity_name + ' ' + uid.substr(-4),
        email: uid.substr(-4) + '@evius.co',
        _id: uid,
        isAnonymous: true,
      };
      window.localStorage.setItem('userAnonimo', JSON.stringify(user));
      initUserPresenceInner(user, event_id, activity_id);
    }
  } else {
    if (userAnonimo) {
      let user = JSON.parse(userAnonimo);
      const refViewer = fireRealtime.ref(`/viewers/${event_id}/activities/${activity_id}/uniqueUsers/${user._id}`);
      await refViewer.remove();
      window.localStorage.removeItem('userAnonimo');
      //delete user anonimo cuando se inicia session en un usuario registrado
    }
    initUserPresenceInner(userContext.value, event_id, activity_id);
  }
};

let initUserPresenceInner = async (user: any, event_id: string, activity_id: string) => {
  let uid = user._id;
  let time = uid + momemt().format('HH:mm:ss');
  var uniqueUsers = fireRealtime.ref(`/viewers/${event_id}/activities/${activity_id}/uniqueUsers/${uid}`);
  var totalViews = fireRealtime.ref(`/viewers/${event_id}/activities/${activity_id}/total/${time}`);

  var isOfflineForDatabase = {
    state: 'offline',
    last_changed: app.database.ServerValue.TIMESTAMP,
    names: user.names || '',
    email: user.email || '',
    id: user._id || '',
  };

  var isOnlineForDatabase = {
    state: 'online',
    last_changed: app.database.ServerValue.TIMESTAMP,
    names: user.names || '',
    email: user.email || '',
    id: user._id || '',
  };

  var isViewer = {
    state: 'viewer',
    names: user.names || '',
    email: user.email || '',
    id: user._id || '',
    date: momemt().format('YYYY-MM-DD HH:mm:ss'),
  };

  totalViews.set(isViewer);

  fireRealtime.ref('.info/connected').on('value', function(snapshot) {
    if (snapshot.val() == false) {
      return;
    }
    uniqueUsers
      .onDisconnect()
      .set(isOfflineForDatabase)
      .then(function() {
        uniqueUsers.set(isOnlineForDatabase);
      });
  });
};

export default initBroadcastViewers;
