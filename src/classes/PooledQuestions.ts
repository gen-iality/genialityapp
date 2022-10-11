import { getQuestionsRef } from "@components/events/surveys/services/surveys";

export default class PooledQuestions {
  public pooled: any[];

  constructor(partedQuestions: any[]) {
    console.debug('PooledQuestions.new');
    this.pooled = partedQuestions;
  }

  /**
   * Requests the questions in the surveys document by IDs.
   * @param surveyId The survey ID.
   * @param userId The user ID.
   * @returns A PooledQuestions object.
   */
  static async fromFirebase(surveyId: string, userId: string) {
    console.debug('PooledQuestions.fromFirebase', `surveyId: ${surveyId}, userId: ${userId}`);

    // Get the questions reference
    const questionsRef = getQuestionsRef(surveyId, userId);

    // Get data
    const result = await questionsRef.get();

    // Load if it exists
    let document: any = {};
    if (result.exists) {
      const data = result.data();
      if (data) document = data;      
    }

    // Now create the objet
    return new PooledQuestions(document.pooled);
  }
}