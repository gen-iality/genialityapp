import { FunctionComponent } from 'react'

/** Context */
import { SurveyProvider } from '@components/events/surveys/surveyContext'

/** Components */
import StreamingActivityDisplayer from './displayers/StreamingActivityDisplayer'
import MeetingActivityDisplayer from './displayers/MeetingActivityDisplayer'
import QuizActivityDisplayer from './displayers/QuizActivityDisplayer'
import VideoActivityDisplayer from './displayers/VideoActivityDisplayer'
import GenericActivityDisplayer from './displayers/GenericActivityDisplayer'
import SurveyActivityDisplayer from './displayers/SurveyActivityDisplayer'
import PdfActivityDisplayer from './displayers/PdfActivityDisplayer'
import HtmlActivityDisplayer from './displayers/HtmlActivityDisplayer'

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
      return <StreamingActivityDisplayer activity={activity} />
    case 'meeting':
      return <MeetingActivityDisplayer activity={activity} />
    case 'url':
    case 'cargarvideo':
      return <VideoActivityDisplayer activity={activity} />
    case 'pdf':
    case 'pdf2':
      return <PdfActivityDisplayer activity={activity} />
    case 'quiz':
    case 'quizing':
      return (
        <SurveyProvider>
          <QuizActivityDisplayer activity={activity} />
        </SurveyProvider>
      )
    case 'survey':
      return (
        <SurveyProvider>
          <SurveyActivityDisplayer activity={activity} />
        </SurveyProvider>
      )
    case 'html':
      return <HtmlActivityDisplayer activity={activity} />
    default:
      return <GenericActivityDisplayer activity={activity} />
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
