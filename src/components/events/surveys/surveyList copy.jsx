import React, { Component } from 'react';
/** Helpers */
import { Actions, TicketsApi } from '../../../helpers/request';
import { publishedSurveysByActivity } from '../../../helpers/helperEvent'

/** Obtener cookies */
import * as Cookie from 'js-cookie';

/** Redux */
import { connect } from 'react-redux';
import * as StageActions from '../../../redux/stage/actions';
import * as SurveyActions from '../../../redux/survey/actions';

/** Listado de cards con las encuestas */
import SurveyCard from './components/surveyCard'

/** Firebase */
import { firestore } from '../../../helpers/firebase';


const { setMainStage } = StageActions;
const { setCurrentSurvey, setSurveyVisible, unsetCurrentSurvey } = SurveyActions;

class SurveyList extends Component {
   constructor(props) {
      super(props);
      this.state = {
         selectedSurvey: {},
         surveysData: [],
         loadingSurveys: true,
         loading: false,
         surveyVisible: false,
         availableSurveysBar: props.availableSurveysBar || false,
         surveyRecentlyChanged: false,
         userVote: false,
         forceCheckVoted: false,
         surveyLabel: {},
         defaultSurveyLabel: {
            name: 'Encuestas',
            section: 'survey',
            icon: 'FileUnknownOutlined',
            checked: false,
            permissions: 'public',
         },

         // luego de cargar el componente este estado permanece escuchando todas las encuestas del evento
         eventSurveys: [], // Todas las encuestas de un evento, este estado va a estar escuchando
         anonymousSurveys: [], // Solo encuestas que permiten usuarios anónimos
         publishedSurveys: [], // Encuestas relacionadas con la actividad + globales para renderizar el listado de encuestas en componente de videoconferencia
      };
   }
   async componentDidMount() {
      // let { event } = this.props;

      // Método para escuchar todas las encuestas relacionadas con el evento
      //this.filterEventSurveys();

      // Verifica si el usuario esta inscrito en el evento para obtener su rol en compoente RootPage para saber si es un speaker
      // let eventUser = await this.getCurrentEvenUser(event._id);

      // this.setState({ eventUser: eventUser });
      // this.userVote();
      // this.getItemsMenu();

      this.setState(
         {
            publishedSurveys: this.props.publishedSurveys,
            surveyVisible: this.props.publishedSurveys && this.props.publishedSurveys.length,
            loading: true,
            loadingSurveys: true,
         },
         this.callback
      );
   }

   componentDidUpdate(prevProps) {
      if (prevProps.activity !== this.props.activity || prevProps.publishedSurveys !== this.props.publishedSurveys) {
         this.setState(
            {
               publishedSurveys: this.props.publishedSurveys,
               surveyVisible: this.props.publishedSurveys && this.props.publishedSurveys.length,
               loading: true,
               loadingSurveys: true,
            },
            this.callback
         );
      }
   }

   filterEventSurveys = () => {
      const { activity } = this.props;
      let publishedSurveys = [];
      let surveys = this.props.eventSurveys || [];

      // Listado de encuestas publicadas del evento
      publishedSurveys = surveys.filter(
         (survey) =>
            (survey.isPublished === 'true' || survey.isPublished === true) &&
            ((activity && survey.activity_id === activity._id) || survey.isGlobal === 'true')
      );

      if (Object.keys(this.props.currentUser).length === 0) {
         publishedSurveys = publishedSurveys.filter((item) => {
            return item.allow_anonymous_answers !== 'false';
         });
      }
      this.setState(
         {
            publishedSurveys,
            surveyVisible: publishedSurveys && publishedSurveys.length,
            loading: true,
            loadingSurveys: true,
         },
         this.callback
      );
   };

   queryMyResponses = async (survey) => {
      const { currentUser } = this.props;
      //Agregamos un listener a firestore para detectar cuando cambia alguna propiedad de las encuestas
      let counterDocuments = 0;
      return new Promise((resolve) => {
         firestore
            .collectionGroup('responses')
            .where('id_survey', '==', survey._id)
            .where('id_user', '==', currentUser._id)
            .get()
            .then((result) => {
               result.forEach(function (doc) {
                  if (doc.exists) {
                     counterDocuments++;
                  }
               });

               if (counterDocuments > 0) {
                  resolve({ userHasVoted: true, totalResponses: counterDocuments });
               } else {
                  resolve({ userHasVoted: false, totalResponses: counterDocuments });
               }
            });
      });
   };

   //Verifica si el usuario ya votó en una encuesta cuando se carga el listado de encuestas
   callback = async () => {
      const { publishedSurveys } = this.state;
      const { currentUser } = this.props;
      if (publishedSurveys) {
         const checkMyResponses = new Promise((resolve) => {
            let filteredSurveys = [];

            publishedSurveys.forEach(async (survey, index, arr) => {
               if (!(Object.keys(currentUser).length === 0)) {
                  const result = await this.queryMyResponses(survey);
                  filteredSurveys.push({
                     ...arr[index],
                     userHasVoted: result.userHasVoted,
                     totalResponses: result.totalResponses,
                  });
               } else {
                  // Esto solo se ejecuta si no hay algun usuario logeado
                  const guestUser = new Promise((resolve) => {
                     let surveyId = localStorage.getItem(`userHasVoted_${survey._id}`);
                     surveyId ? resolve(true) : resolve(false);
                  });
                  let guestHasVote = await guestUser;
                  filteredSurveys.push({ ...arr[index], userHasVoted: guestHasVote });
               }

               if (filteredSurveys.length === arr.length) resolve(filteredSurveys);
            });
         });

         let stateSurveys = await checkMyResponses;

         this.setState({
            publishedSurveys: stateSurveys,
            forceCheckVoted: false,
            loading: false,
            loadingSurveys: false,
         });
      }
   };

   // getItemsMenu = async () => {
   //    let { defaultSurveyLabel } = this.state;
   //    const { activity } = this.props;
   //    const response = await Actions.getAll(`/api/events/${activity.event_id}`);
   //    let surveyLabel = response.itemsMenu.survey || defaultSurveyLabel;
   //    this.setState({ surveyLabel });
   // };

   // getCurrentEvenUser = async (eventId) => {
   //    let evius_token = Cookie.get('evius_token');
   //    if (!evius_token) return null;
   //    let response = await TicketsApi.getByEvent(eventId, evius_token);
   //    return response && response.data.length ? response.data[0] : null;
   // };

   // pluralToSingular = (char, t1, t2) => {
   //    if (t1 !== undefined) return `${t1}${t2}`;
   //    return '';
   // };

   handleClick = (currentSurvey) => {
      const { activity, setMainStage, setCurrentSurvey, setSurveyVisible } = this.props;
      if (activity !== null) {
         setMainStage('surveyDetalle');
      } else {
         setSurveyVisible(true);
      }
      setCurrentSurvey(currentSurvey);
   };

   render() {
      const { surveyLabel, loading, publishedSurveys, loadingSurveys } = this.state;

      return (
        <SurveyCard
        surveyLabel={surveyLabel}
        loading={loading}
        loadingSurveys={loadingSurveys}
        publishedSurveys={publishedSurveys}
        />
      );
   }
}

const mapStateToProps = (state) => ({
   event: state.event.data,
   activity: state.stage.data.currentActivity,
   currentUser: state.user.data,
});

const mapDispatchToProps = {
   setMainStage,
   setCurrentSurvey,
   setSurveyVisible,
   unsetCurrentSurvey,
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyList);
