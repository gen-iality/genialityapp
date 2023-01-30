import { parseStringBoolean } from '@/Utilities/parseStringBoolean';
import SurveyAnswers from '../services/surveyAnswersService';

function SavingResponseByUserId(surveyData: any, question: any, infoUser: any, eventUsers: any, voteWeight: string | number, infoOptionQuestion: any) {
   console.log('test:SavingResponseByUserId -> voteWeight', voteWeight)
   console.log('test:SavingResponseByUserId -> voteWeight', typeof voteWeight)
   SurveyAnswers.registerWithUID(
      surveyData._id,
      question.id,
      {
         responseData: question.value,
         date: new Date(),
         uid: infoUser.value._id,
         email: infoUser.value.email,
         names: infoUser.value.names || infoUser.value.displayName,
         voteWeight,
      },
      infoOptionQuestion
   );
}

export default SavingResponseByUserId;
