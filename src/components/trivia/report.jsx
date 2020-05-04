import React, { Component, Fragment } from "react";
import { withRouter, Link } from "react-router-dom";

import EventContent from "../events/shared/content";

import { SurveysApi } from "../../helpers/request";
import { getTotalVotes } from "./services";

import { Input, List, Card, Button, Spin, Empty } from "antd";

class TriviaReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surveyQuestions: [],
      loading: true,
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
        this.setState({ surveyQuestions: questions, loading: false });
      })
      .catch((err) => {});
  };

  seeReport = (questionId) => {};

  componentDidMount() {
    this.loadData();
  }

  goBack = () => this.props.history.goBack();

  render() {
    let { surveyQuestions, loading } = this.state;
    const { location } = this.props;

    if (!loading)
      return (
        <Fragment>
          <EventContent title="Encuestas" closeAction={this.goBack}>
            {surveyQuestions.length > 0 ? (
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
                    <Link
                      to={{
                        pathname: `${this.props.matchUrl}/report/${item.id}`,
                        state: { titleQuestion: item.title, surveyId: location.state.report },
                      }}>
                      <Card title={item.title ? item.title : "Pregunta sin Titulo"} hoverable>
                        {item.quantityResponses == 0
                          ? "No se ha respondido aun la pregunta"
                          : `${item.quantityResponses} usuarios han respondido la pregunta`}
                      </Card>
                    </Link>
                  </List.Item>
                )}
              />
            ) : (
              <Empty />
            )}
          </EventContent>
        </Fragment>
      );

    return <Spin></Spin>;
  }
}

export default withRouter(TriviaReport);
