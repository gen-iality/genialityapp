import React, { useContext, useState } from 'react';
import HelperContext from '../../../Context/HelperContext';
import { useIntl } from 'react-intl';
import { Button, Tabs, Typography, Badge, Col, Card, List,Avatar,Alert,Row  } from 'antd';
import WithEviusContext from '../../../Context/withContext';
import SurveyList from '../surveys/surveyList';
import { connect } from 'react-redux';
const { TabPane } = Tabs;
const { Title } = Typography;

const AditionalInformation = (props) => {
  let { HandleChatOrAttende, currentActivity, handleChangeTypeModal } = useContext(HelperContext);
  const intl = useIntl();
  const [activeTab, setActiveTab] = useState('description');
  let [idSpeaker, setIdSpeaker] = useState(false);


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
    <div className='card-content has-text-left container_calendar-description'>
      <Tabs defaultActiveKey={activeTab} activeKey={activeTab} onChange={handleChangeLowerTabs}>
        {
          <TabPane
            tab={
              <>
                <p style={{ marginBottom: '0px' }}>{intl.formatMessage({ id: 'title.description' })}</p>
              </>
            }
            key='description'>
            <div
              dangerouslySetInnerHTML={{
                __html: currentActivity !== null && currentActivity.description,
              }}></div>
            <br />
            {(currentActivity !== null && currentActivity.hosts.length === 0) ||
            props.cEvent.value._id === '601470367711a513cc7061c2' ? (
              <div></div>
            ) : (
              <div className='List-conferencistas'>
                <Title level={5}>{intl.formatMessage({ id: 'title.panelists' })} </Title>
                <p style={{ marginTop: '5%', marginBottom: '5%' }} className='has-text-left is-size-6-desktop'>
                  {props.orderedHost.length > 0 ? (
                    <>
                      <Col xs={24} sm={22} md={18} lg={18} xl={22} style={{ margin: '0 auto' }}>
                        <Card style={{ textAlign: 'left' }}>
                          <List
                            itemLayout='horizontal'
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
                                <div className='btn-list-confencista'>
                                  {item.description !== '<p><br></p>' &&
                                    item.description !== null &&
                                    item.description !== undefined && (
                                      <Button className='button_lista' onClick={() => getSpeakers(item._id)}>
                                        {intl.formatMessage({
                                          id: 'button.more.information',
                                        })}
                                      </Button>
                                    )}
                                </div>
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
                    </>
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
            key='docs'>
            <div>
              <div style={{ marginTop: '5%', marginBottom: '5%' }} className='has-text-left is-size-6-desktop'>
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
                    Encuestas
                  </Badge>
                </p>
              </>
            }>
            {props.cUser.value !== null ? (
              <SurveyList eventSurveys={props.eventSurveys} />
            ) : (
              <div style={{ paddingTop: 30 }}>
                <Alert
                  showIcon
                  message='Para poder responder una encuesta debes ser usuario del sistema'
                  type='warning'
                />
                <Row style={{ marginTop: 30 }} justify='center'>
                  <Button onClick={()=>handleChangeTypeModal("register")}>Registrarme</Button>
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
            key='games'></TabPane>
        )}
      </Tabs>

      <div
        className='card-footer is-12 is-flex'
        style={{
          borderTop: 'none',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}></div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  tabs: state.stage.data.tabs,
});

export default connect(mapStateToProps, null)(WithEviusContext(AditionalInformation));
