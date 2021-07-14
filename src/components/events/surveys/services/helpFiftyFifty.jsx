/** Componente que gestiona la Ayuda del 50/50 */
function HelpFiftyFifty(setFiftyfitfyused, survey) {
   let question = survey.currentPage.questions[0];

   if (!(question.correctAnswer && question.choices && question.choices.length > 2)) {
      alert('Menos de dos opciones no podemos borrar alguna');
      return;
   }
   let choices = question.choices;
   //Determinamos la cantidad de opciones a borrar (la mitad de las opciones)
   let cuantasParaBorrar = Math.floor(choices.length / 2);

   choices = choices.filter((choice) => {
      let noBorrar = question.correctAnswer === choice.value || cuantasParaBorrar-- <= 0;
      return noBorrar;
   });
   question.choices = choices;
   setFiftyfitfyused(true);
   alert('has usado la ayuda  del 50/50');
}

export default HelpFiftyFifty;
