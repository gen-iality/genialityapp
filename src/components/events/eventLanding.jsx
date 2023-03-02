import { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { Card, Typography } from 'antd';
import ReactQuill from 'react-quill';
import ReactPlayer from 'react-player';
import { Row, Col } from 'antd';
import { AgendaApi } from '@helpers/request';
import { parseUrl } from '@helpers/constants';
import withContext from '@context/withContext';
import ActivitiesList from '@components/agenda/components/ActivitiesList';
import HostList from '@components/agenda/components/HostList';
import StudentSelfCourseProgress from '../StudentProgress/StudentSelfCourseProgress';
import { activityContentValues } from '@context/activityType/constants/ui';
import QuizApprovedStatus from '../quiz/QuizApprovedStatus';

class EventLanding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onPage: 'event',
      activityId: null,
      activityDetail: null,
      thereAreQuizingOrSurveys: false,
    };
    this.onChangePage = this.onChangePage.bind(this);
  }

  async componentDidMount() {
    this.setState({ onPage: 'event' });
  }

  async componentDidUpdate() {
    //Utilizada para concatenar parametros
    this.currentUrl = window.location.href;
    this.urlParams = parseUrl(this.currentUrl);
    //Si existe el activity_id por urlParams entonces seteamos el estado
    if (this.urlParams.activity_id) {
      const activity = await AgendaApi.getOne(this.urlParams.activity_id, this.props.cEvent.value._id);
      this.setState({
        activityId: this.urlParams.activity_id,
        activityDetail: activity,
      });
    }
  }

  onChangePage(value) {
    this.props.showSection(value);
  }

  onClick() {
    this.setState({ onClick: true });
  }
  isVisible() {
    if (
      (this.props.cEvent.value.description !== '<p><br></p>' &&
        this.props.cEvent.value.description !== null &&
        this.props.cEvent.value.description !== `<p class="ql-align-center"><br></p>` &&
        this.props.cEvent.value.description !== `<p class="ql-align-right"><br></p>` &&
        this.props.cEvent.value.description !== `<p class="ql-align-justify"><br></p>`) ||
      this.props.cEvent.value ||
      ((this.props.cEvent.value.description === '<p><br></p>' ||
        this.props.cEvent.value.description === null ||
        this.props.cEvent.value.description === `<p class="ql-align-center"><br></p>` ||
        this.props.cEvent.value.description === `<p class="ql-align-right"><br></p>` ||
        this.props.cEvent.value.description === `<p class="ql-align-justify"><br></p>`) &&
        this.props.cEvent.value.video)
    ) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <div /* style={{ marginBottom: 12 }} */>
        {/* Condiciones de posicionamiento, solo para cuando no tiene contenido*/}
        {console.log('this.props.cEvent.value', this.props.cEvent.value)}

        {this.props.cEvent.value && (
          <>
            <StudentSelfCourseProgress
              hasProgressLabel
              customTitle="Avance"
              activityFilter={(a) =>
                ![activityContentValues.quizing, activityContentValues.survey].includes(a.type?.name)
              }
            />
            <StudentSelfCourseProgress
              hasProgressLabel
              customTitle="Avance de exámenes"
              activityFilter={(a) =>
                [activityContentValues.quizing, activityContentValues.survey].includes(a.type?.name)
              }
            />
            {console.log('this.state.thereAreQuizingOrSurveys', this.state.thereAreQuizingOrSurveys)}
            <Card style={{ display: this.state.thereAreQuizingOrSurveys ? 'block' : 'none' }}>
              <Typography.Text>Estado del curso:</Typography.Text>{' '}
              <QuizApprovedStatus
                thereAreExam={(param) => {
                  this.setState({ thereAreQuizingOrSurveys: param });
                }}
                eventId={this.props.cEvent.value._id}
                approvedLink={`/landing/${this.props.cEvent.value._id}/certificate`}
              />
            </Card>
          </>
        )}

        {this.isVisible() ? (
          <Card
            className="event-description"
            /* bodyStyle={{ padding: '25px 5px' }} */
            style={
              this.props.cEvent.value.styles &&
              this.props.cEvent.value.styles.show_card_banner &&
              this.props.cEvent.value.styles.show_card_banner
                ? { marginTop: '2%' }
                : { marginTop: '0px' }
            }
          >
            {/*Lanzandome un nuevo diseno Sept 2022 */}
            <Row gutter={32}>
              <Col sm={24} md={6} style={{ width: '100%', padding: '0 5px' }}>
                <HostList />
              </Col>
              <Col sm={24} md={18} style={{ padding: '0 5px' }}>
                <div className="activities-main-list">
                  <ActivitiesList
                    eventId={this.props.cEvent.value?._id}
                    cEventUserId={this.props.cEventUser.value?._id}
                    setActivitiesAttendee={this.props.setActivitiesAttendee}
                  />
                </div>
              </Col>
            </Row>
            {/* FIN Lanzandome un nuevo diseno Sept 2022 */}
            {/* Si event video existe */}
            {this.props.cEvent.value?.video_position == 'true' && this.props.cEvent.value.video && (
              <div className="mediaplayer">
                <ReactPlayer
                  width={'100%'}
                  height={'100%'}
                  style={{
                    aspectRatio: '16/9',
                    objectFit: 'cover',
                  }}
                  url={this.props.cEvent.value.video}
                  controls
                />
              </div>
            )}

            {this.props.cEvent.value.description !== '<p><br></p>' &&
            this.props.cEvent.value.description !== null &&
            this.props.cEvent.value.description !== `<p class="ql-align-center"><br></p>` &&
            this.props.cEvent.value.description !== `<p class="ql-align-right"><br></p>` &&
            this.props.cEvent.value.description !== `<p class="ql-align-justify"><br></p>` ? (
              <Row justify="center">
                <Col span={24} id="img-informative">
                  <ReactQuill
                    value={this.props.cEvent.value.description}
                    readOnly
                    className="hide-toolbar ql-toolbar"
                    theme="bubble"
                  />
                </Col>
              </Row>
            ) : (
              <></>
            )}
            {(this.props.cEvent.value?.video_position == 'false' ||
              this.props.cEvent.value.video_position == undefined) &&
              this.props.cEvent.value.video && (
                <div className="mediaplayer">
                  <ReactPlayer
                    width={'100%'}
                    height={'100%'}
                    style={{
                      aspectRatio: '16/9',
                      objectFit: 'cover',
                    }}
                    url={this.props.cEvent.value.video}
                    controls
                  />
                </div>
              )}
          </Card>
        ) : (
          <div style={{ height: '150px' }} />
        )}
      </div>
    );
  }
}

const EventLandingWithContext = withContext(EventLanding);
export default withRouter(EventLandingWithContext);
