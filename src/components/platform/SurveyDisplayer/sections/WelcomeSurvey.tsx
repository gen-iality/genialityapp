import { FunctionComponent } from 'react'
import InfoSurvey from './InfoSurvey'

interface IWelcomeSurveyProps {
  extraMessage?: string
  onStart?: () => void
}

const WelcomeSurvey: FunctionComponent<IWelcomeSurveyProps> = ({
  extraMessage,
  onStart,
}) => (
  <InfoSurvey
    btnText="Empezar"
    infoText="Click en INICIAR para comenzar"
    extraMessage={extraMessage}
    onClick={onStart}
  />
)

export default WelcomeSurvey
