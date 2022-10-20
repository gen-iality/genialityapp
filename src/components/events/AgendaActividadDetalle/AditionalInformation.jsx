import { useState } from 'react';
import { useHelper } from '@context/helperContext/hooks/useHelper';
import { useIntl } from 'react-intl';
import { Button, Tabs, Typography, Badge, Col, Card, List, Avatar, Alert, Row, Grid, Space } from 'antd';
import WithEviusContext from '@context/withContext';
import SurveyList from '../surveys/surveyList';
import { connect } from 'react-redux';
import ModalSpeaker from '../modalSpeakers';
import DocumentsList from '../../documents/documentsList';
import { UserOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
const { TabPane } = Tabs;
const { Title } = Typography;
const { useBreakpoint } = Grid;

const AditionalInformation = (props) => {
  const { HandleChatOrAttende, currentActivity, handleChangeTypeModal } = useHelper();
  const intl = useIntl();
  const [activeTab, setActiveTab] = useState('description');
  const [idSpeaker, setIdSpeaker] = useState(false);
  const screens = useBreakpoint();

  function handleChangeLowerTabs(tab) {
    setActiveTab(tab);

    if (tab === 'games') {
      HandleChatOrAttende('4');
    }
  }

  async function getSpeakers(idSpeaker) {
    setIdSpeaker(idSpeaker);
  }

  return (
    <Card bordered={false} bodyStyle={{ margin: '0', padding: '0px' }}>
      <Tabs defaultActiveKey={activeTab} activeKey={activeTab} onChange={handleChangeLowerTabs}>
        {
          <TabPane
            tab={
              <>
                <p style={{ marginBottom: '0px' }}>{intl.formatMessage({ id: 'title.description' })}</p>
              </>
            }
            key='description'
          >
            <Row justify='center'>
              <Col span={24} id='img-description'>
                {currentActivity?.description && (
                  <ReactQuill
                    value={currentActivity?.description}
                    readOnly={true}
                    className='hide-toolbar ql-toolbar'
                    theme='bubble'
                  />
                )}
              </Col>
            </Row>
            <br />
            {(currentActivity !== null && currentActivity.hosts.length === 0) ||
            props.cEvent.value._id === '601470367711a513cc7061c2' ? (
              <div></div>
            ) : (
              <div className='List-conferencistas'>
                <p style={{ marginTop: '5%', marginBottom: '5%' }}>
                  {props.orderedHost.length > 0 ? (
                    <Row>
                      <Col span={24}>
                        <Card style={{ textAlign: 'left' }}>
                          {console.log(screens)}
                          <List
                            itemLayout={screens.xs ? 'vertical' : 'horizontal'}
                            dataSource={props.orderedHost}
                            renderItem={(item) => (
                              <List.Item style={{ padding: 16 }}>
                                <List.Item.Meta
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}
                                  avatar={
                                    item.image ? (
                                      <Avatar size={80} src={item.image} />
                                    ) : (
                                      <Avatar size={80} icon={<UserOutlined />} />
                                    )
                                  }
                                  title={<strong>{item.name}</strong>}
                                  description={item.profession}
                                />
                                <Space wrap>
                                  {item.description !== '<p><br></p>' &&
                                    item.description !== null &&
                                    item.description !== undefined && (
                                      <Button className='button_lista' onClick={() => getSpeakers(item._id)}>
                                        {intl.formatMessage({
                                          id: 'button.more.information',
                                        })}
                                      </Button>
                                    )}
                                </Space>
                              </List.Item>
                            )}
                          />
                          {idSpeaker ? (
                            <ModalSpeaker showModal={true} eventId={props.cEvent.value._id} speakerId={idSpeaker} />
                          ) : (
                            <></>
                          )}
                        </Card>
                      </Col>
                    </Row>
                  ) : (
                    <></>
                  )}
                </p>
              </div>
            )}
          </TabPane>
        }

        {currentActivity !== null && currentActivity.selected_document && currentActivity.selected_document.length > 0 && (
          <TabPane
            tab={
              <>
                <p style={{ marginBottom: '0px' }}>Documentos</p>
              </>
            }
            key='docs'
          >
            <div>
              <div style={{ marginTop: '5%', marginBottom: '5%' }}>
                <b>Documentos:</b> &nbsp;
                <div>
                  <DocumentsList data={currentActivity !== null && currentActivity.selected_document} />
                </div>
              </div>
            </div>
          </TabPane>
        )}

        {props.tabs && (
          // && (props.tabs.surveys === true || props.tabs.surveys === 'true')
          <TabPane
            tab={
              <>
                <p style={{ marginBottom: '0px' }} className='lowerTabs__mobile-visible'>
                  <Badge dot={props.hasOpenSurveys} size='default'>
                    Evaluaciones
                  </Badge>
                </p>
              </>
            }
          >
            {props.cUser.value !== null ? (
              <SurveyList eventSurveys={props.eventSurveys} />
            ) : (
              <div style={{ paddingTop: 30 }}>
                <Alert
                  showIcon
                  message='Para poder responder una evaluación debes ser usuario del sistema'
                  type='warning'
                />
                <Row style={{ marginTop: 30 }} justify='center'>
                  <Button onClick={() => handleChangeTypeModal('register')}>Registrarme</Button>
                </Row>
              </div>
            )}
          </TabPane>
        )}
        {props.tabs && (props.tabs.games === true || props.tabs.games === 'true') && (
          <TabPane
            tab={
              <>
                <p className='lowerTabs__mobile-visible' style={{ marginBottom: '0px' }}>
                  Juegos
                </p>{' '}
              </>
            }
            key='games'
          ></TabPane>
        )}
      </Tabs>
    </Card>
  );
};

const mapStateToProps = (state) => ({
  tabs: state.stage.data.tabs,
});

export default connect(mapStateToProps, null)(WithEviusContext(AditionalInformation));
