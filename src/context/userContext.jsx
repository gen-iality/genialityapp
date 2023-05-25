import { createContext, useContext } from 'react'
import { app, firestore } from '@helpers/firebase'
import { useState } from 'react'
import { useEffect } from 'react'
import privateInstance from '@helpers/request'

export const CurrentUserContext = createContext()
const initialContextState = { status: 'LOADING', value: undefined }

export function CurrentUserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(initialContextState)
  const conectionRef = firestore.collection(`connections`)

  //seteando con el auth al current user || falta eventUser
  useEffect(() => {
    let unsubscribe
    async function asyncdata() {
      try {
        unsubscribe = app.auth().onAuthStateChanged((user) => {
          if (!user?.isAnonymous && user) {
            user.getIdToken().then(async function (idToken) {
              const lastSignInTime = (await user.getIdTokenResult()).authTime
              privateInstance
                .get(`/auth/currentUser?evius_token=${idToken}`)
                .then(async (response) => {
                  if (response.data) {
                    conectionRef.doc(user.uid).set({
                      id: user?.uid,
                      email: user?.email,
                      lastSignInTime: lastSignInTime,
                    })
                    setCurrentUser({ status: 'LOADED', value: response.data })
                  } else {
                    setCurrentUser({ status: 'LOADED', value: null })
                  }
                })
                .catch((e) => {
                  //ESTE CATCH SIRVE PARA CUANDO SE CAMBIA DE STAGIN A PROD// Usuarios que no se encuentran en la otra bd
                  app
                    .auth()
                    .signOut()
                    .then(async (resp) => {
                      console.debug({ resp })
                      const docRef = await conectionRef
                        .where('email', '==', app.auth().currentUser?.email)
                        .get()
                      if (docRef.docs.length > 0) {
                        await conectionRef.doc(docRef.docs[0].id).delete()
                      }

                      setCurrentUser({ status: 'LOADED', value: null })
                    })
                    .catch(() => setCurrentUser({ status: 'LOADED', value: null }))
                })
            })
          } else if (user?.isAnonymous && user) {
            // Obtenert user
            const obtainDisplayName = () => {
              if (app.auth().currentUser.displayName != null) {
                /**para poder obtener el email y crear despues un eventUser se utiliza el parametro photoURL de firebas para almacenar el email */
                setCurrentUser({
                  status: 'LOADED',
                  value: {
                    names: user.displayName,
                    email: user.photoURL,
                    isAnonymous: true,
                    _id: user.uid,
                  },
                })
              } else {
                setTimeout(() => {
                  obtainDisplayName()
                }, 500)
              }
            }
            obtainDisplayName()
          } else {
            setCurrentUser({ status: 'LOADED', value: null })
          }
        })
      } catch (e) {
        setCurrentUser({ status: 'ERROR', value: null })
      }
    }
    asyncdata()
    return () => {
      unsubscribe && unsubscribe()
    }
  }, [])

  return (
    <CurrentUserContext.Provider
      value={{ ...currentUser, setCurrentUser: setCurrentUser }}
    >
      {children}
    </CurrentUserContext.Provider>
  )
}

export function useCurrentUser() {
  const contextuser = useContext(CurrentUserContext)
  if (!contextuser) {
    throw new Error('currentUser debe estar dentro del proveedor')
  }
  return contextuser
}
