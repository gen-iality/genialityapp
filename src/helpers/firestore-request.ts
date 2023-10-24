/**
 * This module defines some function to do request to firestore, instead to use
 * firestore directly.
 */

import { firestore } from '@helpers/firebase'
import { DocumentData, SetOptions, doc } from 'firebase/firestore'

const Attendees = {
  collection: (activityId: string) => {
    return firestore.collection(`${activityId}_event_attendees`)
  },
  collections: async (activityId: string) => {
    return await Attendees.collection(activityId).get()
  },
  ref: (activityId: string, eventUserId: string) => {
    return Attendees.collection(activityId).doc(eventUserId)
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
  get: async (activityId: string, eventUserId: string, injectActivityId?: boolean) => {
    const document = await firestore
      .collection(`${activityId}_event_attendees`)
      .doc(eventUserId)
      .get()
    if (!document.exists) return

    if (injectActivityId) {
      return {
        ...document.data(),
        activityId,
        activity_id: activityId,
      }
    }
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
  getEventUserActivities: async (
    activityIds: string[],
    eventUserId: string,
    injectActivityId?: boolean,
  ) => {
    const ps = activityIds.map(async (activityId) =>
      Attendees.get(activityId, eventUserId, injectActivityId),
    )
    return await Promise.all(ps)
  },
}

const Activities = {
  collection: (eventId: string) => {
    return firestore.collection('events').doc(eventId).collection('activities')
  },
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
  update: async (eventId: string, activityId: string, data: any) => {
    await Activities.ref(eventId, activityId).update(data)
  },
  edit: async (eventId: string, activityId: string, data: any, options: SetOptions) => {
    await Activities.ref(eventId, activityId).set(data, options)
  },
  /**
   * Delete an event activity.
   * @param eventId Event ID.
   * @param activityId Activity ID.
   */
  delete: async (eventId: string, activityId: string) => {
    await Activities.ref(eventId, activityId).delete()
  },
}

const Events = {
  ref: (eventId: string) => {
    const documentRef = firestore.collection('events').doc(eventId)
    return documentRef
  },
  get: async (eventId: string) => {
    return await firestore.collection('events').doc(eventId).get()
  },
  update: async (eventId: string, data: any) => {
    return await firestore.collection('events').doc(eventId).update(data)
  },
  edit: async (eventId: string, data: any, options: SetOptions) => {
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
  delete: async (surveyId: string) => {
    await firestore.collection('surveys').doc(surveyId).delete()
  },
  edit: async (surveyId: string, data: any, options: SetOptions) => {
    await firestore.collection('surveys').doc(surveyId).set(data, options)
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
    edit: async (surveyId: string, rankingId: string, data: any, options: SetOptions) => {
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
      ref: (surveyId: string, answerId: string, questionId: string) => {
        return Surveys.Answers.Responses.collection(surveyId, answerId).doc(questionId)
      },
      get: async (surveyId: string, answerId: string, questionId: string) => {
        const document = await Surveys.Answers.Responses.ref(
          surveyId,
          answerId,
          questionId,
        ).get()
        if (!document.exists) return
        return document.data()
      },
      delete: async (surveyId: string, answerId: string, questionId: string) => {
        await Surveys.Answers.Responses.ref(surveyId, answerId, questionId).delete()
      },
      edit: async (
        surveyId: string,
        answerId: string,
        questionId: string,
        data: any,
        options: SetOptions,
      ) => {
        return Surveys.Answers.Responses.ref(surveyId, answerId, questionId).set(
          data,
          options,
        )
      },
      add: async (surveyId: string, answerId: string, data: any) => {
        return Surveys.Answers.Responses.collection(surveyId, answerId).add(data)
      },
      getAll: async (surveyId: string, answerId: string, rawMode?: boolean) => {
        const documents = await firestore
          .collection('surveys')
          .doc(surveyId)
          .collection('answers')
          .doc(answerId)
          .collection('responses')
          .get()
        if (rawMode) return documents
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
    edit: async (userId: string, surveyId: string, data: any, options: SetOptions) => {
      return await VotingStatus.SurveyStatus.ref(userId, surveyId).set(data, options)
    },
  },
}

const Connections = {
  collection: () => firestore.collection('connections'),
  delete: async (id: string) => {
    return await Connections.collection().doc(id).delete()
  },
  getAllByEmail: async (email: string, rawMode?: boolean) => {
    const documents = await Configs.collection().where('email', '==', email).get()
    if (rawMode) return documents
    const documentData: DocumentData[] = []
    documents.forEach((doc) => {
      documentData.push(doc.data())
    })
    return documentData
  },
}

const Configs = {
  collection: () => firestore.collection('config'),
  ref: (id: string) => Configs.collection().doc(id),
  get: async (id: string) => {
    const document = await Configs.ref(id).get()
    if (!document.exists) return
    return document.data()
  },
  edit: async (id: string, data: any, options: SetOptions) => {
    return await Configs.ref(id).set(data, options)
  },
}

const Hosts = {
  collection: () => firestore.collection('host'),
  ref: (hostId: string) => Hosts.collection().doc(hostId),
  update: async (hostId: string, data: any) => {
    return await Hosts.ref(hostId).update(data)
  },
}

export type ActivityProgressesData = {
  activities: string[]
  filtered_activities: string[]
  viewed_activities: string[]
}

/**
 * Lets you to save the user's activity progress. Uses the collection `events`.
 *
 * @deprecated will be removed because the progress is stored in the attendee of the event
 */
const ActivityProgresses = {
  /** @deprecated will be removed */
  name: 'activityProgresses',
  /**
   * Gets the Firebase collection reference from the provided event ID.
   * @param eventId The event ID.
   * @returns A Firebase collection reference object.
   *
   * @deprecated will be removed
   */
  collection: (eventId: string) => {
    if (typeof eventId === 'undefined') throw new Error(`eventId cannot be ${eventId}`)
    return Events.ref(eventId).collection(ActivityProgresses.name)
  },
  /**
   * Gets the activity progresses document reference.
   * @param eventId The event ID.
   * @param userId The user ID.
   * @returns A Firebase document reference object,
   *
   * @deprecated will be removed
   */
  ref: (eventId: string, userId: string) => {
    if (typeof eventId === 'undefined') throw new Error(`eventId cannot be ${eventId}`)
    if (typeof userId === 'undefined') throw new Error(`userId cannot be ${userId}`)
    return ActivityProgresses.collection(eventId).doc(userId)
  },
  /**
   * Gets an activity progresses document data. If there is no data, then
   * undefined is returned.
   *
   * @param eventId The event ID.
   * @param userId The user ID.
   * @returns An exactly document data.
   *
   * @deprecated will be removed
   */
  get: async (eventId: string, userId: string) => {
    const documentRef = ActivityProgresses.ref(eventId, userId)
    const document = await documentRef.get()
    if (!document.exists) return
    return document.data() as ActivityProgressesData
  },
  /**
   * Updates an activity progresses document.
   * @param eventId The event ID.
   * @param userId The user ID.
   * @param data Any data to update.
   *
   * @deprecated will be removed
   */
  update: async (eventId: string, userId: string, data: ActivityProgressesData) => {
    await ActivityProgresses.ref(eventId, userId).update(data)
  },
  /**
   * Edits an activity progresses document.
   * @param eventId The event ID.
   * @param userId The user ID.
   * @param data Any data to edit.
   * @param options Firebase options for the editing process.
   *
   * @deprecated will be removed
   */
  edit: async (
    eventId: string,
    userId: string,
    data: ActivityProgressesData,
    options?: SetOptions,
  ) => {
    await ActivityProgresses.ref(eventId, userId).set(data, options || {})
  },
  /**
   * Reset the attendees register.
   * @param eventId The event ID.
   * @param userId The user ID.
   *
   * @deprecated use `resetViewedActivities` instead
   */
  resetAttendees: async (eventId: string, userId: string) => {
    const data = { checked_in_activities: [] } as any as ActivityProgressesData
    await ActivityProgresses.edit(eventId, userId, data, { merge: true })
  },
  resetViewedActivities: async (eventId: string, userId: string) => {
    const data = { viewed_activities: [] } as any as ActivityProgressesData
    await ActivityProgresses.edit(eventId, userId, data, { merge: true })
  },
}

export const FB = {
  Attendees,
  Activities,
  Events,
  Surveys,
  VotingStatus,
  Connections,
  Configs,
  Hosts,
  ActivityProgresses,
}
