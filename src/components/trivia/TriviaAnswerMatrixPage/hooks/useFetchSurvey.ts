import { SurveysApi } from '@helpers/request'
import { useEffect, useState } from 'react'

export default function useFetchSurvey(eventId: string, surveyId: string) {
  const [surveyData, setSurveyData] = useState<any | null>(null)

  useEffect(() => {
    SurveysApi.getOne(eventId, surveyId)
      .then((surveyData) => {
        setSurveyData(surveyData)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [eventId, surveyId])

  return surveyData
}
