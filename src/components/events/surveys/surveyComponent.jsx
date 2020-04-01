import React, { Component } from "react";
import Moment from "moment";
import SearchComponent from "../../shared/searchTable";
import API, { AgendaApi } from "../../../helpers/request";

import * as Survey from "survey-react";
import "survey-react/survey.css";

const surveyJSON = {
  title: "Tell us, what technologies do you use?",
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

class SurveyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surveyData: {}
    };
  }

  componentDidMount() {
    // var model = new Survey.Model(json);
    this.setState({ surveyData: surveyJSON });
  }

  sendDataToServer = survey => {
    console.log("enviando datos:", survey.data);
  };

  render() {
    let { surveyData } = this.state;
    console.log(this.state, surveyData);
    return (
      <div>
        <Survey.Survey json={surveyData} onComplete={this.sendDataToServer} />
      </div>
    );
  }
}

export default SurveyComponent;
