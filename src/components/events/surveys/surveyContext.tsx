import { createContext, useContext, useMemo } from 'react'

import { ReactNode, useReducer, useEffect } from 'react'
import type { FunctionComponent } from 'react'
import { useEventContext } from '@context/eventContext'
import { useCurrentUser } from '@context/userContext'
import {
  getStatus as getSurveyStatus,
  resetStatusByRestartAnswering,
} from './services/surveyStatus'

import { getAnswersRef, getQuestionsRef, getUserProgressRef } from './services/surveys'

export enum SurveyContextAction {
  SURVEY_LOADED = 'SURVEY_LOADED',
  SURVEY_STATUS_LOADED = 'SURVEY_STATUS_LOADED',
  ANSWERING_AGAIN = 'ANSWERING_AGAIN',
}

export type SurveyContextReducerActionType =
  | { type: SurveyContextAction.SURVEY_LOADED; survey: any }
  | { type: SurveyContextAction.SURVEY_STATUS_LOADED; surveyStatus: any }
  | { type: SurveyContextAction.ANSWERING_AGAIN; answering: any }

export type SurveyContextType = {
  status: string
  survey: any
  surveyStatus: any
  answering: boolean
  // Flags
  shouldDisplaySurveyIsNotLoaded?: boolean
  shouldDisplaySurveyClosedMenssage?: boolean
  shouldDisplaySurveyNotPublishedMenssage?: boolean
  checkThereIsAnotherTry?: boolean
  shouldDisplaySurveyAnswered?: boolean
  checkIfSurveyWasAnswered?: boolean
  shouldDisplayGraphics?: boolean
  shouldDisplayRanking?: boolean
  completionStatus?: 'running' | 'completed'
}

export type CustomContextMethodType = {
  surveyStatsString: string
  loadSurvey: (survey: any) => void
  startAnswering: () => void
  stopAnswering: () => void
  resetSurveyStatus: (userId: string) => Promise<void>
}

const initialContextState: SurveyContextType = {
  status: 'LOADING',
  survey: null,
  surveyStatus: undefined, //El valor es indefinido hasta que no cargue. puede ser vacio o traer los datos
  answering: false,
}

export const SurveyContext = createContext<SurveyContextType & CustomContextMethodType>(
  {} as never,
)

export function useSurveyContext() {
  const contextsurvey = useContext(SurveyContext)

  if (!contextsurvey) {
    throw new Error('SurveyContext debe estar dentro del proveedor')
  }

  return contextsurvey
}

function reducer(
  state: SurveyContextType,
  action: SurveyContextReducerActionType,
): SurveyContextType {
  switch (action.type) {
    case SurveyContextAction.SURVEY_LOADED:
      return { ...state, survey: action.survey, status: 'LOADED' }
    case SurveyContextAction.SURVEY_STATUS_LOADED:
      return { ...state, surveyStatus: action.surveyStatus }
    case SurveyContextAction.ANSWERING_AGAIN:
      return { ...state, answering: action.answering }
  }
}

