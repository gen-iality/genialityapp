import TriviaEditor, { ITriviaEditorProps } from '@components/trivia/TriviaEditor'

export type QuizCMSProps = ITriviaEditorProps

function QuizCMS(props: QuizCMSProps) {
  return <TriviaEditor {...props} forceGradable={true} forceNonGlobal />
}

export default QuizCMS
