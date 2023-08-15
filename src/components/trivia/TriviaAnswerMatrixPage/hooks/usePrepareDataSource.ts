import { useEffect, useState } from 'react'
import { UserAnswersPair } from '../types'
import convertAnswer from '../utils/convert-answer'

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

        newData[row.questionId] = convertAnswer(row.answer)
      })

      allData.push(newData)
    })
    setDataSource(allData)
  }, [userAnswersPairs])

  return dataSource
}
