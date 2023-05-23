import { FunctionComponent } from 'react'

/** Context */
import { SurveyProvider } from '@components/events/surveys/surveyContext'

/** Components */
import StreamingActivity from './ActivityTypes/StreamingActivity'
import MeetingActivity from './ActivityTypes/MeetingActivity'
import QuizActivity from './ActivityTypes/QuizActivity'
import VideoActivity from './ActivityTypes/VideoActivity'
import GenericActivity from './ActivityTypes/GenericActivity'
import SurveyActivity from './ActivityTypes/SurveyActivity'
import PdfActivity from './ActivityTypes/PdfActivity'
import HtmlActivity from './ActivityTypes/HtmlActivity'

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
      return <StreamingActivity activity={activity} />
    case 'meeting':
      return <MeetingActivity activity={activity} />
    case 'url':
    case 'cargarvideo':
      return <VideoActivity activity={activity} />
    case 'pdf':
    case 'pdf2':
      return <PdfActivity activity={activity} />
    case 'quiz':
    case 'quizing':
      return (
        <SurveyProvider>
          <QuizActivity activity={activity} />
        </SurveyProvider>
      )
    case 'survey':
      return (
        <SurveyProvider>
          <SurveyActivity activity={activity} />
        </SurveyProvider>
      )
    case 'html':
      return <HtmlActivity activity={activity} />
    default:
      return <GenericActivity activity={activity} />
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
