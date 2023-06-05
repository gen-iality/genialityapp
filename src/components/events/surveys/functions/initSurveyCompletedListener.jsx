import { FB } from '@helpers/firestore-request'

async function InitSurveysCompletedListener(currentUser, dispatch) {
  const userId = currentUser.value._id

  const firebaseRef = FB.VotingStatus.SurveyStatus.collection(userId)

  const unSuscribe = firebaseRef.onSnapshot((snapShot) => {
    const surveysCompleted = {}
    snapShot.forEach((data) => {
      if (data.data()) {
        surveysCompleted[data.id] = data.data()
      }
    })

    dispatch({ type: 'current_Survey_Status', payload: surveysCompleted })
  })

  return unSuscribe
}

export default InitSurveysCompletedListener
