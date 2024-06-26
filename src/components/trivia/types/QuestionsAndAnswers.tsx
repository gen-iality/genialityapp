// import { useEffect, useState } from 'react';
// import { Input, List, Button } from 'antd';
// import { CheckCircleOutlined } from '@ant-design/icons';
// import { get, getDatabase, push, ref, set } from 'firebase/database';

// const styleList = {
//   width: '100%',
//   height: '200px',
//   overflow: 'auto',
//   marginTop: '8px',
// };

// interface Question {
//   id: string;
//   question: string;
//   counterVotes: number;
//   author: string;
// }

// interface QuestionsComponentProps {
//   questions: Question[];
//   onAddQuestion: (question: {}) => void;
//   onVoteQuestion: (id: string) => void;
//   currentUser: string;
// }

// const QuestionsAndAnswers: React.FC<QuestionsComponentProps> = ({
//   questions,
//   onAddQuestion,
//   onVoteQuestion,
//   currentUser,
// }) => {
 
//   const [newQuestion, setNewQuestion] = useState<string>('');
 
//   const handleAddQuestion = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (newQuestion.trim() !== '') {
//       const db = getDatabase();
//       const arrayQuestionsRef = ref(db, 'events/general/questions');
//       const newQuestionRef = await push(arrayQuestionsRef);
//       const newQuestionObject: Question = {
//         id: newQuestionRef.key!,
//         question: newQuestion,
//         counterVotes: 0,
//         author: currentUser,
//       };
//       await set(newQuestionRef, newQuestionObject);
//       onAddQuestion(newQuestionObject);

//       // Obtener la URL de la nueva pregunta
//       const questionSnapshot = await get(newQuestionRef);
//       if (questionSnapshot.exists()) {
//         const newQuestionURL = questionSnapshot.ref.toString();
//         console.log('Nueva pregunta almacenada en:', newQuestionURL);
//       } else {
//         console.log('No se pudo obtener la URL de la nueva pregunta.');
//       }

//       setNewQuestion('');
//       console.log('se almacenó 🌞');
//     }
//   };

  

//   return (
//     <div>
//       <h3>Preguntas de los asistentes</h3>
//       <form onSubmit={handleAddQuestion}>
//         <Input
//           placeholder='Haz una pregunta'
//           value={newQuestion}
//           onChange={(e) => setNewQuestion(e.target.value)}
//           style={{ marginBottom: '10px' }}
//         />
//         <Button type='primary' onClick={handleAddQuestion} disabled={!newQuestion.trim()}>
//           Añadir Pregunta
//         </Button>
//       </form>
//       <List
//         dataSource={questions}
//         renderItem={(item) => (
//           <List.Item>
//             <List.Item.Meta title={item.question} />
//             <p>{item.author}</p>
//             <CheckCircleOutlined onClick={() => onVoteQuestion(item.id)} />
//             <p>Contador:{item.counterVotes}</p>
//           </List.Item>
//         )}
//         style={styleList}
//       />
//     </div>
//   );
// };

// export default QuestionsAndAnswers;
