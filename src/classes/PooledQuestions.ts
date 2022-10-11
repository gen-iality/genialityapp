import { SurveyQuestion } from "@components/events/surveys/models/types";
import { getQuestionsRef } from "@components/events/surveys/services/surveys";

export default class PooledQuestions {
  #userId?: string;
  #surveyId?: string;
  public pooled: SurveyQuestion[];

  constructor(partedQuestions: any[], userId?: string, surveyId?: string) {
    console.debug('PooledQuestions.new');
    this.#userId = userId;
    this.#surveyId = surveyId;
    this.pooled = partedQuestions;
  }

  /**
   * Returns true if all IDs is defined.
   * @returns true if IDS are defined.
   */
  private checkIDs() {
    if (!this.#userId) {
      console.error('PooledQuestions.checkIDs:', 'userId is invalid', this.#userId);
      return false;
    }
    if (!this.#surveyId) {
      console.error('PooledQuestions.checkIDs:', 'surveyId is invalid', this.#surveyId);
      return false;
    }
    return true;
  }

  setUserId(userId: string) { this.#userId = userId; return this; }
  setSurveyId(surveyId: string) { this.#surveyId = surveyId; return this; }

  /**
   * Pull data.
   * @returns PooledQuestions updated.
   */
  async pull() {
    console.debug('PooledQuestions.pull');

    if (!this.checkIDs()) return this;

    // Get the questions reference
    const questionsRef = getQuestionsRef(this.#surveyId!, this.#userId!);

    // Get data
    const result = await questionsRef.get();

    // Load if it exists
    let document: any = {};
    if (result.exists) {
      const data = result.data();
      if (data) document = data;      
    }

    // Update
    this.pooled = document.pooled as any[];
  }

  async push() {
    console.debug('PooledQuestions.push');

    if (!this.checkIDs()) return this;

    // Get the questions reference
    const questionsRef = getQuestionsRef(this.#surveyId!, this.#userId!);

    // Set data
    await questionsRef.set(this, { merge: false });

    return this;
  }

  /**
   * Requests the questions in the surveys document by IDs.
   * @param surveyId The survey ID.
   * @param userId The user ID.
   * @returns A PooledQuestions object.
   */
  static async fromFirebase(surveyId: string, userId: string) {
    console.debug('PooledQuestions.fromFirebase', `surveyId: ${surveyId}, userId: ${userId}`);
    const pooledQuestions = new PooledQuestions([], userId, surveyId);
    await pooledQuestions.pull();
    return pooledQuestions;
  }
}