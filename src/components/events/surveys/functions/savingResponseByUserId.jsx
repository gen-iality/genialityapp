import { parseStringBoolean } from '@/Utilities/parseStringBoolean';
import SurveyAnswers from '../services/surveyAnswersService';

function SavingResponseByUserId(surveyData, question, infoUser, eventUsers, voteWeight, infoOptionQuestion) {
   SurveyAnswers.registerWithUID(
      surveyData._id,
      question.id,
      {
         responseData: question.value,
         date: new Date(),
         uid: infoUser.value._id,
         email: infoUser.value.email,
         names: infoUser.value.names || infoUser.value.displayName,
         voteValue: parseStringBoolean(surveyData.allow_vote_value_per_user) && eventUsers.length > 0 && voteWeight,
      },
      infoOptionQuestion
   );
}

export default SavingResponseByUserId;
