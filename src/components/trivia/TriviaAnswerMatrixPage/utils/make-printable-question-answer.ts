export default function makePrintableQuestionAnswer(answer: string | string[]) {
  let finalAnswer = ''

  if (typeof answer === 'string') {
    if (answer.length === 0) {
      finalAnswer = '<vacío>'
    } else {
      finalAnswer = answer
    }
  } else if (Array.isArray(answer)) {
    if ((answer as any[]).length === 0) {
      finalAnswer = '[ <vacío> ]'
    } else {
      finalAnswer = (answer as any[]).join(', ')
    }
  } else {
    finalAnswer = JSON.stringify(answer)
  }

  return finalAnswer
}
