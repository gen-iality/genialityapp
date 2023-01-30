import { notification  } from 'antd';

export interface Config {
   type:        'error' | 'success';
   title:       string;
   description: string;
}


/** Componente que gestiona la Ayuda del 50/50 */
function HelpFiftyFifty(setFiftyfitfyused: any, survey: any) {

   const openNotificationWithIcon = (config: Config) => {
      notification[config.type]({
        message: config.title,
        description: config.description,
      });
    };

   let question = survey.currentPage.questions[0];

   if (!(question.correctAnswer && question.choices && question.choices.length > 2)) {
      const config: Config = {
         type : "error",
         title:'Lo sentimos',
         description:'Menos de tres opciones no podemos borrar alguna'
      }
      openNotificationWithIcon(config)
      return;
   }
   let choices = question.choices;
   //Determinamos la cantidad de opciones a borrar (la mitad de las opciones)
   let cuantasParaBorrar = Math.floor(choices.length / 2);

   choices = choices.filter((choice: any) => {
      let noBorrar = question.correctAnswer === choice.value || cuantasParaBorrar-- <= 0;
      return noBorrar;
   });
   question.choices = choices;
   setFiftyfitfyused(true);
   const config: Config = {
      type : "success",
      title:'¡Súper!',
      description:'Acabas de usar la ayuda del 50/50'
   }
   openNotificationWithIcon(config)
}

export default HelpFiftyFifty;
