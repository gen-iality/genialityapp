import { Component, Fragment } from "react";
import { withRouter, Link } from "react-router-dom";

import { SurveysApi } from "../../helpers/request";
import { getTotalVotes } from "./services";

import {
  List,
  Card,
  Button,
  Spin,
  Empty,
  Row,
  Col,
  Modal,
  notification,
} from "antd";
import Header from "../../antdComponents/Header";
import GraphicsRefactor from "../events/surveys/graphicsRefactor";

class TriviaReport extends Component {
  state = {
    surveyQuestions: [],
    loading: true,
    visibleModal: false,
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    const { event, location } = this.props;
    try {
      const response = await SurveysApi.getOne(
        event._id,
        location.state.report
      );
      const questions = await Promise.all(
        response.questions.map(
          async (question) =>
            await getTotalVotes(location.state.report, question)
        )
      );
      this.setState({
        eventId: event._id,
        surveyId: response._id,
        surveyQuestions: questions,
        loading: false,
      });
    } catch (error) {
      notification.open({
        message: "No se registran respuestas guardadas",
        description: "No hay respuestas y/o preguntas para realizar el informe",
      });
      this.setState({ loading: false });
    }
  };

  toggleModal = () => {
    this.setState((prevState) => ({ visibleModal: !prevState.visibleModal }));
  };

  goBack = () => this.props.history.goBack();

  render() {
    const {
      surveyQuestions,
      loading,
      eventId,
      surveyId,
      visibleModal,
    } = this.state;
    const { location, match } = this.props;

    if (loading) return <Spin />;

    return (
      <Fragment>
        <Header title="Detalle de la Encuesta" back />
        <div style={{ margin: "auto", width: "100%" }}>
          {eventId && surveyId && (
            <Fragment>
              <Button
                type="primary"
                onClick={this.toggleModal}
              >
                Mostrar Gráfica
              </Button>
              <Modal
                title="Gráfica de la Encuesta"
                visible={visibleModal}
                onCancel={this.toggleModal}
                footer={[
                  <Button key="close" onClick={this.toggleModal}>
                    Cerrar
                  </Button>,
                ]}
                width="100%"
              >
                <div style={{width: '65%', margin: 'auto'}}>
                  <GraphicsRefactor
                    idSurvey={surveyId}
                    eventId={eventId}
                    operation="participationPercentage"
                  />
                </div>
              </Modal>
            </Fragment>
          )}
        </div>
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
            style={{ marginTop: "5px" }}
            dataSource={surveyQuestions}
            renderItem={(item) => (
              <List.Item>
                <Link
                  to={{
                    pathname: `${match.url}/report/${item.id}`,
                    state: {
                      titleQuestion: item.title,
                      surveyId: location.state.report,
                    },
                  }}
                >
                  <Card title={item.title || "Pregunta sin Titulo"} hoverable>
                    {item.quantityResponses === 0
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
      </Fragment>
    );
  }
}

export default withRouter(TriviaReport);
