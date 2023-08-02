import { FunctionComponent, PropsWithChildren, createContext, useContext } from 'react'
import { app, firestore } from '@helpers/firebase'
import { useState } from 'react'
import { useEffect } from 'react'
import privateInstance from '@helpers/request'

export interface UserContextState {
  status: 'LOADING' | 'LOADED' | 'ERROR'
  value: any
  error?: any
  resetUser: () => void
  setCurrentUser: (value: any) => void
}

const initialContextState: UserContextState = {
  status: 'LOADING',
  value: null,
} as UserContextState

const UserContext = createContext<UserContextState>(initialContextState)
export default UserContext

export const CurrentUserContext = UserContext

export const UserContextProvider: FunctionComponent<PropsWithChildren> = (props) => {
  const { children } = props

  const [userContext, setUserContext] = useState(initialContextState)
  const conectionRef = firestore.collection(`connections`)

  const resetUser = () => {
    console.log('call reset event user')
    setUserContext({ ...userContext, status: 'LOADING', value: null })
  }

  //seteando con el auth al current user || falta eventUser
  useEffect(() => {
    let unsubscribe: undefined | (() => void)

    async function requestUserData() {
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
                    setUserContext({
                      ...userContext,
                      status: 'LOADED',
                      value: response.data,
                    })
                  } else {
                    setUserContext({ ...userContext, status: 'LOADED', value: null })
                  }
                })
                .catch((err: any) => {
                  //ESTE CATCH SIRVE PARA CUANDO SE CAMBIA DE STAGIN A PROD// Usuarios que no se encuentran en la otra bd
                  console.error(err)
                  app
                    .auth()
                    .signOut()
                    .then(async () => {
                      const docRef = await conectionRef
                        .where('email', '==', app.auth().currentUser?.email)
                        .get()
                      if (docRef.docs.length > 0) {
                        await conectionRef.doc(docRef.docs[0].id).delete()
                      }

                      setUserContext({ ...userContext, status: 'LOADED', value: null })
                    })
                    .catch((err) => {
                      console.error(err)
                      setUserContext({ ...userContext, status: 'LOADED', value: null })
                    })
                })
            })
          } else if (user?.isAnonymous && user) {
            // Obtenert user
            const obtainDisplayName = () => {
              if (!!app.auth().currentUser?.displayName) {
                /**
                 * NOTE: IMPORTANT!!! - To get the email (and create the
                 * EventUser object), this value is saved in the photoURL param
                 * of firebase
                 */
                setUserContext({
                  ...userContext,
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
            setUserContext({ ...userContext, status: 'LOADED', value: null })
          }
        })
      } catch (e) {
        setUserContext({ ...userContext, status: 'ERROR', value: null })
      }
    }
    requestUserData()
    return () => {
      unsubscribe && unsubscribe()
    }
  }, [])

  return (
    <CurrentUserContext.Provider
      value={{ ...userContext, resetUser, setCurrentUser: setUserContext }}
    >
      {children}
    </CurrentUserContext.Provider>
  )
}

export const CurrentUserProvider = UserContextProvider

export function useCurrentUser() {
  const contextuser = useContext(CurrentUserContext)
  if (!contextuser) {
    throw new Error('currentUser debe estar dentro del proveedor')
  }
  return contextuser
}
