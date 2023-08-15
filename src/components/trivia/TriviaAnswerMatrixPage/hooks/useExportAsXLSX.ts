import { utils, writeFileXLSX } from 'xlsx'

type SurveyType = any
type QuestionMap<QuestionId extends string> = { [key in QuestionId]: string }
type QuestionLike = { id: string; title: string; [key: string]: any }

export default function useExportAsXLSX(
  dataSource: any[],
  survey: SurveyType,
  questions: QuestionLike[],
) {
  const questionInfoIdList = questions.map((question) => [question.id, question.title])

  // In this map we have { [key as QuestionId]: QuestionTitle }
  const questionMap: QuestionMap<string> = {
    ...Object.fromEntries(questionInfoIdList),
  }
  return () => {
    // The right order of the question IDs
    const orderedQuestionId = questionInfoIdList.map(
      (questionInfoId) => questionInfoId[0],
    )
    // Add the header
    const headerTableAsArray = questionInfoIdList.map(
      (questionInfoId) => questionInfoId[1],
    )

    // Add the body
    const bodyTableAsArray = dataSource.map((data) => {
      const normalValues = Object.entries(data)
        .filter(([key, value]) => !orderedQuestionId.includes(key))
        .map(([key, value]) => value)
      return [...normalValues, ...orderedQuestionId.map((questionId) => data[questionId])]
    })

    // This lines has burnt header: "names"
    const tableAsArray = [
      ['Nombre de usuario', 'Puntos', 'Intentos', ...headerTableAsArray],
      ...bodyTableAsArray,
    ]

    const ws = utils.aoa_to_sheet(tableAsArray)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Evaluaciones')
    writeFileXLSX(wb, `survey_${survey?.survey ?? 'cuestionario'}.xls`)
  }
}
