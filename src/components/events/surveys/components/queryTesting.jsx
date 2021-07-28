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

   function insertionInTheDatabase(insertions) {
      const firebaseRef = firestore
         .collection('surveys')
         .doc('s1u2r3v4e5y6_7i8d')
         .collection('answersbyquestion')
         .doc('q1u2e3s4t5i6o7n8_9i0d')
         .collection('responses')
         .doc(`a1t2t3e4n5d6e7e8_9i0d#${insertions}`);

      firebaseRef.set({
         answer: insertions,
      });
   }

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
            ? start()
            : null;
      });

      return unSuscribe;
   }

   function start() {
      const startTime = moment(new Date());
      console.log("10. startTime ", startTime)
      setValidationStartTime(startTime);
   }

   function end() {
      const endTime = moment(new Date());
      // let timeDiff = endTime - validationStartTime; //in ms
      // // strip the ms

      // timeDiff /= 1000;
      // // get seconds
      // let seconds = Math.round(timeDiff);
      // // console.log('10. seconds ', seconds);
      console.log("10. endTime ", endTime)
      const seconds = endTime.diff(validationStartTime, 'seconds');
      console.log('10. seconds   ', seconds);
      setTotalTime(seconds);
   }

   const onFinish = (values) => {
      const { insertionNumber } = values;
      start();
      for (let insertions = 0; insertions < insertionNumber; insertions++) {
         insertionInTheDatabase(insertions + 1);
      }
   };

   useEffect(() => {
      const unSuscribe = dataBaseListener();
      start();
      return () => unSuscribe;
   }, []);

   useEffect(() => {
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
      return end();
   }, [data]);

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
                           <h1>{totalTime} Segundos</h1>
                        </Tag>
                     ) : (
                        <h1>Aun no hay tiempos</h1>
                     )}
                  </div>
               </Card>
               {/* Prueba botones para probar funciones para medir tiempo */}
               {/* <Button type='primary' onClick={start}>
                  iniciar
               </Button>
               <Button type='primary' onClick={end}>
                  detener
               </Button> */}
            </Card>
         </Col>
      </Row>
   );
}

export default QueryTesting;
