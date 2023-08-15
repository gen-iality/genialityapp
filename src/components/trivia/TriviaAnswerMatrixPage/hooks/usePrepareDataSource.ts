import { useEffect, useState } from 'react'
import { UserAnswersPair } from '../types'

export default function usePrepareDataSource(userAnswersPairs: UserAnswersPair[]) {
  const [dataSource, setDataSource] = useState<any[]>([])

  useEffect(() => {
    const userIds: string[] = []
    userAnswersPairs
      .map((uap) => uap.userId)
      .forEach((userId) => {
        if (!userIds.includes(userId)) {
          userIds.push(userId)
        }
      })
    // console.log(userIds.length, 'user ids loaded')

    const allData: any[] = []
    userIds.forEach((userId) => {
      const itsData = userAnswersPairs.filter((uap) => uap.userId === userId)

      const newData: any = {}

      itsData.map((row) => {
        newData.names = row.username

        let answer = ''
        if (typeof row.answer === 'string') {
          if (row.answer.length === 0) {
            answer = '<vacío>'
          } else {
            answer = row.answer
          }
        } else {
          answer = JSON.stringify(row.answer)
        }
        newData[row.questionId] = answer
      })

      allData.push(newData)
    })
    setDataSource(allData)
  }, [userAnswersPairs])

  return dataSource
}
