import { Route, Routes } from 'react-router-dom'
import SpeakersListPage from './SpeakersListPage'
import SpeakerEditPage from './SpeakerEditPage'
import { FunctionComponent } from 'react'

interface ISpeakersRoutesProps {
  eventID: string
}

const SpeakersRoutes: FunctionComponent<ISpeakersRoutesProps> = (props) => {
  const { eventID } = props

  return (
    <Routes>
      <Route path={`/`} element={<SpeakersListPage eventID={eventID} />} />
      <Route path={`/speaker`} element={<SpeakerEditPage eventID={eventID} />} />
    </Routes>
  )
}

export default SpeakersRoutes
