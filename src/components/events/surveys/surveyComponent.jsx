import React, { Component } from "react";
import Moment from "moment";
import { toast } from "react-toastify";
import * as Cookie from "js-cookie";

import SearchComponent from "../../shared/searchTable";
import { FormattedDate, FormattedMessage, FormattedTime } from "react-intl";

import API, { AgendaApi } from "../../../helpers/request";
import { firestore } from "../../../helpers/firebase";
import { SurveyAnswers } from "./services";

import * as Survey from "survey-react";
import "survey-react/survey.css";

const surveyJSON = {
  _id: "5e84ace9d74d5c700c5e0c42",
  title: "Encuesta numero 2",
  pages: [
    {
      name: "page1",
      questions: [
        {
          type: "radiogroup",
          choices: ["Yes", "No"],
          isRequired: true,
          name: "frameworkUsing",
          title: "Do you use any front-end framework like Bootstrap?"
        },
        {
          type: "checkbox",
          choices: ["Bootstrap", "Foundation"],
          hasOther: true,
          isRequired: true,
          name: "framework",
          title: "What front-end framework do you use?",
          visibleIf: "{frameworkUsing} = 'Yes'"
        }
      ]
    },
    {
      name: "page2",
      questions: [
        {
          type: "radiogroup",
          choices: ["Yes", "No"],
          isRequired: true,
          name: "mvvmUsing",
          title: "Do you use any MVVM framework?"
        },
        {
          type: "checkbox",
          choices: ["AngularJS", "KnockoutJS", "React"],
          hasOther: true,
          isRequired: true,
          name: "mvvm",
          title: "What MVVM framework do you use?",
          visibleIf: "{mvvmUsing} = 'Yes'"
        }
      ]
    },
    {
      name: "page3",
      questions: [
        {
          type: "comment",
          name: "about",
          title:
            "Please tell us about your main requirements for Survey library"
        }
      ]
    }
  ]
};

let json = {
  _id: "5e84b583d74d5c700e166792",
  title: "Encuesta numero 1",
  pages: [
    {
      name: "page4",
      elements: [
        {
          type: "panel",
          name: "panel4",

          elements: [
            {
              type: "matrixdropdown",
              name: "question2",
              title:
                "Please rank these impacts by fears. Where 1 is the impact your fear the most and 5 you fear the least. Please select numbers in front of the impact text accordingly",
              columns: [
                {
                  cellType: "rating",
                  name: "level",
                  title: "Level",
                  minRateDescription: "most",
                  maxRateDescription: "least"
                },
                {
                  name: "comments",
                  title: "Comments/Precision",
                  cellType: "text"
                }
              ],
              choices: [1],
              cellType: "checkbox",
              rows: [
                "Privacy",
                "Confidentiality",
                "Integrity",
                "Availability",
                "Authenticity"
              ]
            }
          ]
        }
      ]
    },

    {
      name: "page5",
      elements: [
        {
          type: "panel",
          name: "panel5",

          elements: [
            {
              type: "matrixdropdown",
              name: "question3",
              title:
                "Please rank these impacts by fears. Where 1 is the impact your fear the most and 3 you fear the least. Please select numbers in front of the impact text accordingly",
              columns: [
                {
                  cellType: "rating",
                  name: "level",
                  title: "Level",

                  rateValues: [
                    {
                      value: "value1",
                      text: "1"
                    },
                    {
                      value: "value2",
                      text: "2"
                    },
                    {
                      value: "value3",
                      text: "3"
                    }
                  ]
                },
                {
                  name: "comments2",
                  title: "Comments/Precision",
                  cellType: "text"
                }
              ],
              choices: [1],
              cellType: "checkbox",
              rows: ["Safety", "Reputation & Financial Loss", "Threat Scale"]
            }
          ]
        }
      ]
    },

    {
      name: "page6",
      elements: [
        {
          type: "panel",
          name: "panel6",
          elements: [
            {
              type: "multipletext",
              name: "pricelimit",
              title: "From a market point of view: ",
              colCount: 2,
              items: [
                {
                  name: "region",
                  title:
                    "What regions are you willing to sell the solution/products to?"
                },
                {
                  name: "business",
                  title:
                    "What type of business are you willing to sell the solutio/product to? "
                }
              ]
            },
            {
              type: "comment",
              name: "comment2",
              title: "Comments/Precision"
            }
          ]
        }
      ]
    },

    {
      name: "page7",
      title: "General Considerations",
      elements: [
        {
          type: "panel",
          name: "panel7",

          elements: [
            {
              type: "checkbox",
              name: "car",
              title:
                "🔧Why are considering an evaluation/certification of your Solution/Product?",
              // isRequired: true,
              hasOther: true,
              otherText: "Others",
              colCount: 4,
              // "choicesOrder": "asc",
              choices: [
                {
                  value: "government",
                  text: "Government bid "
                },
                {
                  value: "customer",
                  text: "Customer requirement"
                },
                {
                  value: "nice",
                  text: "Nice to have "
                },
                {
                  value: "temperature",
                  text: "Temperature"
                },
                {
                  value: "improve",
                  text: "Improve security"
                },
                {
                  value: "marketing",
                  text: "Marketing"
                },
                {
                  value: "notsure",
                  text: "I'm not sure"
                }
              ]
            },

            {
              name: "comment3",
              title: "Please comment:",
              type: "comment"

              //"startWithNewLine": false,
            }
          ]
        }
      ]
    }

    /******************************* End of Likelihood ********************************** */
  ],
  showQuestionNumbers: "off",
  completedHtml: "<p><h4>Security Profile Results !!</h4></p>"
};

