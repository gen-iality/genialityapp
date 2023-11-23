import { Modal, Button } from 'antd';
import { useMillonaireCMS } from '../hooks/useMillonaireCMS';
import AnswersFours from './AnswersFours';


export default function CreateAnswers() {
  const {
    isEditQuestion,
    answers,
    loading,
    isVisibleModalAnswer,
    onChangeVisibleModalAnswer,
    onSubmitAnswer,
  } = useMillonaireCMS();

  return (
    <>
      <Button onClick={() => onChangeVisibleModalAnswer()}> Respuestas</Button>
      <Modal
        visible={isVisibleModalAnswer}
        maskClosable={false}
        onCancel={() => onChangeVisibleModalAnswer()}
        destroyOnClose={true}
        footer={[
          <Button
            disabled={
              // answer.answer === '' ||
              // answer.type === '' ||
              // (!isEditAnswer && question.answers.length === 4) ||
              // (question.answers.length === 3 &&
              //   !question.answers.find((answer) => answer.isCorrect === true) &&
              //   answer.isCorrect === false) ||
              answers.find((answer) => answer.answer === '') !== undefined ||
              answers.every((answer) => answer.isCorrect === false) ||
              loading
            }
            onClick={() => onSubmitAnswer()}
            loading={loading}>
            {isEditQuestion ? 'Actualizar' : 'Crear'}
          </Button>,
        ]}>
        <AnswersFours />
      </Modal>
    </>
  );
}
