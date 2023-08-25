import { FunctionComponent } from 'react'
import InfoSurvey from '../sections/InfoSurvey'

interface IWelcomeSurveyProps {
  extraMessage?: string
  onFinish?: () => void
}

const FinishSurvey: FunctionComponent<IWelcomeSurveyProps> = ({
  extraMessage,
  onFinish: onStart,
}) => (
  <InfoSurvey
    btnText="Finalizar"
    infoText="Click en Finalizar"
    extraMessage={extraMessage}
    onClick={onStart}
  />
)

export default FinishSurvey
