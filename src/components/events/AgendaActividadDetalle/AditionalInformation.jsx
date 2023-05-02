import { useEffect, useState } from 'react'
import { useHelper } from '@context/helperContext/hooks/useHelper'
import { useIntl } from 'react-intl'
import {
  Button,
  Tabs,
  Typography,
  Badge,
  Col,
  Card,
  List,
  Avatar,
  Alert,
  Row,
  Grid,
  Space,
  Result,
} from 'antd'
import WithEviusContext from '@context/withContext'
import SurveyList from '../surveys/surveyList'
import { connect } from 'react-redux'
import ModalSpeaker from '../modalSpeakers'
import DocumentsList from '../../documents/documentsList'
import { UserOutlined } from '@ant-design/icons'
import ReactQuill from 'react-quill'
import ClipboardTextOffIcon from '@2fd/ant-design-icons/lib/ClipboardTextOff'
import { DocumentsApi } from '@helpers/request'
const { TabPane } = Tabs
const { Title } = Typography
const { useBreakpoint } = Grid

const AditionalInformation = (props) => {
  const { HandleChatOrAttende, currentActivity, handleChangeTypeModal } = useHelper()
  const intl = useIntl()
  const [activeTab, setActiveTab] = useState('description')
  const [idSpeaker, setIdSpeaker] = useState(null)
  const [document, setDocument] = useState({})
  const screens = useBreakpoint()

  useEffect(() => {
    getDocuments()
  }, [currentActivity?.selected_document])

  async function getDocuments() {
    const allDocuments = await DocumentsApi.getAll(props.cEvent.value._id)
    const document = allDocuments.data.filter(
      (document) => document._id === currentActivity?.selected_document[0],
    )
    setDocument(document)
  }

  function handleChangeLowerTabs(tab) {
    setActiveTab(tab)

    if (tab === 'games') {
      HandleChatOrAttende('4')
    }
  }

  async function getSpeakers(idSpeaker) {
    setIdSpeaker(idSpeaker)
  }

  return (
    <Card bordered={false} bodyStyle={{ margin: '0', padding: '0px' }}>
      <Tabs
        defaultActiveKey={activeTab}
        activeKey={activeTab}
        onChange={handleChangeLowerTabs}
      >
        {
          <TabPane
            tab={
              <>
                <p style={{ marginBottom: '0px' }}>
                  {intl.formatMessage({ id: 'title.description' })}
                </p>
              </>
            }
            key="description"
          >
            {currentActivity?.description !== '<p><br></p>' && (
              <Row justify="center">
                <Col span={24} id="img-description">
                  {currentActivity?.description && (
                    <ReactQuill
                      value={currentActivity?.description}
                      readOnly
                      className="hide-toolbar ql-toolbar"
                      theme="bubble"
                    />
                  )}
                </Col>
              </Row>
            )}

            {/* <br /> */}
            {currentActivity !== null && currentActivity.hosts.length === 0 ? (
              <div></div>
            ) : (
              <div className="List-conferencistas">
                {props.orderedHost.length > 0 ? (
                  <Row>
                    <Col span={24}>
                      <Card style={{ textAlign: 'left' }}>
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
                                    <Button
                                      className="button_lista"
                                      onClick={() => getSpeakers(item._id)}
                                    >
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
                          <ModalSpeaker
                            showModal
                            eventId={props.cEvent.value._id}
                            speakerId={idSpeaker}
                            setIdSpeaker={setIdSpeaker}
                          />
                        ) : (
                          <></>
                        )}
                      </Card>
                    </Col>
                  </Row>
                ) : (
                  <></>
                )}
              </div>
            )}
          </TabPane>
        }

        {currentActivity !== null &&
          currentActivity.selected_document &&
          currentActivity.selected_document.length > 0 && (
            <TabPane
              tab={
                <>
                  <p style={{ marginBottom: '0px' }}>Documentos</p>
                </>
              }
              key="docs"
            >
              <div>
                <div style={{ marginTop: '5%', marginBottom: '5%' }}>
                  <b>Documentos:</b> &nbsp;
                  <DocumentsList data={document} />
                </div>
              </div>
            </TabPane>
          )}

        {/*  {props.tabs && (
          // && (props.tabs.surveys || props.tabs.surveys === 'true')
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
        {props.tabs && (props.tabs.games || props.tabs.games === 'true') && (
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
        )} */}
      </Tabs>
    </Card>
  )
}

const mapStateToProps = (state) => ({
  tabs: state.stage.data.tabs,
})

export default connect(mapStateToProps, null)(WithEviusContext(AditionalInformation))
