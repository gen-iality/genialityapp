/*eslint-disable */
/*eslint eqeqeq:0*/
importScripts("https://www.gstatic.com/firebasejs/8.7.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.7.1/firebase-database.js");
const config = {
    apiKey: "AIzaSyATmdx489awEXPhT8dhTv4eQzX3JW308vc",
    authDomain: "eviusauth.firebaseapp.com",
    databaseURL: "https://eviusauth.firebaseio.com",
    projectId: "eviusauth",
    storageBucket: "eviusauth.appspot.com",
    messagingSenderId: "400499146867",
};
firebase.initializeApp(config);
var realTime = firebase.database();

addEventListener('message', e => {
let data = e.data
const realTimeRef = realTime.ref(`surveys/${data.surveyId}/answer_count/${data.questionId}`);

for (let insertions = 0; insertions < 200; insertions++) {
realTimeRef.transaction((questionAnswerCount) => {
   if (questionAnswerCount) {
      questionAnswerCount[data.optionIndex] += data.vote;
   }
   return questionAnswerCount;
});
}
});



/*eslint-enable */