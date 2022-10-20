import { fireRealtime, app } from '@helpers/firebase';
import { uniqueID } from '@helpers/utils';
import dayjs from 'dayjs';

const initBroadcastViewers = async (
  event_id: string,
  activity_id: string,
  activity_name: string,
  userContext: any,
  state?: string
) => {
  const userAnonimo = localStorage.getItem('userAnonimo');
  if (!userContext.value) {
    if (userAnonimo) {
      // Set user anonimo
      initUserPresenceInner(JSON.parse(userAnonimo), event_id, activity_id, state);
    } else {
      const uid = uniqueID();
      const user = {
        names: activity_name + ' ' + uid.substr(-4),
        email: uid.substr(-4) + '@evius.co',
        _id: uid,
        isAnonymous: true,
      };
      window.localStorage.setItem('userAnonimo', JSON.stringify(user));
      initUserPresenceInner(user, event_id, activity_id, state);
    }
  } else {
    if (userAnonimo) {
      const user = JSON.parse(userAnonimo);
      const refViewer = fireRealtime.ref(`/viewers/${event_id}/activities/${activity_id}/uniqueUsers/${user._id}`);
      await refViewer.remove();
      window.localStorage.removeItem('userAnonimo');
      //delete user anonimo cuando se inicia session en un usuario registrado
    }
    initUserPresenceInner(userContext.value, event_id, activity_id, state);
  }
};

const initUserPresenceInner = async (user: any, event_id: string, activity_id: string, state?: string) => {
  const uid = user._id;
  const time = uid + dayjs().format('HH:mm:ss');
  const uniqueUsers = fireRealtime.ref(`/viewers/${event_id}/activities/${activity_id}/uniqueUsers/${uid}`);
  const totalViews = fireRealtime.ref(`/viewers/${event_id}/activities/${activity_id}/total/${time}`);

  const isOfflineForDatabase = {
    state: 'offline',
    last_changed: app.database.ServerValue.TIMESTAMP,
    names: user.names || '',
    email: user.email || '',
    id: user._id || '',
  };

  const isOnlineForDatabase = {
    state: 'online',
    last_changed: app.database.ServerValue.TIMESTAMP,
    names: user.names || '',
    email: user.email || '',
    id: user._id || '',
  };

  const isViewer = {
    state: 'viewer',
    names: user.names || '',
    email: user.email || '',
    id: user._id || '',
    date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  };
  if (state) {
    uniqueUsers.set(isOfflineForDatabase);
  } else {
    fireRealtime.ref('.info/connected').on('value', function(snapshot) {
      totalViews.set(isViewer);
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
  }
};

export default initBroadcastViewers;
