import { Component  } from 'react';
import { withRouter, Link } from 'react-router-dom';

import { SurveysApi } from '@helpers/request';
import { getTotalVotes } from './services';

import { List, Card, Button, Spin, Empty, Row, Col, Modal, notification } from 'antd';
import Header from '@antdComponents/Header';

class TriviaReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surveyQuestions: [],
      loading: true,
      visibleModal: false,
    };
  }

  loadData = async () => {
    const { event, location } = this.props;

    SurveysApi.getOne(event._id, location.state.report)
      .then(async (response) => {
        const votes = new Promise((resolve) => {
          const questions = [];

          response.questions.forEach(async (question, index, arr) => {
            const infoQuestion = await getTotalVotes(location.state.report, question);
            questions.push(infoQuestion);
            if (questions.length === arr.length) resolve(questions);
          });
        });

        const questions = await votes;
        this.setState({ surveyQuestions: questions, loading: false });
      })
      .catch(() => {
        //
        notification.open({
          message: 'No se registran respuestas guardadas',
          description: 'No hay respuestas y/o preguntas para realizar el informe',
        });
        this.setState({
          loading: false,
        });
      });
  };

  toggleModal = () => {
    const { visibleModal } = this.state;
    this.setState({ visibleModal: !visibleModal });
  };

  componentDidMount() {
    this.loadData();
  }

  goBack = () => this.props.history.goBack();

  render() {
    const { surveyQuestions, loading } = this.state;
    const { location } = this.props;

    if (!loading)
      return (
        <>
          <Header title={'Detalle de la Evaluación'} back />

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
        </>
      );

    return <Spin></Spin>;
  }
}

export default withRouter(TriviaReport);
