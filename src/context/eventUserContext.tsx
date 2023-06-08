import { useState, useEffect, createContext, useContext, FunctionComponent } from 'react'
import { EventsApi } from '@helpers/request'
import { useEventContext } from './eventContext'
import { app } from '@helpers/firebase'
import { useCurrentUser } from './userContext'

export interface EventUserContextState {
  status: 'LOADING' | 'LOADED'
  value: any
  error?: any
  resetEventUser: () => void
  requestUpdate: () => void
  setuserEvent: (eu: EventUserContextState) => void
}

const initialContextState: EventUserContextState = {
  status: 'LOADING',
  value: null,
  resetEventUser: () => {},
} as EventUserContextState

const EventUserContext = createContext<EventUserContextState>(initialContextState)

export default EventUserContext

export const CurrentEventUserContext = EventUserContext

const UserEventProvider: FunctionComponent = (props) => {
  const { children } = props

  const cEvent = useEventContext()
  const cUser = useCurrentUser()

  const [eventUserContext, setEventUserContext] =
    useState<EventUserContextState>(initialContextState)
  const [updateUser, setUpdateUser] = useState(true)

  const requestEventUserData = async (eventId: string) => {
    console.log('request event user for event:', eventId)
    try {
      EventsApi.getStatusRegister(eventId, cUser.value.email).then((responseStatus) => {
        console.log('responseStatus ', responseStatus, 'upadateUser ', updateUser)
        if (responseStatus.data.length > 0) {
          setEventUserContext({
            ...eventUserContext,
            status: 'LOADED',
            value: responseStatus.data[0],
          })
        } else {
          setEventUserContext({ ...eventUserContext, status: 'LOADED', value: null })
        }
        setUpdateUser(false)
      })
    } catch (e) {
      setEventUserContext({
        ...eventUserContext,
        status: 'LOADED',
        value: null,
        error: e,
      })
      setUpdateUser(false)
    }
  }

  const resetEventUser = () => {
    console.log('call reset event user')
    setEventUserContext({ ...eventUserContext, status: 'LOADING', value: null })
  }

  /**
   * Active an update of the event user data
   */
  const requestUpdate = () => {
    setUpdateUser(true)
  }

  useEffect(() => {
    const unsubscribe = app.auth().onAuthStateChanged((user) => {
      if (!user?.isAnonymous && user) {
        setUpdateUser(true)
      }
    })
    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    const eventId = cEvent.value?._id

    if (!eventId) return

    if (cUser.value == null || cUser.value == undefined) {
      return
    }

    // If it is not needed an updating, then return
    if (!updateUser) return

    requestEventUserData(eventId)
  }, [cEvent.value, cUser.value, updateUser])

  return (
    <CurrentEventUserContext.Provider
      value={{
        ...eventUserContext,
        setuserEvent: setEventUserContext,
        requestUpdate,
        resetEventUser,
      }}
    >
      {children}
    </CurrentEventUserContext.Provider>
  )
}

export const CurrentUserEventProvider = UserEventProvider

export function useUserEvent() {
  const contextuser = useContext(CurrentEventUserContext)
  if (!contextuser) {
    throw new Error('useEventuser debe estar dentro del proveedor')
  }

  return contextuser
}
