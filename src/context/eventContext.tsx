// TODO: rename to EventContext everywhere
import {
  useState,
  createContext,
  useEffect,
  useContext,
  FunctionComponent,
  PropsWithChildren,
} from 'react'
import { useParams } from 'react-router-dom'
import { EventsApi } from '@helpers/request'
import NotFoundPage from '@components/notFoundPage/NotFoundPage'

type WantedParams = {
  event_id: string
  event_name: string
  event: string
}

export interface EventContextState {
  status: 'LOADING' | 'LOADED'
  value: any
  nameEvent: string
  error?: any
  isByname?: boolean
  idEvent?: any
}

const initialContextState: EventContextState = {
  status: 'LOADING',
  value: null,
  nameEvent: '',
  isByname: false,
}

const EventContext = createContext<EventContextState>(initialContextState)

export default EventContext
export const CurrentEventContext = EventContext

const EventProvider: FunctionComponent<PropsWithChildren> = (props) => {
  const { children } = props
  const [eventContext, setEventContext] = useState<EventContextState>(initialContextState)
  const [formatedEventName, setFormatedEventName] = useState<string | null>(null)
  const { event_id, event_name, event } = useParams<WantedParams>()

  if (event_name) {
    const newFormatedEventName = event_name
      .replaceAll('---', 'more')
      .replaceAll('-', '%20')
      .replaceAll('more', '"-"')
    setFormatedEventName(newFormatedEventName)
    setEventContext({
      error: null,
      status: 'LOADING',
      value: null,
      nameEvent: event_name,
    })
  }

  async function fetchEvent(type: string) {
    let eventData: any
    let newEventContextState: EventContextState | undefined

    switch (type) {
      case 'id':
        try {
          eventData = await EventsApi.getOne(event_id || event)
          newEventContextState = {
            status: 'LOADED',
            value: eventData,
            nameEvent: event_id || event,
            isByname: false,
          }
        } catch (err) {
          console.error(err)
          newEventContextState = {
            status: 'LOADED',
            value: null,
            nameEvent: event_name,
            isByname: true,
          }
        }
        break

      case 'name':
        try {
          eventData = await EventsApi.getOneByNameEvent(formatedEventName)
          newEventContextState = {
            status: 'LOADED',
            value: eventData.data[0],
            nameEvent: event_name,
            isByname: true,
          }
        } catch (err) {
          console.error(err)
          newEventContextState = {
            status: 'LOADED',
            value: null,
            nameEvent: event_name,
            isByname: true,
          }
        }
        break

      case 'eventadmin':
        eventData = await EventsApi.getOne(event)
        newEventContextState = {
          status: 'LOADED',
          value: eventData,
          nameEvent: event_id || event,
          idEvent: event,
          isByname: false,
        }
        break
      default:
        console.error(`The type ${type} is unknown for the EventContext`)
        return
    }
    setEventContext(newEventContextState)
  }

  useEffect(() => {
    if (event_id) {
      fetchEvent('id')
    } else if (event_name) {
      fetchEvent('name')
    } else if (event) {
      fetchEvent('eventadmin')
    }
  }, [event_id, event_name, event])

  return (
    <CurrentEventContext.Provider value={eventContext}>
      {eventContext.error ? <NotFoundPage /> : <>{children}</>}
    </CurrentEventContext.Provider>
  )
}

export const CurrentEventProvider = EventProvider

export function useEventContext() {
  const contextevent = useContext(CurrentEventContext)
  if (!contextevent) {
    throw new Error('eventContext debe estar dentro del proveedor')
  }

  return contextevent
}
