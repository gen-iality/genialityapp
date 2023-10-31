import { FunctionComponent } from 'react'

/** Context */
import { SurveyProvider } from '@components/events/surveys/surveyContext'

/** Components */
import StreamingActivityDisplayer from './displayers/StreamingActivityDisplayer'
import MeetingActivityDisplayer from './displayers/MeetingActivityDisplayer'
import QuizActivityDisplayer from './displayers/QuizActivityDisplayer'
import VideoActivityDisplayer from './displayers/VideoActivityDisplayerPro'
import GenericActivityDisplayer from './displayers/GenericActivityDisplayer'
import SurveyActivityDisplayer from './displayers/SurveyActivityDisplayer'
import PdfActivityDisplayer from './displayers/PdfActivityDisplayer'
import HtmlActivityDisplayer from './displayers/HtmlActivityDisplayer'

interface IActivityDisplayerProps {
  activity: any
  onActivityProgress?: (percent: number) => void
}

function switchActivity(
  activity: IActivityDisplayerProps['activity'],
  onActivityProgress?: IActivityDisplayerProps['onActivityProgress'],
) {
  // console.debug(activity)
  const activityType: string | undefined = activity.type?.name
  // console.debug('HOC: activityType', activityType)

  switch (activityType) {
    case 'eviusMeet':
    case 'vimeo':
    case 'youTube':
    case 'live':
      return (
        <StreamingActivityDisplayer
          activity={activity}
          onActivityProgress={onActivityProgress}
        />
      )
    case 'meeting':
      return (
        <MeetingActivityDisplayer
          activity={activity}
          onActivityProgress={onActivityProgress}
        />
      )
    case 'url':
    case 'cargarvideo':
    case 'video':
      return (
        <VideoActivityDisplayer
          activity={activity}
          onActivityProgress={onActivityProgress}
        />
      )
    case 'pdf':
    case 'pdf2':
      return (
        <PdfActivityDisplayer
          activity={activity}
          onActivityProgress={onActivityProgress}
        />
      )
    case 'quiz':
    case 'quizing':
      return (
        <SurveyProvider>
          <QuizActivityDisplayer
            activity={activity}
            onActivityProgress={onActivityProgress}
          />
        </SurveyProvider>
      )
    case 'survey':
      return (
        <SurveyProvider>
          <SurveyActivityDisplayer
            activity={activity}
            onActivityProgress={onActivityProgress}
          />
        </SurveyProvider>
      )
    case 'html':
      return (
        <HtmlActivityDisplayer
          activity={activity}
          onActivityProgress={onActivityProgress}
        />
      )
    default:
      return (
        <GenericActivityDisplayer
          activity={activity}
          onActivityProgress={onActivityProgress}
        />
      )
  }
}

const ActivityDisplayer: FunctionComponent<IActivityDisplayerProps> = ({
  activity,
  onActivityProgress,
}) => {
  return <section>{switchActivity(activity, onActivityProgress)}</section>
}

export default ActivityDisplayer
