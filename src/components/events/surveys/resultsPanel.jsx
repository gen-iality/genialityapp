import { useState, useEffect } from 'react';
import SurveyAnswers from './services/surveyAnswersService';
import { LoadingOutlined } from '@ant-design/icons';
import useSurveyQuery from './hooks/useSurveyQuery';

function ResultsPanel(props) {
  const { eventId, idSurvey, currentUser } = props;

  const query = useSurveyQuery(eventId, idSurvey);
  console.log('800.ResultsPanel queryData', query.data);
  console.log('800.ResultsPanel idSurvey', idSurvey);

  const [userAnswers, setUserAnswers] = useState(undefined);

  async function getUserAnswers(questionId) {
    let userAnswer = await SurveyAnswers.getAnswersQuestionV2(
      idSurvey, // survey ID
      questionId, // current question
      currentUser.value._id, // who
    );
    return userAnswer.data();
  }

  useEffect(() => {
    console.log('800.useEffect idSurvey', idSurvey);
    console.log('800.useEffect currentUser', currentUser);
    console.log('800.useEffect query.data', query.data);
    if (!query.data) return;
    if (!idSurvey || !currentUser.value._id) return;

    let userAnswersLocal = [];

    (async () => {
      // For each question, search thhe user's answer and save all in userAnswersLocal
      for (let index = 0; index < query.data.questions.length; index++) {
        const question = query.data.questions[index];
        // The first question is not a real question!!
        if (!question.id) continue;
        // Search the answer
        let userAnswer = await getUserAnswers(question.id);
        console.log('800.userAnswer - 1', userAnswer);
  
        // Save the current question, and the correct answer
        if (userAnswer !== undefined) {
          userAnswersLocal.push({
            id: question.id,
            answer: userAnswer.response,
            correctAnswer: question.correctAnswer,
            title: question.title,
          });
        } else {
          console.debug('no answer found for question.id:', question.id);
        }
      }
      // Save all user's answers
      setUserAnswers(userAnswersLocal);
    })();
  }, [currentUser.value._id, idSurvey, query.data]);

  return (
    <>
      {userAnswers === undefined && (
        <>
        <p>Cargando resultados...</p>
        <LoadingOutlined style={{ width: '50px', color: '#808080' }} />
        </>
      )}
      {userAnswers !== undefined && (
        <>
        <div style={{ display: 'block', border: '1px solid #808080', padding: '10px' }}>
          {userAnswers.map((answer, index) => {
            console.log('800.userAnswersObject - 2', answer);

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
                <p>{`${index}. ${answer.title}`}</p>
                <p>{`Respuesta correcta: ${answer.correctAnswer}`}</p>
                <p>{`Tu respuesta: ${answer.answer}`}</p>
              </div>
            );
          })}
        </div>
        </>
      )}
    </>
  );
}

export default ResultsPanel;
