/* globals process */
import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/database'

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

app.initializeApp(config)

const firestore = app.firestore()
const fireStorage = app.storage()
const fireRealtime = app.database()
const auth = app.auth()

firestore.settings({
  cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED,
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

export { app, auth, firestore, fireStorage, fireRealtime }