const surveyJSON2 = {
  _id: "5e84b5cdd74d5c701c50b242",
  title: "Encuesta numero 3",
  pages: [
    {
      name: "page1",
      questions: [
        {
          type: "radiogroup",
          choices: ["Yes", "No"],
          isRequired: true,
          name: "frameworkUsing",
          title: "Do you use any front-end framework like Bootstrap?"
        },
        {
          type: "checkbox",
          choices: ["Bootstrap", "Foundation"],
          hasOther: true,
          isRequired: true,
          name: "framework",
          title: "What front-end framework do you use?",
          visibleIf: "{frameworkUsing} = 'Yes'"
        }
      ]
    },
    {
      name: "page2",
      questions: [
        {
          type: "radiogroup",
          choices: ["Yes", "No"],
          isRequired: true,
          name: "mvvmUsing",
          title: "Do you use any MVVM framework?"
        },
        {
          type: "checkbox",
          choices: ["AngularJS", "KnockoutJS", "React"],
          hasOther: true,
          isRequired: true,
          name: "mvvm",
          title: "What MVVM framework do you use?",
          visibleIf: "{mvvmUsing} = 'Yes'"
        }
      ]
    },
    {
      name: "page3",
      questions: [
        {
          type: "comment",
          name: "about",
          title:
            "Please tell us about your main requirements for Survey library"
        }
      ]
    }
  ]
};

let json2 = {
  _id: "5e84b605d74d5c7039785152",
  title: "Encuesta numero 4",
  pages: [
    {
      name: "page4",
      elements: [
        {
          type: "panel",
          name: "panel4",

          elements: [
            {
              type: "matrixdropdown",
              name: "question2",
              title:
                "Please rank these impacts by fears. Where 1 is the impact your fear the most and 5 you fear the least. Please select numbers in front of the impact text accordingly",
              columns: [
                {
                  cellType: "rating",
                  " name": "level",
                  title: "Level",
                  minRateDescription: "most",
                  maxRateDescription: "least"
                },
                {
                  name: "comments",
                  title: "Comments/Precision",
                  cellType: "text"
                }
              ],
              choices: [1],
              cellType: "checkbox",
              rows: [
                "Privacy",
                "Confidentiality",
                "Integrity",
                "Availability",
                "Authenticity"
              ]
            }
          ]
        }
      ]
    },

    {
      name: "page5",
      elements: [
        {
          type: "panel",
          name: "panel5",

          elements: [
            {
              type: "matrixdropdown",
              name: "question3",
              title:
                "Please rank these impacts by fears. Where 1 is the impact your fear the most and 3 you fear the least. Please select numbers in front of the impact text accordingly",
              columns: [
                {
                  cellType: "rating",
                  " name": "level",
                  title: "Level",

                  rateValues: [
                    {
                      value: "value1",
                      text: "1"
                    },
                    {
                      value: "value2",
                      text: "2"
                    },
                    {
                      value: "value3",
                      text: "3"
                    }
                  ]
                },
                {
                  name: "comments2",
                  title: "Comments/Precision",
                  cellType: "text"
                }
              ],
              choices: [1],
              cellType: "checkbox",
              rows: ["Safety", "Reputation & Financial Loss", "Threat Scale"]
            }
          ]
        }
      ]
    },

    {
      name: "page6",
      elements: [
        {
          type: "panel",
          name: "panel6",
          elements: [
            {
              type: "multipletext",
              name: "pricelimit",
              title: "From a market point of view: ",
              colCount: 2,
              items: [
                {
                  name: "region",
                  title:
                    "What regions are you willing to sell the solution/products to?"
                },
                {
                  name: "business",
                  title:
                    "What type of business are you willing to sell the solutio/product to? "
                }
              ]
            },
            {
              type: "comment",
              name: "comment2",
              title: "Comments/Precision"
            }
          ]
        }
      ]
    },

    {
      name: "page7",
      title: "General Considerations",
      elements: [
        {
          type: "panel",
          name: "panel7",

          elements: [
            {
              type: "checkbox",
              name: "car",
              title:
                "🔧Why are considering an evaluation/certification of your Solution/Product?",
              // isRequired: true,
              hasOther: true,
              otherText: "Others",
              colCount: 4,
              // "choicesOrder": "asc",
              choices: [
                {
                  value: "government",
                  text: "Government bid "
                },
                {
                  value: "customer",
                  text: "Customer requirement"
                },
                {
                  value: "nice",
                  text: "Nice to have "
                },
                {
                  value: "temperature",
                  text: "Temperature"
                },
                {
                  value: "improve",
                  text: "Improve security"
                },
                {
                  value: "marketing",
                  text: "Marketing"
                },
                {
                  value: "notsure",
                  text: "I'm not sure"
                }
              ]
            },

            {
              name: "comment3",
              title: "Please comment:",
              type: "comment"

              //"startWithNewLine": false,
            }
          ]
        }
      ]
    }

    /******************************* End of Likelihood ********************************** */
  ],
  showQuestionNumbers: "off",
  completedHtml: "<p><h4>Security Profile Results !!</h4></p>"
};

