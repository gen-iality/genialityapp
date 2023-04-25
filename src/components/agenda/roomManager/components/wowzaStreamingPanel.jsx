import { useState, useEffect, useContext } from 'react';
import {
  Button,
  Spin,
  Alert,
  Typography,
  Space,
  Input,
  Tooltip,
  message,
  Row,
  Col,
  Card,
  Tabs,
  Dropdown,
  Menu,
  Badge,
} from 'antd';
import { CopyFilled, CheckCircleFilled } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import WOWZAPlayer from '@components/livetransmision/WOWZAPlayer';
import {
  createLiveStream,
  getLiveStream,
  stopLiveStream,
  startLiveStream,
  getLiveStreamStatus,
  getLiveStreamStats,
  ResetLiveStream,
} from '../../../../adaptors/wowzaStreamingAPI';
import { realTimeviuschat } from '@helpers/firebase';
import { useCurrentUser } from '@context/userContext';
import AgendaContext from '@context/AgendaContext';
import StoreAlreadyCreatedMeeting from '../components/storeAlreadyCreatedMeeting';
import Loading from '../../../profile/loading';
import { CurrentEventContext } from '@context/eventContext';
import { DispatchMessageService } from '@context/MessageService';

const WowzaStreamingPanel = ({
  meeting_id,
  created_action,
  stopped_action,
  activityDispatch,
  activityEdit,
  activity_name,
  setMeetingId,
  saveConfig,
}) => {
  //Link para eviusmeet dónde se origina el video
  const eviusmeets = `https://stagingeviusmeet.netlify.app/prepare`;
  const cUser = useCurrentUser();
  /* console.log('debug ', meeting_id); */
  const [ livestreamStatus, setLivestreamStatus ] = useState(null);
  const [ livestreamStats, setLivestreamStats ] = useState(null);
  const [ linkRolAdmin, setLinkRolAdmin ] = useState(null);
  const [ linkRolProductor, setLinkRolProductor ] = useState(null);
  const [ linkRolAsistente, setLinkRolAsistente ] = useState(null);
  const [ webHookStreamStatus, setWebHookStreamStatus ] = useState(null);
  const [ copySuccessProductor, setCopySuccessProductor ] = useState(false);
  const [ copySuccessAsistente, setCopySuccessAsistente ] = useState(false);
  const [ copySuccessURL, setCopySuccessURL ] = useState(false);
  const [ copySuccessClave, setCopySuccessClave ] = useState(false);
  const eventContext = useContext(CurrentEventContext);
  const { transmition, removeAllRequest } = useContext(AgendaContext);
  const refActivity = `request/${eventContext.value?._id}/activities/${activityEdit}`;
  const [ streamAlreadyCreated, setStreamAlreadyCreated ] = useState(false);
  const [ timerId, setTimerId ] = useState(null);

  const queryClient = useQueryClient();
  const livestreamQuery = useQuery([ 'livestream', meeting_id ], () => getLiveStream(meeting_id));

  useEffect(() => {
    if (livestreamQuery && livestreamQuery.data) {
      const { names, email, picture } = cUser.value;
      const rtmplink = livestreamQuery.data.source_connection_information;
      const linkAdmin =
        eviusmeets +
        `?meetingId=${activityEdit}&rtmp=${rtmplink.primary_server}/${rtmplink.stream_name
        }&rol=1&username=${names}&email=${email}&photo=${picture ? picture : ''}`;
      const linkProductor =
        eviusmeets + `?meetingId=${activityEdit}&rtmp=${rtmplink.primary_server}/${rtmplink.stream_name}&rol=1`;
      const linkAsistente = eviusmeets + `?meetingId=${activityEdit}`;
      setLinkRolAdmin(linkAdmin);
      setLinkRolProductor(linkProductor);
      setLinkRolAsistente(linkAsistente);
    }
  }, [ livestreamQuery.data ]);

  useEffect(() => {
    const realTimeRef = realTimeviuschat.ref('meets/' + activityEdit + '/streamingStatus');

    const unsubscribe = realTimeRef.on('value', (snapshot) => {
      const data = snapshot?.val();
      setWebHookStreamStatus(data?.status);
    });

    return () => {
      realTimeRef.off('value', unsubscribe);
    };
  }, []);

  useEffect(() => {
    if (meeting_id) {
      initializeStream();
    } else {
      clearTimeout(timerId);
    }
    async function initializeStream() {
      try {
        await saveConfig(1);
        await executer_startMonitorStatus(meeting_id);
      } catch (e) {
        await executer_startMonitorStatus(meeting_id);
        /*console.log('AL TRAER EL MEETING==>', e);
        let livestreamInitial = { state: 'Finished' };
        setLivestreamStatus(livestreamInitial);*/
      }
    }
  }, [ meeting_id ]);

  const executer_createStream = useMutation(() => createLiveStream(activity_name), {
    onSuccess: (data) => {
      queryClient.setQueryData('livestream', data);
      activityDispatch({ type: 'meeting_created', meeting_id: data.id });
      // Invalidate and refetch
      //queryClient.invalidateQueries('todos')
    },
  });

  const executer_startMonitorStatus = async () => {
    let live_stream_status = null;
    let live_stream_stats = null;
    try {
      live_stream_status = await getLiveStreamStatus(meeting_id);
      setLivestreamStatus(live_stream_status);

      live_stream_stats = await getLiveStreamStats(meeting_id);
      setLivestreamStats(live_stream_stats);
    } catch (e) { }
    const timer_id = setTimeout(executer_startMonitorStatus, 5000);
    setTimerId(timer_id);
    if (live_stream_status && live_stream_status?.state == 'stopped') {
      clearTimeout(timer_id);
    }
  };

  const executer_startStream = async () => {
    const liveStreamresponse = await startLiveStream(meeting_id);
    executer_startMonitorStatus();
    //inicia el monitoreo
  };

  const executer_stopStream = async () => {
    await removeAllRequest(refActivity);
    const liveStreamresponse = await stopLiveStream(meeting_id);
    queryClient.setQueryData('livestream', null);
  };

  function success() {
    DispatchMessageService({
      type: 'success',
      msj: 'URL copiada satisfactoriamente!',
      action: 'show',
    });
  }

  function copyToClipboard(type) {
    if (type === 'Productor') {
      navigator.clipboard.writeText(linkRolProductor);
      success();
      setCopySuccessProductor(true);
    } else if (type === 'Asistente') {
      navigator.clipboard.writeText(linkRolAsistente);
      success();
      setCopySuccessAsistente(true);
    } else if (type === 'URL') {
      navigator.clipboard.writeText(livestreamQuery.data.source_connection_information.primary_server);
      success();
      setCopySuccessURL(true);
    } else if (type === 'Clave') {
      navigator.clipboard.writeText(livestreamQuery.data.source_connection_information.stream_name);
      success();
      setCopySuccessClave(true);
    }
    setTimeout(() => {
      setCopySuccessProductor(false);
      setCopySuccessAsistente(false);
      setCopySuccessURL(false);
      setCopySuccessClave(false);
    }, 5000);
  }

  if (!livestreamQuery.data)
    return (
      <>
        <Spin tip="Loading..." spinning={executer_createStream.isLoading}>
          <Space direction="horizontal" wrap>
            <Button
              onClick={() => {
                executer_createStream.mutate();
                setStreamAlreadyCreated(false);
              }}>
              Crear nueva transmisión
            </Button>
            <Dropdown
              placement="bottomCenter"
              overlay={
                <Menu>
                  <Menu.Item onClick={() => setStreamAlreadyCreated(true)}>
                    Tengo ya una transmisión que quiero usar
                  </Menu.Item>
                </Menu>
              }>
              <Button>Avanzado</Button>
            </Dropdown>
          </Space>
        </Spin>
        <br />
        <br />
        {streamAlreadyCreated && <StoreAlreadyCreatedMeeting {...{ setMeetingId, meeting_id }} />}

        {executer_createStream.isError && (
          <>
            <Alert
              message={
                'An error occurred:' +
                executer_createStream.error.message +
                ' ' +
                executer_createStream.error?.response?.data?.meta?.message
              }
              type="error"
              showIcon
              closable
            />
          </>
        )}
      </>
    );

  return (
    <>
      <br />
      <Card bordered style={{ borderRadius: '10px' }}>
        <Row gutter={[ 16, 16 ]}>
          <Col span={24}>
            {livestreamStatus?.state === 'stopped' ? (
              <Button
                onClick={() => {
                  executer_startStream();
                }}>
                Iniciar transmisión
              </Button>
            ) : livestreamStatus?.state === 'started' ? (
              <Row justify="space-between">
                <>
                  {linkRolAdmin && transmition !== 'RTMP' && (
                    <Button
                      type="primary"
                      href={
                        transmition == 'StreamYard'
                          ? 'https://streamyard.com/teams/nqMJDiHJSBnP5E7bmGs7JyZV/broadcasts'
                          : linkRolAdmin
                      }
                      target="_blank">
                      {transmition && 'Ingresar a ' + transmition + ' para transmitir'}
                    </Button>
                  )}
                  {linkRolAdmin && transmition === 'RTMP' && <Typography.Title level={5}>RTMP</Typography.Title>}
                </>
                <Space>
                  <Button
                    onClick={() => {
                      executer_stopStream();
                    }}
                    danger
                    type="primary">
                    Detener transmisión
                  </Button>

                  <Button type="ghost" onClick={() => ResetLiveStream(meeting_id)}>
                    Reiniciar transmisión
                  </Button>
                </Space>
              </Row>
            ) : (
              <>
                <Spin />
                Iniciando transmisión...
              </>
            )}
          </Col>
        </Row>
      </Card>
      <br />
      <Card bordered style={{ borderRadius: '10px' }}>
        <Row gutter={[ 16, 16 ]}>
          <Col span={10}>
            {livestreamStatus?.state === 'starting' ? (
              <Loading />
            ) : (
              <>
                {livestreamStats?.connected.value === 'Yes' ? (
                  <Badge.Ribbon text="En transmisión" color="red">
                    <WOWZAPlayer meeting_id={meeting_id} thereIsConnection={livestreamStats?.connected.value} />
                  </Badge.Ribbon>
                ) : (
                  <WOWZAPlayer meeting_id={meeting_id} thereIsConnection={livestreamStats?.connected.value} />
                )}
              </>
            )}

            {/* starting */}
          </Col>
          <Col span={14}>
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="Datos" key="1">
                <Typography.Text type="secondary">
                  Nombre:
                  <br />
                </Typography.Text>
                <Typography.Text>
                  <b>{livestreamQuery.data.name}</b> <br />
                </Typography.Text>
                <Typography.Text type="secondary">
                  ID transmisión:
                  <br />
                </Typography.Text>
                <Typography.Text>
                  <b>{livestreamQuery.data.id}</b> <br />
                </Typography.Text>
                <Typography.Text type="secondary">
                  Estado de la transmisión:
                  <br />
                </Typography.Text>
                <Typography.Text>
                  <Space>
                    <b>
                      {livestreamStatus?.state !== 'started' && livestreamStatus?.state !== 'stopped' && <Spin />}
                      {livestreamStatus?.state}
                    </b>
                  </Space>{' '}
                  <br />
                </Typography.Text>
                <Typography.Text type="secondary">
                  Origin conectado:
                  <br />
                </Typography.Text>
                <Typography.Text>
                  <Space>
                    <b>{livestreamStats && livestreamStats?.connected && <>{livestreamStats?.connected.value}</>}</b>
                  </Space>{' '}
                  <br />
                </Typography.Text>
                <Typography.Text type="secondary">
                  Estado del origen:
                  <br />
                </Typography.Text>
                <Typography.Text>
                  <Space>
                    <b>{livestreamStats && livestreamStats?.connected && <>{livestreamStats?.connected.status}</>}</b>
                  </Space>{' '}
                  <br />
                </Typography.Text>
                <Typography.Text type="secondary">
                  Información: <br />
                </Typography.Text>
                <Typography.Text>
                  <Space>
                    <b>{livestreamStats && livestreamStats?.connected && <>{livestreamStats?.connected.text}</>}</b>
                  </Space>{' '}
                  <br />
                </Typography.Text>
              </Tabs.TabPane>
              {/* { transmition === 'EviusMeet' && ( */}
              {livestreamStatus?.state !== 'stopped' && (
                <Tabs.TabPane tab="RTMP" key="2">
                  {livestreamStatus?.state === 'started' ? (
                    <>
                      <Typography.Text>
                        <b>RTMP url:</b>
                      </Typography.Text>
                      <Input.Group compact>
                        <Input
                          style={{ width: 'calc(100% - 31px)' }}
                          disabled
                          value={livestreamQuery.data.source_connection_information.primary_server}
                        />
                        <Tooltip title="Copiar RTMP url">
                          <Button
                            onClick={() => copyToClipboard('URL')}
                            icon={
                              copySuccessURL ? (
                                <CheckCircleFilled style={{ color: '#52C41A' }} />
                              ) : (
                                <CopyFilled style={{ color: '#0089FF' }} />
                              )
                            }
                          />
                        </Tooltip>
                      </Input.Group>{' '}
                      <br />
                      <Typography.Text>
                        <b>RTMP clave:</b>
                      </Typography.Text>
                      <Input.Group compact>
                        <Input
                          style={{ width: 'calc(100% - 31px)' }}
                          disabled
                          value={livestreamQuery.data.source_connection_information.stream_name}
                        />
                        <Tooltip title="Copiar RTMP clave">
                          <Button
                            onClick={() => copyToClipboard('Clave')}
                            icon={
                              copySuccessClave ? (
                                <CheckCircleFilled style={{ color: '#52C41A' }} />
                              ) : (
                                <CopyFilled style={{ color: '#0089FF' }} />
                              )
                            }
                          />
                        </Tooltip>
                      </Input.Group>
                    </>
                  ) : (
                    <Spin>Cargando</Spin>
                  )}
                </Tabs.TabPane>
              )}
              {/* )} */}
            </Tabs>
          </Col>
        </Row>
      </Card>
      <br />
      {livestreamStatus?.state === 'started' && transmition === 'EviusMeet' && (
        <Card bordered style={{ borderRadius: '10px' }}>
          <Row gutter={[ 16, 16 ]}>
            <Col span={24}>
              {linkRolProductor && (
                <>
                  <Typography.Text>
                    <b>URL para host:</b>
                  </Typography.Text>
                  <Input.Group compact>
                    <Input style={{ width: 'calc(100% - 31px)' }} disabled value={linkRolProductor} />
                    <Tooltip title="Copiar productor url">
                      <Button
                        onClick={() => copyToClipboard('Productor')}
                        icon={
                          copySuccessProductor ? (
                            <CheckCircleFilled style={{ color: '#52C41A' }} />
                          ) : (
                            <CopyFilled style={{ color: '#0089FF' }} />
                          )
                        }
                      />
                    </Tooltip>
                  </Input.Group>{' '}
                  <br />
                </>
              )}
              {linkRolAsistente && (
                <>
                  <Typography.Text>
                    <b>URL para participantes:</b>
                  </Typography.Text>
                  <Input.Group compact>
                    <Input style={{ width: 'calc(100% - 31px)' }} disabled value={linkRolAsistente} />
                    <Tooltip title="Copiar asistente url">
                      <Button
                        onClick={() => copyToClipboard('Asistente')}
                        icon={
                          copySuccessAsistente ? (
                            <CheckCircleFilled style={{ color: '#52C41A' }} />
                          ) : (
                            <CopyFilled style={{ color: '#0089FF' }} />
                          )
                        }
                      />
                    </Tooltip>
                  </Input.Group>
                </>
              )}
            </Col>
          </Row>
        </Card>
      )}
    </>
  );
};
export default WowzaStreamingPanel;