export const SurveyProvider: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const cEventContext = useEventContext()
  const cUser = useCurrentUser()

  const [state, dispatch] = useReducer(reducer, initialContextState)

  useEffect(() => {
    // if (!cEventContext || !cEventContext.value) return
    if (!cUser || !cUser.value) return
    if (!state.survey?._id) return
    console.log('getStatus effect', cUser, state.survey)
    getSurveyStatus(state.survey._id, cUser.value._id).then((data) => {
      console.log('getStatus despachando', cEventContext, cUser, state.survey)
      dispatch({ type: SurveyContextAction.SURVEY_STATUS_LOADED, surveyStatus: data })
    })
  }, [cUser, state.survey])

  const loadSurvey = (survey: any) => {
    dispatch({ type: SurveyContextAction.SURVEY_LOADED, survey })
  }

  const checkIfSurveyWasAnswered = useMemo(() => {
    if (!state.surveyStatus) {
      return false
    }

    return state.surveyStatus?.surveyCompleted === 'completed'
  }, [state])

  const completionStatus = useMemo(() => {
    return state.surveyStatus?.surveyCompleted
  }, [state.surveyStatus?.surveyCompleted])

  const checkThereIsAnotherTry = useMemo(() => {
    // If tried (in Firebase) is < that tries (in MongoDB), then the user can see the survey
    if (!state.survey || !state.surveyStatus) return true
    console.debug(`survey tries:${state.survey.tries} tried:${state.surveyStatus.tried}`)
    return (state.surveyStatus.tried || 0) < (state.survey.tries || 1)
  }, [state])

  const startAnswering = () => {
    console.log('start answering again')
    if (checkThereIsAnotherTry)
      dispatch({ type: SurveyContextAction.ANSWERING_AGAIN, answering: true })
  }

  const stopAnswering = () => {
    console.log('stop answering again')
    dispatch({ type: SurveyContextAction.ANSWERING_AGAIN, answering: false })
  }

  const shouldDisplaySurveyAnswered = useMemo(() => {
    if (checkThereIsAnotherTry && state.answering) {
      return false
    }
    return checkIfSurveyWasAnswered
  }, [state, checkThereIsAnotherTry, checkIfSurveyWasAnswered])

  const shouldDisplaySurveyIsNotLoaded = useMemo(() => {
    return state.survey == null || !state.surveyStatus
  }, [state])

  const shouldDisplaySurveyClosedMenssage = useMemo(() => {
    if (state.survey === undefined || state.survey === null) {
      return false
    }
    return !state.survey.isOpened
  }, [state.survey])

  const shouldDisplaySurveyNotPublishedMenssage = useMemo(() => {
    if (state.survey === undefined || state.survey === null) {
      return false
    }
    return !state.survey.isPublished
  }, [state.survey])

  const shouldDisplayGraphics = useMemo(() => {
    if (!state.survey) {
      console.debug('not show graphics because there is no survey')
      return false
    }

    if (!checkIfSurveyWasAnswered) {
      console.debug('not show graphics because checkIfSurveyWasAnswered() is false')
    }

    if (state.survey.displayGraphsInSurveys) {
      console.debug('enable showing graphics')
      return true
    }

    console.debug('not show graphics because survey.displayGraphsInSurveys is false')
    return false
  }, [state, checkIfSurveyWasAnswered])

  const shouldDisplayRanking = useMemo(() => {
    if (!state.survey) {
      return false
    }
    return state.survey.rankingVisible
  }, [state])

  const resetSurveyStatus = async (userId: string) => {
    await resetStatusByRestartAnswering(state.survey._id, userId)
    await getUserProgressRef(state.survey._id, userId).delete()
    await getAnswersRef(state.survey._id, userId).delete()
    await getQuestionsRef(state.survey._id, userId).delete()
  }

  const surveyStatsString = useMemo(() => {
    // Beware of editing this without thinking
    if (!state.surveyStatus || !state.survey) return ''

    const tried = state.surveyStatus.tried || 0
    return `${tried} ${tried > 1 ? 'intentos' : 'intento'} de ${state.survey?.tries || 1}`
  }, [state.survey, state.surveyStatus])

  return (
    <SurveyContext.Provider
      value={{
        ...state,
        loadSurvey,
        checkIfSurveyWasAnswered,
        shouldDisplaySurveyIsNotLoaded,
        shouldDisplaySurveyAnswered,
        shouldDisplaySurveyClosedMenssage,
        shouldDisplaySurveyNotPublishedMenssage,
        shouldDisplayGraphics,
        shouldDisplayRanking,
        completionStatus,
        surveyStatsString,
        checkThereIsAnotherTry,
        startAnswering,
        stopAnswering,
        resetSurveyStatus,
      }}
    >
      {children}
    </SurveyContext.Provider>
  )
}
