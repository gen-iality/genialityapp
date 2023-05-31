import app from 'firebase/compat/app'

import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'
import 'firebase/compat/database'

/**
 * FIRESTORE algunas veces se demora en traer los datos
 * para cosas super realtime usar firebase realtime
 * https://stackoverflow.com/questions/46717898/firestore-slow-performance-issue-on-getting-data
 */

const config = {
  apiKey: import.meta.env.VITE_FB_APIKEY_EVIUSAUTH,
  authDomain: import.meta.env.VITE_FB_AUTHDOMAIN_EVIUSAUTH,
  databaseURL: import.meta.env.VITE_FB_DB_EVIUSAUTH,
  projectId: import.meta.env.VITE_PROJECTID_EVIUSAUTH,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET_EVIUSAUTH,
  appId: import.meta.env.VITE_APPID_EVIUSAUTH,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDER_EVIUSAUTH,
  measurementId: import.meta.env.VITE_MEASUREMENTID_EVIUSAUTH,
}

const configEviuschat = {
  apiKey: import.meta.env.VITE_FB_APIKEY_CHATEVIUS,
  authDomain: import.meta.env.VITE_FB_AUTHDOMAIN_CHATEVIUS,
  databaseURL: import.meta.env.VITE_FB_DB_CHATEVIUS,
  projectId: import.meta.env.VITE_PROJECTID_CHATEVIUS,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET_CHATEVIUS,
  appId: import.meta.env.VITE_APPID_CHATEVIUS,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDER_CHATEVIUS,
  measurementId: import.meta.env.VITE_MEASUREMENTID_CHATEVIUS,
}

const eviusaauth = app.initializeApp(config)
const eviuschat = app.initializeApp(configEviuschat, 'secondary')

const firestore = eviusaauth.firestore()
const fireStorage = eviusaauth.storage()
const fireRealtime = eviusaauth.database()
const auth = eviusaauth.auth()
const ServerValue = app.database.ServerValue
const FieldValue = app.firestore.FieldValue

const firestoreeviuschat = eviuschat.firestore()
const realTimeviuschat = eviuschat.database()

firestore.settings({
  cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED,
  merge: true,
})

firestore
  .enablePersistence({ synchronizeTabs: true })
  .then(() => {
    window.eviusFailedPersistenceEnabling = false
  })
  .catch((err) => {
    console.error(err)
    window.eviusFailedPersistenceEnabling = true
  })

window.firebase = app

export {
  app,
  auth,
  firestore,
  fireStorage,
  fireRealtime,
  firestoreeviuschat,
  realTimeviuschat,
  ServerValue,
  FieldValue,
}
