import { FunctionComponent } from 'react'

/** Context */
import { SurveyProvider } from '@components/events/surveys/surveyContext'

/** Components */
import StreamingDisplayer from './displayers/StreamingDisplayer'
import MeetingDisplayer from './displayers/MeetingDisplayer'
import QuizDisplayer from './displayers/QuizDisplayer'
import VideoDisplayer from './displayers/VideoDisplayer'
import GenericDisplayer from './displayers/GenericDisplayer'
import SurveyDisplayer from './displayers/SurveyDisplayer'
import PdfDisplayer from './displayers/PdfDisplayer'
import HtmlDisplayer from './displayers/HtmlDisplayer'

interface IActivityDisplayerProps {
  activity: any
}

function switchActivity(activity: IActivityDisplayerProps['activity']) {
  console.debug(activity)
  const activityType: string | undefined = activity.type?.name
  console.debug('HOC: activityType', activityType)

  switch (activityType) {
    case 'eviusMeet':
    case 'vimeo':
    case 'youTube':
      return <StreamingDisplayer activity={activity} />
    case 'meeting':
      return <MeetingDisplayer activity={activity} />
    case 'url':
    case 'cargarvideo':
      return <VideoDisplayer activity={activity} />
    case 'pdf':
    case 'pdf2':
      return <PdfDisplayer activity={activity} />
    case 'quiz':
    case 'quizing':
      return (
        <SurveyProvider>
          <QuizDisplayer activity={activity} />
        </SurveyProvider>
      )
    case 'survey':
      return (
        <SurveyProvider>
          <SurveyDisplayer activity={activity} />
        </SurveyProvider>
      )
    case 'html':
      return <HtmlDisplayer activity={activity} />
    default:
      return <GenericDisplayer activity={activity} />
  }
}

const ActivityDisplayer: FunctionComponent<IActivityDisplayerProps> = ({ activity }) => {
  return (
    <header>
      <div>{switchActivity(activity)}</div>
    </header>
  )
}

export default ActivityDisplayer
