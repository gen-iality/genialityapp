import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";

import EventContent from "../events/shared/content";

import { SurveysApi } from "../../helpers/request";
import { getTotalVotes } from "./services";

import { Input, List, Card } from "antd";

const data = [
  {
    title: "Title 1",
  },
  {
    title: "Title 2",
  },
  {
    title: "Title 3",
  },
  {
    title: "Title 4",
  },
  {
    title: "Title 5",
  },
  {
    title: "Title 6",
  },
];

class TriviaReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surveyQuestions: [],
    };
  }

  loadData = async () => {
    const { event, matchUrl, location } = this.props;
    let { surveyQuestions } = this.state;

    SurveysApi.getOne(event._id, location.state.report)
      .then(async (response) => {
        const votes = new Promise((resolve, reject) => {
          let questions = [];

          response.questions.forEach(async (question, index, arr) => {
            let infoQuestion = await getTotalVotes(location.state.report, question);
            questions.push(infoQuestion);
            if (questions.length == arr.length) resolve(questions);
          });
        });

        let questions = await votes;
        this.setState({ surveyQuestions: questions });
      })
      .catch((err) => {});
  };

  componentDidMount() {
    this.loadData();
  }

  goBack = () => this.props.history.goBack();

  render() {
    let { surveyQuestions } = this.state;
    return (
      <Fragment>
        <EventContent title="Encuestas" closeAction={this.goBack}>
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 2,
              lg: 3,
              xl: 3,
              xxl: 3,
            }}
            dataSource={surveyQuestions}
            renderItem={(item) => (
              <List.Item>
                <Card title={item.title}>
                  {item.quantityResponses == 0
                    ? "No se ha respondido aun la pregunta"
                    : `${item.quantityResponses} usuarios han respondido la pregunta`}
                </Card>
              </List.Item>
            )}
          />
          ,
        </EventContent>
      </Fragment>
    );
  }
}

export default withRouter(TriviaReport);
