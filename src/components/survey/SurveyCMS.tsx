import TriviaEditor, { ITriviaEditorProps } from '@components/trivia/TriviaEditor'

export type ISurveyCMSProps = ITriviaEditorProps

export default function SurveyCMS(props: ISurveyCMSProps) {
  return <TriviaEditor {...props} forceNonGlobal />
}
