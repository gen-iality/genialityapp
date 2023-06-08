import { useState, useEffect } from 'react'

import RankingList from './rankingList'
import RankingMyScore from './rankingMyScore'
import { FB } from '@helpers/firestore-request'

export default function RankingTrivia({ currentSurvey, currentUser }) {
  const [ranking, setRanking] = useState([])
  const [myScore, setMyScore] = useState({ name: '', score: 0 })

  useEffect(() => {
    const initialValues = {
      name: currentUser.names ? currentUser.names : currentUser.name,
      score: 0,
    }

    FB.Surveys.Ranking.ref(currentSurvey._id, currentUser._id).onSnapshot(function (
      result,
    ) {
      if (result?.exists) {
        const data = result.data()
        setMyScore({ ...initialValues, score: data.correctAnswers })
      } else {
        setMyScore(initialValues)
      }
    })
  }, [currentUser, currentSurvey])

  useEffect(() => {
    FB.Surveys.Ranking.collection(currentSurvey._id).onSnapshot(function (result) {
      if (result) {
        const players = []
        const data = result.docs
        data.forEach((player) => {
          const result = player.data()
          players.push({
            name: result.userName,
            score: result.correctAnswers,
          })
        })

        players.sort(function (a, b) {
          return b.score - a.score
        })

        setRanking(players)
      }
    })
  }, [currentSurvey])

  return (
    <>
      <RankingMyScore myScore={myScore} />
      <RankingList data={ranking} />
    </>
  )
}
