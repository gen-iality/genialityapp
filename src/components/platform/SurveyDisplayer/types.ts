export type AvailableSurveyStatus = 'initial' | 'started' | 'finished'

type FoolBoolean = boolean | 'true' | 'false'

export interface BaseSurveyQuestion {
  title: string
  id: string
  isRequired?: boolean
  image: string | null
  url: string | null
  video: string | null
  points: number
}

export type SurveyQuestion = BaseSurveyQuestion &
  (
    | {
        type: 'radiogroup' | 'checkbox' | 'ranking' | 'comment' | 'text'
        // | string
        choices: string[]
        /** @deprecated it will be removed. Use `correctAnswerIndex` instead */
        correctAnswer: string[]
        correctAnswerIndex: number[]
      }
    | {
        type: 'matrix'
        // | string
        choices: {
          columns: { value: number; text: string }[]
          rows: string[]
        }
        correctAnswer: { [x: string]: number }
        /** @deprecated it will be removed. Use `correctAnswerIndex` instead */
        correctAnswerIndex: number[]
      }
    | {
        type: 'rating'
        maxRateDescription: string
        choices: never[]
        rateMax: number
        minRateDescription: string
        correctAnswer: number | string
        correctAnswerIndex: string[]
        rateMin: number
      }
  )

export interface SurveyData {
  _id?: string
  survey: string
  show_horizontal_bar: boolean
  graphyType: string
  allow_vote_value_per_user: FoolBoolean
  event_id: string
  activity_id: string
  points: number
  initialMessage: string
  time_limit: number
  win_Message: string
  neutral_Message: string
  lose_Message: string
  allow_anonymous_answers: FoolBoolean
  allow_gradable_survey: FoolBoolean
  hasMinimumScore: FoolBoolean
  isGlobal: FoolBoolean
  showNoVotos: FoolBoolean
  freezeGame: boolean
  open: FoolBoolean
  publish: FoolBoolean
  minimumScore: number
  updated_at: string
  created_at: string
  questions: SurveyQuestion[]
  displayGraphsInSurveys: FoolBoolean
  rankingVisible: FoolBoolean
  random_survey_count: number
  random_survey: boolean
}

export interface SurveyRealtimeData {
  activity_id: string
  allow_anonymous_answers: FoolBoolean
  allow_gradable_survey: FoolBoolean
  category: any
  displayGraphsInSurveys: FoolBoolean
  eventId: string
  freezeGame: boolean
  hasMinimumScore: FoolBoolean
  isGlobal: FoolBoolean
  isOpened: FoolBoolean
  isPublished: FoolBoolean
  minimumScore: number
  name: string
  random_survey: boolean
  random_survey_count: number
  rankingVisible: FoolBoolean
  showNoVotos: FoolBoolean
  time_limit: number
  tries: number
}

export interface SurveyPreModel extends SurveyRealtimeData, SurveyData {
  currentPage: number
}

export type SurveyStatus = {
  surveyCompleted: string
  right: number
}

export type SurveyStats = {
  total: number
  right: number
  minimum: number
}

export interface IQuestionDisplayer {
  question: SurveyQuestion
  /**
   * Register the answer for a question.
   * @param answer The current answer.
   * @param isCorrect If the answer is correct.
   * @param points the gained points.
   * @returns undefined
   */
  onAnswer?: (answer: any, isCorrect: boolean, points: number) => void
}

export interface ISurveyDisplayerUIProps {
  title: string
  isGradable?: boolean
  questions: SurveyQuestion[]
  status?: AvailableSurveyStatus
  questionIndex: number
  // Status messages
  welcomeMessage?: string
  winMessage?: string
  loseMessage?: string
  finishMessage?: string
  /**
   * Minimum score value to mark the survey as won
   */
  minimumScore: number
  // Some functions
  onFinish?: () => void
  onChangeQuestionIndex?: (questionIndex: number, nextPageIsTheEnd: boolean) => void
  onAnswer?: (
    question: SurveyQuestion,
    answer: any,
    isCorrect: boolean,
    points: number,
    noMoreQuestion: boolean,
  ) => Promise<void> | void
}
