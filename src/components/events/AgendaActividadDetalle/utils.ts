import { app, fireRealtime } from "@/helpers/firebase"

const userOnline = (voteWeight: number) => ({
  voteWeight,
  isOnline: true,
  lastChange: app.database.ServerValue.TIMESTAMP
})

const userOffline = (voteWeight: number) => ({
  voteWeight,
  isOnline: false,
  lastChange: app.database.ServerValue.TIMESTAMP
})

export const listenUserPresenceInActivity = (eventId: string, activityId: string, uid: string, voteWeight: number) => {
  const userPresenceInActivityRef = fireRealtime.ref(`userStatus/${eventId}/${activityId}/${uid}`)

  fireRealtime.ref('.info/connected').on('value', (snapshot) => {
    if (snapshot.val() === false) {
      return
    }

    userPresenceInActivityRef.onDisconnect().set(userOffline(voteWeight)).then(() =>{
      userPresenceInActivityRef.set(userOnline(voteWeight))
    })
  })
}

export const disconnectUserPresenceInActivity = (eventId: string, activityId: string, uid: string, voteWeight: number) => {
  const userPresenceInActivityRef = fireRealtime.ref(`userStatus/${eventId}/${activityId}/${uid}`)

  userPresenceInActivityRef.set(userOffline(voteWeight))
}