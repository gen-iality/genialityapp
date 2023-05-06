/** Redux */
import { connect } from 'react-redux'
import * as surveysActions from '../../../redux/survey/actions'

/** Componentes */
import SurveyCard from './components/surveyCard'

/** Context´s */
import { useCurrentUser } from '@context/userContext'
import { useSurveysContext } from '@context/surveysContext'

const { setCurrentSurvey, setSurveyResult } = surveysActions

function SurveyList() {
  const cSurveys = useSurveysContext()

  const currentUser = useCurrentUser()

  const handleClick = (currentSurvey) => {
    cSurveys.select_survey(currentSurvey)
  }
  return (
    <SurveyCard
      publishedSurveys={cSurveys.surveysToBeListedByActivity()}
      status={cSurveys.status}
      currentUser={currentUser}
      handleClick={handleClick}
      currentSurveyStatus={cSurveys.currentSurveyStatus}
    />
  )
}

const mapStateToProps = (state) => ({
  activity: state.stage.data.currentActivity,
})

const mapDispatchToProps = {
  setCurrentSurvey,
  setSurveyResult,
}

export default connect(mapStateToProps, mapDispatchToProps)(SurveyList)
