import { firestore } from "@/helpers/firebase";

export default function useRequestQuizStatus(userId: string, surveyId: string) {
  const firebaseRef = firestore
    .collection('votingStatusByUser')
    .doc(userId)
    .collection('surveyStatus')
    .doc(surveyId);
  return {
    ref: firebaseRef,
    getMethod: () => firebaseRef.get(),
  }
}
