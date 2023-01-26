import { SurveysApi } from "@/helpers/request"

export const getAllSurveys = async (eventId: string) => {
  const response = await SurveysApi.getAll(eventId)
  console.log(response)
}