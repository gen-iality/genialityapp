import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button, InputNumber, Card, Tag } from 'antd';
import { firestore } from '../../../../helpers/firebase';
import moment from 'moment';

function QueryTesting() {
   /** Ruta para escritura y lectura de respuestas en firebase */
   /** /surveys/survey_id/answersbyquestion/question_id/responses/attendee_id */
   /** /surveys/survey_id/answersbyattendee/attendee_id/responses/question_id */
   /** /surveys/s1u2r3v4e5y6_7i8d/answersbyquestion/q1u2e3s4t5i6o7n8_9i0d/responses */
   const [data, setData] = useState(null);
   const [totalAveragedata, setTotalAverageData] = useState(null);
   const [totalTime, setTotalTime] = useState(null);
   const [validationStartTime, setValidationStartTime] = useState();

   /** Ingreso de datos a la DB */
   function insertionInTheDatabase(insertions) {
      const firebaseRef = firestore
         .collection('surveys')
         .doc('s1u2r3v4e5y6_7i8d')
         .collection('answersbyquestion')
         .doc('q1u2e3s4t5i6o7n8_9i0d')
         .collection('responses');

      firebaseRef.add({
         answer: insertions,
      });
   }

   /** Listener que permite recuperar toda la data y guardarla en un array */
   async function dataBaseListener() {
      //    console.log("10. se ejecuta el listener")
      const firebaseRef = firestore
         .collection('surveys')
         .doc('s1u2r3v4e5y6_7i8d')
         .collection('answersbyquestion')
         .doc('q1u2e3s4t5i6o7n8_9i0d')
         .collection('responses');

      const unSuscribe = firebaseRef.onSnapshot((snapShot) => {
         let dataTest = [];
         snapShot.forEach((data) => {
            if (data.data()) {
               dataTest.push(data.data());
            }
         });
         setData(dataTest);

         snapShot.docChanges().length > 0 &&
         (snapShot.docChanges()[0].type === 'modified' || snapShot.docChanges()[0].type === 'removed')
            ? startTimer()
            : null;
      });

      return unSuscribe;
   }

   /** inicia el cronometro */
   function startTimer() {
      setTotalTime(null);
      const startTimer = moment(new Date());
      // console.log("10. startTimer ", startTimer)
      setValidationStartTime(startTimer);
   }

   /** detiene el cronometro */
   function endTimer() {
      const endTime = moment(new Date());
      // console.log("10. endTime ", endTime)
      const seconds = endTime.diff(validationStartTime);
      // console.log('10. seconds   ', seconds);
      setTotalTime(seconds);
   }

   /** accion del formulario de antd que se ejecuta al hacer clic en el boton Realizar prueba */
   const onFinish = (values) => {
      const { insertionNumber } = values;
      startTimer();
      for (let insertions = 0; insertions < insertionNumber; insertions++) {
         insertionInTheDatabase(insertions + 1);
      }
   };

   /** promedio por respuestas, como las respuestas se guardan con un campo answer de tipo number aqui se promedia esa data */
   function averagePerResponses() {
      if (data && data.length > 0) {
         let average = data.reduce((sumTotal, rest) => {
            return sumTotal + rest.answer;
         }, 0);

         let totalAverage = average / data.length;
         let totalAverageTwoDecimals = Math.round(totalAverage * 100) / 100;
         setTotalAverageData(totalAverageTwoDecimals);
      } else {
         setTotalAverageData(null);
      }
   }

   /** se inicializa el listener y el cronometro, ademas se cierra el listener al salir del componente */
   useEffect(() => {
      const unSuscribe = dataBaseListener();
      startTimer();
      return () => unSuscribe;
   }, []);

   /** Se ejecuta el promedio cada que el listener cambia, ademas cuando ya no se ejecuta el efecto se detiene el contador */
   useEffect(() => {
      averagePerResponses();
      return endTimer();
   }, [data]);

   /** Prueba tansacciones desde RealTimeDatabase con worker*/
   // let variables = {
   //     surveyId, questionId, optionIndex, vote
   // }

   // const worker = new Worker('/workers/webWorkers.js');
   // worker.addEventListener('message', e => {
   //     console.log('10.', e.data);
   // });
   // worker.postMessage(variables);

   // /** inicia el cronometro para las pruebas*/
   // function startTimer() {
   //    props.setTotalTime(null);
   //    chronometerStartTime = new Date();
   //    // console.log('10. startTimer ', startTime);
   // }

   // /** detiene el cronometro para las pruebas*/
   // function endTimer() {
   //    chronometerEndTime = new Date();
   //    var timeDiff = chronometerEndTime - chronometerStartTime; //in ms
   //    // console.log('10. seconds   ', seconds);
   //    props.setTotalTime(timeDiff);
   // }

   /**para consultar en firebase firestore */
   // const shard_ref = firestore
   //    .collection('surveys')
   //    .doc(surveyData._id)
   //    .collection('answer_count')
   //    .doc(question.id);

   // shard_ref.onSnapshot((doc) => {
   //    if (doc.data()) {
   //       props.setCountRegisters(doc.data()[0]);
   //       endTimer();
   //    }
   // });

   // setInterval(()=>{
   //    props.setCountRegisters((count)=>{
   //       console.log("10. count " ,count)
   //       return ++count
   //    });
   // }, 1000)

   /** para consultas en firebase RealTime */
   // const realTimeRef = fireRealtime.ref(`surveys/${surveyData._id}/answer_count/${question.id}`);
   // console.log("render realTimeRef")
   // realTimeRef.on('value',(snapshot) => {
   //    if (snapshot) {
   //       const data = snapshot.val()
   //       if(data[0] > 100){
   //          props.setCountRegisters(data[0]);

   //       }
   //       endTimer();
   //       // console.log('10. data', data[0]);
   //    }
   // });

   // startTimer();
   /** for para pruebas de rendimiento envio de respuestas masivas en las encuestas*/
   // for (let insertions = 0; insertions < 1000; insertions++) {
   //    let currentUsers = { ...currentUser.value, _id: 'EdwinVilla1990#' + insertions };
   //    let userData = { ...currentUser, value: currentUsers };
   //    RegisterVote(surveyData, question, userData, eventUsers, voteWeight);
   // }

   return (
      <Row justify='center' align='middle' style={{ minHeight: '100vh', textAlign: 'center' }}>
         <Col>
            <Card>
               <Form name='queryTesting' initialValues={{ remember: true }} onFinish={onFinish}>
                  <Form.Item
                     label='# inserciones en la Bd'
                     name='insertionNumber'
                     rules={[{ required: true, message: 'Ingrese un número de inserciones!' }]}>
                     <InputNumber min={0} max={9999} />
                  </Form.Item>

                  <Form.Item>
                     <Button type='primary' htmlType='submit'>
                        Realizar prueba
                     </Button>
                  </Form.Item>
               </Form>
               <Card>
                  <div style={{ marginBottom: '25px' }}>
                     <h1>Total Respuestas</h1>
                     {data !== null ? (
                        <Tag color='success'>
                           <h1>{data.length}</h1>
                        </Tag>
                     ) : (
                        <h1>sin registros</h1>
                     )}
                  </div>
                  <div style={{ marginBottom: '25px' }}>
                     <h1>Promedio</h1>
                     {totalAveragedata !== null ? (
                        <Tag color='success'>
                           <h1>{totalAveragedata}</h1>
                        </Tag>
                     ) : (
                        <h1>sin registros</h1>
                     )}
                  </div>
                  <div>
                     <h1>Tiempo</h1>
                     {totalTime !== null ? (
                        <Tag color='success'>
                           <h1>{totalTime} M.Segundos</h1>
                        </Tag>
                     ) : (
                        <h1>Aun no hay tiempos</h1>
                     )}
                  </div>
               </Card>
               {/* Prueba botones para probar funciones para medir tiempo */}
               {/* <Button type='primary' onClick={startTimer}>
                  iniciar
               </Button>
               <Button type='primary' onClick={endTimer}>
                  detener
               </Button> */}
            </Card>
         </Col>
      </Row>
   );
}

export default QueryTesting;
