import { useState, useEffect } from 'react';
import SurveyAnswers from './services/surveyAnswersService';
import { LoadingOutlined } from '@ant-design/icons';

function ResultsPanel(props) {
  const { queryData, surveyModel, eventId, idSurvey, currentUser } = props;

  console.log('800.ResultsPanel queryData', queryData);
  console.log('800.ResultsPanel surveyModel', surveyModel);
  console.log('800.ResultsPanel eventId', eventId);
  console.log('800.ResultsPanel idSurvey', idSurvey);

  let [loading, setloading] = useState();

  let [userAnswers, setUserAnswers] = useState(undefined);
  let [dataLoaded, setDataLoaded] = useState(false);

  async function getUserAnswers(question) {
    let userAnswer = await SurveyAnswers.getAnswersQuestionV2(idSurvey, question.id, currentUser.value._id);
    return userAnswer.data();
  }

  useEffect(() => {
    console.log('800.useEffect idSurvey', idSurvey);
    console.log('800.useEffect currentUser', currentUser);

    let userAnswersLocal = {};

    if (!idSurvey || !currentUser.value._id) return;
    queryData.questions.map(async (question, index) => {
      //console.log('200.question', question);
      let userAnswer = await getUserAnswers(question);
      console.log('800.userAnswer - 1', userAnswer);

      if (userAnswer !== undefined) {
        userAnswersLocal[question.id] = userAnswer;
      }

      if (queryData.questions.length - 1 === index) {
        console.log('800.userAnswersLocal', userAnswersLocal);
        setUserAnswers(userAnswersLocal);
        setDataLoaded(true);
      }
    });
  }, [currentUser.value._id, idSurvey]);

  return (
    <>
      {userAnswers ? (
        <div style={{ display: 'block', border: '1px solid #808080', padding: '10px' }}>
          {queryData.questions.map((question, index) => {
            let questionTitle = question.title;
            let correctAnswer = question.correctAnswer;
            //let userAnswerResponse = userAnswers[index - 1].response[0];

            if (questionTitle === undefined) return;

            console.log('800.userAnswersObject - 2', userAnswers);

            return (
              <div
                style={{
                  display: 'block',
                  border: '1px solid #808080',
                  marginBottom: '10px',
                  padding: '15px',
                  borderRadius: '5px',
                }}
              >
                <p>{`${index}. ${questionTitle}`}</p>
                <p>{`Respuesta correcta: ${correctAnswer}`}</p>
                <p>{`Tu respuesta: ${userAnswers[question.id].response[0]}`}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <LoadingOutlined style={{ width: '50px', color: '#808080' }} />
      )}
    </>
  );
}

export default ResultsPanel;
