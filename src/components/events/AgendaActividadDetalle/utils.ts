import { app, fireRealtime } from "@/helpers/firebase"

const userOnline = {
  isOnline: true,
  lastChange: app.database.ServerValue.TIMESTAMP
}

const userOffline = {
  isOnline: false,
  lastChange: app.database.ServerValue.TIMESTAMP
}

export const listenUserPresenceInActivity = (eventId: string, activityId: string, uid: string) => {
  const userPresenceInActivityRef = fireRealtime.ref(`userStatus/${eventId}/${activityId}/${uid}`)

  fireRealtime.ref('.info/connected').on('value', (snapshot) => {
    if (snapshot.val() === false) {
      return
    }

    userPresenceInActivityRef.onDisconnect().set(userOffline).then(() =>{
      userPresenceInActivityRef.set(userOnline)
    })
  })
}

export const disconnectUserPresenceInActivity = (eventId: string, activityId: string, uid: string) => {
  const userPresenceInActivityRef = fireRealtime.ref(`userStatus/${eventId}/${activityId}/${uid}`)

  userPresenceInActivityRef.set(userOffline)
}