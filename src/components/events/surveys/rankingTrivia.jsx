import { useEffect } from 'react'
import { firestore } from '@helpers/firebase'
import RankingList from './rankingList'
import RankingMyScore from './rankingMyScore'
import { Divider } from 'antd'
import { useSurveysContext } from '@context/surveysContext'
import { useCurrentUser } from '@context/userContext'
import { useHelper } from '@context/helperContext/hooks/useHelper'
import { useEventContext } from '@context/eventContext'
import { FB } from '@helpers/firestore-request'

function RankingTrivia() {
  const { setGameRanking, setMyScore } = useHelper()
  const cSurveys = useSurveysContext()
  const cUser = useCurrentUser()
  const eventContext = useEventContext()
  const currentSurvey = cSurveys.currentSurvey
  const currentUser = cUser.value
  const currentEvent = eventContext.value

  useEffect(() => {
    let unsubscribe
    if (!(Object.keys(currentUser).length === 0)) {
      if (!currentSurvey) return
      unsubscribe = FB.Surveys.Ranking.collection(currentSurvey._id)
        .orderBy('timeSpent', 'asc')
        // .limit(10)
        .onSnapshot(async (querySnapshot) => {
          const puntajes = []
          const newPuntajes = await Promise.all(
            querySnapshot.docs.map(async (doc) => {
              const result = doc.data()
              let picture
              if (result?.userId) {
                picture = await getDataUser(result?.userId)
              }
              result['score'] = result.correctAnswers
              result['name'] = result.userName
              result['imageProfile'] = picture
              return result
            }),
          )
          puntajes.push(...newPuntajes)

          /** Puntaje de todos los participantes */
          // /** Ordenamos por puntaje */
          const orderScoresByScore = puntajes.sort(function (a, b) {
            return b.correctAnswers - a.correctAnswers
          })

          // /** Agregamos la posición correspondiente */
          const positionScoresByScore = orderScoresByScore.map((item, index) => {
            return { ...item, index: index + 1 }
          })
          setGameRanking(positionScoresByScore.slice(0, 10))

          /** Puntaje individual */
          const cUserId = cUser.value?._id
          const filterForRankingUserId = positionScoresByScore.filter(
            (rankingUsers) => rankingUsers.userId === cUserId,
          )

          if (filterForRankingUserId?.length > 0) setMyScore(filterForRankingUserId)
        })
    }
    return () => {
      unsubscribe()
      setMyScore([{ name: '', score: 0 }])
      setGameRanking([])
    }
  }, [currentSurvey, currentUser])

  const getDataUser = async (iduser) => {
    const user = await firestore
      .collection(`${currentEvent._id}_event_attendees`)
      .where('account_id', '==', iduser)
      .get()

    if (user.docs.length > 0 && user.docs[0].data()) {
      const userPicture = user.docs[0].data().user?.picture
      /** Se filtra para las imagenes que llegan con esta ruta './scripts/img/' en cambio de una Url  https://*/
      const userPictureFiltered = userPicture?.includes('./scripts/img/')
        ? null
        : userPicture
      return userPictureFiltered
    }
    return undefined
  }

  return (
    <>
      {!(Object.keys(currentUser).length === 0) && (
        <>
          <RankingMyScore />
          <Divider />
          <RankingList />
        </>
      )}
    </>
  )
}

export default RankingTrivia
