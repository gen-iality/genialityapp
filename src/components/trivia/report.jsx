import React, { Component, Fragment } from 'react';
import { withRouter, Link } from 'react-router-dom';

import EventContent from '../events/shared/content';

import { SurveysApi } from '../../helpers/request';
import { getTotalVotes } from './services';

import { List, Card, Button, Spin, Empty, Row, Col, Modal, notification } from 'antd';
import Header from '../../antdComponents/Header';

class TriviaReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surveyQuestions: [],
      loading: true,
      visibleModal: false
    };
  }

  loadData = async () => {
    const { event, location } = this.props;

    SurveysApi.getOne(event._id, location.state.report)
      .then(async (response) => {
        const votes = new Promise((resolve) => {
          let questions = [];

          response.questions.forEach(async (question, index, arr) => {
            let infoQuestion = await getTotalVotes(location.state.report, question);
            questions.push(infoQuestion);
            if (questions.length === arr.length) resolve(questions);
          });
        });

        let questions = await votes;
        this.setState({ surveyQuestions: questions, loading: false });
      })
      .catch(() => {
        //
        notification.open({
          message: 'No se registran respuestas guardadas',
          description: 'No hay respuestas y/o preguntas para realizar el informe'
        });
        this.setState({
          loading: false
        });
      });
  };

 

  toggleModal = () => {
    let { visibleModal } = this.state;
    this.setState({ visibleModal: !visibleModal });
  };

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
          <Header 
            title={'Detalle de la Encuesta'}
            back
          />

          {surveyQuestions.length > 0 ? (
            <List
              grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 2,
                lg: 3,
                xl: 3,
                xxl: 3
              }}
              dataSource={surveyQuestions}
              renderItem={(item) => (
                <List.Item>
                  <Link
                    to={{
                      pathname: `${this.props.matchUrl}/report/${item.id}`,
                      state: { titleQuestion: item.title, surveyId: location.state.report }
                    }}>
                    <Card title={item.title ? item.title : 'Pregunta sin Titulo'} hoverable>
                      {item.quantityResponses === 0
                        ? 'No se ha respondido aun la pregunta'
                        : `${item.quantityResponses} usuarios han respondido la pregunta`}
                    </Card>
                  </Link>
                </List.Item>
              )}
            />
          ) : (
            <Empty />
          )}
          {/* <EventContent title='Encuestas' closeAction={this.goBack}>
            {surveyQuestions.length > 0 ? (
              <Fragment>
                <Row justify='end' style={{ marginBottom: 10 }}>
                  <Col>
                    <Button onClick={this.toggleModal}>Votar por usuarios</Button>
                  </Col>
                </Row>

                <List
                  grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                    md: 2,
                    lg: 3,
                    xl: 3,
                    xxl: 3
                  }}
                  dataSource={surveyQuestions}
                  renderItem={(item) => (
                    <List.Item>
                      <Link
                        to={{
                          pathname: `${this.props.matchUrl}/report/${item.id}`,
                          state: { titleQuestion: item.title, surveyId: location.state.report }
                        }}>
                        <Card title={item.title ? item.title : 'Pregunta sin Titulo'} hoverable>
                          {item.quantityResponses === 0
                            ? 'No se ha respondido aun la pregunta'
                            : `${item.quantityResponses} usuarios han respondido la pregunta`}
                        </Card>
                      </Link>
                    </List.Item>
                  )}
                />
                <Modal
                  title='Basic Modal'
                  visible={this.state.visibleModal}
                  onOk={this.toggleModal}
                  onCancel={this.toggleModal}>
                  Este es el modal
                </Modal>
              </Fragment>
            ) : (
              <Empty />
            )}
          </EventContent> */}
        </Fragment>
      );

    return <Spin></Spin>
  }
}

export default withRouter(TriviaReport);
