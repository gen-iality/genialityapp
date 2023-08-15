import { utils, writeFileXLSX } from 'xlsx'

type SurveyType = any
type QuestionMap<QuestionId extends string> = { [key in QuestionId]: string }

export default function useExportAsXLSX(
  dataSource: any[],
  survey: SurveyType,
  questions: any[],
) {
  // In this map we have { [key as QuestionId]: QuestionTitle }
  const questionMap: QuestionMap<string> = {
    ...Object.fromEntries(questions.map((question) => [question.id, question.title])),
  }
  return () => {
    const ws = utils.json_to_sheet(
      dataSource.map((data) => {
        const entries = Object.entries(data) // [key, value][]
        const newEntries = entries.map((entry) => {
          const [key, value] = entry

          if (key in questionMap) {
            return [questionMap[key], value]
          }

          // Some keys are taken as they are
          return [key, value]
        })

        return Object.fromEntries(newEntries)
      }),
    )
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Evaluaciones')
    writeFileXLSX(wb, `survey_${survey?.survey ?? 'cuestionario'}.xls`)
  }
}
