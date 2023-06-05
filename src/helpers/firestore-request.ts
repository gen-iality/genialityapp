/**
 * This module defines some function to do request to firestore, instead to use
 * firestore directly.
 */

import { firestore } from '@helpers/firebase'
import { DocumentData } from 'firebase/firestore'

const Attendees = {
  collection: (activityId: string) => {
    return firestore.collection(`${activityId}_event_attendees`)
  },
  collections: async (activityId: string) => {
    return await Attendees.collection(activityId).get()
  },
  docs: async (activityId: string) => {
    return (await Attendees.collections(activityId)).docs
  },
  /**
   * Get an attendee.
   * @param activityId Activity ID.
   * @param eventUserId Event user ID.
   * @returns An attendee.
   */
  get: async (activityId: string, eventUserId: string) => {
    const document = await firestore
      .collection(`${activityId}_event_attendees`)
      .doc(eventUserId)
      .get()
    if (!document.exists) return
    return document.data()
  },
  /**
   * Delete an attendee of event user for an activity.
   * @param activityId Activity ID.
   * @param eventUserId Event user ID.
   */
  delete: async (activityId: string, eventUserId: string) => {
    await firestore.collection(`${activityId}_event_attendees`).doc(eventUserId).delete()
  },
  getEventUserActivities: async (activityIds: string[], eventUserId: string) => {
    const ps = activityIds.map(async (activityId) =>
      Attendees.get(activityId, eventUserId),
    )
    return await Promise.all(ps)
  },
}

const Activities = {
  ref: (eventId: string, activityId: string) => {
    const documentRef = firestore
      .collection('events')
      .doc(eventId)
      .collection('activities')
      .doc(activityId)
    return documentRef
  },
  /**
   * Get an event activity.
   * @param eventId Event ID.
   * @param activityId Activity ID.
   * @returns An activity document.
   */
  get: async (eventId: string, activityId: string) => {
    const documentRef = Activities.ref(eventId, activityId)
    const document = await documentRef.get()
    if (!document.exists) return
    return document.data()
  },
  /**
   * Delete an event activity.
   * @param eventId Event ID.
   * @param activityId Activity ID.
   */
  delete: async (eventId: string, activityId: string) => {
    await firestore
      .collection('events')
      .doc(eventId)
      .collection('activities')
      .doc(activityId)
      .delete()
  },
}

const Events = {
  ref: (eventId: string) => {
    const documentRef = firestore.collection('events').doc(eventId)
    return documentRef
  },
  get: async (eventId: string) => {
    return await firestore.collection('events').doc(eventId)
  },
  update: async (eventId: string, data: any) => {
    return await firestore.collection('events').doc(eventId).update(data)
  },
  edit: async (eventId: string, data: any, options?: any) => {
    return await firestore.collection('events').doc(eventId).set(data, options)
  },
}

const Surveys = {
  /**
   * Returns the whole survey collection.
   * @returns Survey collection.
   */
  collection: () => {
    return firestore.collection('surveys')
  },
  ref: (surveyId: string) => {
    const documentRef = firestore.collection('surveys').doc(surveyId)
    return documentRef
  },
  get: async (surveyId: string) => {
    const document = await Surveys.ref(surveyId).get()
    if (!document.exists) return
    return document.data()
  },
  /**
   * Update the survey.
   * @param surveyId Survey ID.
   * @param data Data to save.
   */
  update: async (surveyId: string, data: any) => {
    await firestore.collection('surveys').doc(surveyId).update(data)
  },
  edit: async (surveyId: string, data: any) => {
    await firestore.collection('surveys').doc(surveyId).set(data)
  },
  Ranking: {
    collection: (surveyId: string) => {
      return Surveys.ref(surveyId).collection('ranking')
    },
    ref: (surveyId: string, rankingId: string) => {
      return firestore
        .collection('surveys')
        .doc(surveyId)
        .collection('ranking')
        .doc(rankingId)
    },
    get: async (surveyId: string, rankingId: string) => {
      const document = await firestore
        .collection('surveys')
        .doc(surveyId)
        .collection('ranking')
        .doc(rankingId)
        .get()
      if (!document.exists) return
      return document.data()
    },
    edit: async (surveyId: string, rankingId: string, data: any, options?: any) => {
      await firestore
        .collection('surveys')
        .doc(surveyId)
        .collection('ranking')
        .doc(rankingId)
        .set(data, options)
    },
  },
  Answers: {
    collection: (surveyId: string) => {
      return Surveys.ref(surveyId).collection('answers')
    },
    ref: (surveyId: string, answerId: string) => {
      return Surveys.Answers.collection(surveyId).doc(answerId)
    },
    Responses: {
      collection: (surveyId: string, answerId: string) => {
        return Surveys.Answers.ref(surveyId, answerId).collection('responses')
      },
      getAll: async (surveyId: string, answerId: string) => {
        const documents = await firestore
          .collection('surveys')
          .doc(surveyId)
          .collection('answers')
          .doc(answerId)
          .collection('responses')
          .get()
        const documentData: DocumentData[] = []
        documents.forEach((doc) => {
          documentData.push(doc.data())
        })
        return documentData
      },
    },
  },
}

const VotingStatus = {
  collection: () => {
    return firestore.collection('votingStatusByUser')
  },
  ref: (userId: string) => {
    return VotingStatus.collection().doc(userId)
  },
  SurveyStatus: {
    collection: (userId: string) => {
      return VotingStatus.ref(userId).collection('surveyStatus')
    },
    ref: (userId: string, surveyId: string) => {
      return VotingStatus.SurveyStatus.collection(userId).doc(surveyId)
    },
    get: async (userId: string, surveyId: string) => {
      const document = await VotingStatus.SurveyStatus.ref(userId, surveyId).get()
      if (!document.exists) return
      return document.data()
    },
    edit: async (userId: string, surveyId: string, data: any, options?: any) => {
      return await VotingStatus.SurveyStatus.ref(userId, surveyId).set(data, options)
    },
  },
}

export const FB = {
  Attendees,
  Activities,
  Events,
  Surveys,
  VotingStatus,
}
