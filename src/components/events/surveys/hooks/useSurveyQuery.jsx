import { useState, useEffect } from 'react'
import loadSelectedSurvey from './../functions/loadSelectedSurvey'
import initRealTimeSurveyListening from './../functions/initRealTimeSurveyListening'
import { getCurrentPage } from '../services/surveys'
import { useCurrentUser } from '@context/userContext'

////open, publish, freezeGame
function useSurveyQuery(eventId, idSurvey, isResetingSurvey) {
  const currentUser = useCurrentUser()
  const [query, setQuery] = useState({ loading: true, error: false, data: undefined })
  const [innerQuery, setInnerQuery] = useState(undefined)
  const [innerRealTimeQuery, setInnerRealTimeQuery] = useState(undefined)

  async function getUserCurrentSurveyPage(idSurvey, userId) {
    let currentPageNo = 0
    if (idSurvey && userId) {
      currentPageNo = await getCurrentPage(idSurvey, userId)
    }
    return currentPageNo
  }

  //Mixing realtime and notreal time into one to be exposed
  useEffect(() => {
    if (innerQuery === undefined || innerRealTimeQuery === undefined) return
    console.log('prueba que no carga tanto')
    setQuery((prev) => {
      /**
       * NOTE: Normally in Firebase the next data were saved, but now all the
       *       survey data is saved. Then, IDK if you have to remove some data
       *       like questions to avoid crash the answering flow idk. Anyway,
       *       the normally saved data:
       * - name, allow_anonymous_answers, allow_gradable_survey, hasMinimumScore,
       *   isGlobal, showNoVotos, time_limit, freezeGame, isOpened, isPublished,
       *   rankingVisible, displayGraphsInSurveys, minimumScore, activity_id,
       *   tries, random_survey, random_survey_count
       *
       *       Maybe, we have to remove .questions of `innerRealTimeQuery` before
       *       of insertion.
       */

      return {
        ...prev,
        loading: false,
        data: {
          ...innerQuery,
          ...innerRealTimeQuery,
        },
      }
    })
  }, [innerQuery, innerRealTimeQuery])

  //no realtime Query
  useEffect(() => {
    if (!eventId) return
    if (!idSurvey) return
    if (!currentUser.value?._id) return
    const innerAsyncCall = async () => {
      const loadedSurvey = await loadSelectedSurvey(
        eventId,
        idSurvey,
        currentUser.value._id,
      )
      loadedSurvey.currentPage = await getUserCurrentSurveyPage(
        idSurvey,
        currentUser.value._id,
      )
      setInnerQuery(loadedSurvey)
    }
    innerAsyncCall()
  }, [idSurvey, eventId, currentUser.value, isResetingSurvey])

  //realtime Query
  useEffect(() => {
    if (!idSurvey) return
    function handleRealTimeCallback(surveyStatus) {
      setInnerRealTimeQuery(surveyStatus)
    }
    const unsuscribe = initRealTimeSurveyListening(idSurvey, handleRealTimeCallback)
    return () => {
      if (unsuscribe) unsuscribe()
    }
  }, [idSurvey])

  return query
}

export default useSurveyQuery