let array = [surveyJSON, json, surveyJSON2, json2];

class SurveyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surveyData: {},
      uid: null
    };
  }

  componentDidMount() {
    this.loadData();
  }

  // Funcion para consultar la informacion del actual usuario
  getCurrentUser = async () => {
    let evius_token = Cookie.get("evius_token");

    if (!evius_token) {
      this.setState({ user: false });
    } else {
      try {
        const resp = await API.get(
          `/auth/currentUser?evius_token=${Cookie.get("evius_token")}`
        );
        if (resp.status === 200) {
          const data = resp.data;
          // Solo se desea obtener el id del usuario
          this.setState({ uid: data._id });
        }
      } catch (error) {
        const { status } = error.response;
        console.log("STATUS", status, status === 401);
      }
    }
  };

  // Funcion para cargar datos de la encuesta seleccionada
  loadData = () => {
    const { idSurvey } = this.props;
    let { surveyData } = this.state;

    let survey = array.filter(survey => survey._id == idSurvey);
    surveyData = survey[0];

    this.setState({ surveyData, idSurvey });
  };

  // Funcion para enviar la informacion de las respuestas
  sendDataToServer = survey => {
    const { showListSurvey, eventId } = this.props;
    let { surveyData, uid } = this.state;

    firestore
      .collection("surveys")
      .doc(surveyData._id)
      .set({
        eventId: eventId,
        name: surveyData.title,
        category: "none"
      });

    let questions = survey
      .getAllQuestions()
      .filter(surveyInfo => surveyInfo.id);

    const executeService = (SurveyData, questions, uid) => {
      let sendAnswers = 0;
      let responseMessage = null;
      let responseError = null;

      return new Promise((resolve, reject) => {
        questions.forEach(async question => {
          if (question.value)
            if (uid) {
              await SurveyAnswers.registerWithUID(surveyData._id, question.id, {
                responseData: question.value,
                date: new Date(),
                uid
              })
                .then(result => {
                  sendAnswers++;
                  responseMessage = !responseMessage && result;
                })
                .catch(err => (responseError = err));
            } else {
              await SurveyAnswers.registerLikeGuest(
                surveyData._id,
                question.id,
                {
                  responseData: question.value,
                  date: new Date(),
                  uid: "guest"
                }
              )
                .then(result => {
                  sendAnswers++;
                  responseMessage = !responseMessage && result;
                })
                .catch(err => (responseError = err));
            }
          if (responseMessage && sendAnswers == questions.length) {
            await resolve(responseMessage);
          } else if (responseError) {
            await reject(responseError);
          }
        });
      });
    };

    executeService(surveyData, questions, uid).then(result => {
      toast.success(result);
    });

    showListSurvey();
  };

  render() {
    let { surveyData } = this.state;
    const { showListSurvey } = this.props;

    return (
      <div>
        <a className="has-text-white" onClick={() => showListSurvey()}>
          <h3 className="has-text-white"> Regresar a las encuestas</h3>
        </a>
        <Survey.Survey json={surveyData} onComplete={this.sendDataToServer} />
      </div>
    );
  }
}

export default SurveyComponent;
