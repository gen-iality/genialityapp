/**
 * This module defines some function to do request to firestore, instead to use
 * firestore directly.
 */

import { firestore } from '@helpers/firebase'

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
  edit: async (eventId: string, data: any) => {
    return await firestore.collection('events').doc(eventId).set(data)
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
    edit: async (surveyId: string, rankingId: string, data: any) => {
      await firestore
        .collection('surveys')
        .doc(surveyId)
        .collection('ranking')
        .doc(rankingId)
        .set(data)
    }
  },
}

export const FB = {
  Attendees,
  Activities,
  Events,
  Surveys,
}
