import { useState, useEffect, useContext } from 'react';
import { Card, Row, Col, Form, Select, Radio, Space, List, Typography, Image } from 'antd';
import AgendaContext from '@context/AgendaContext';
import WowzaStreamingPanel from './components/wowzaStreamingPanel';
import VimeoStreamingPanel from './components/vimeoStreamingPanel';

import ConferenceConfig from './components/conferenceConfig';
import PlatformZoomCreate from './components/platformZoomCreate';
import StoreAlreadyCreatedMeeting from './components/storeAlreadyCreatedMeeting';
const { Option } = Select;

export default function RoomConfig(props) {
  const [requiresCreateRoom, setRequiresCreateRoom] = useState(false);

  const {
    platform,
    host_name,
    meeting_id,
    host_id,
    roomStatus,
    setRoomStatus,
    setPlatform,
    setMeetingId,
    select_host_manual,
    activityDispatch,
    activityEdit,
    setTransmition,
    transmition,
    useAlreadyCreated,
    setUseAlreadyCreated,
  } = useContext(AgendaContext);
  const { handleClick, createZoomRoom, host_list, hasVideoconference, deleteRoom, handleChange, saveConfig } = props;

  useEffect(() => {
    setRequiresCreateRoom(platform === 'zoom' || platform === 'zoomExterno');
    if (platform === 'zoom' || platform === 'zoomExterno' || platform == 'wowza') {
      setUseAlreadyCreated(false);
    } else {
      setUseAlreadyCreated(true);
    }
  }, [platform]);

  useEffect(() => {
    if (roomStatus || meeting_id) {
      saveConfiguration();
    }
    async function saveConfiguration() {
      await saveConfig();
    }
  }, [roomStatus, meeting_id]);

  const onChange = (e) => {
    setUseAlreadyCreated(e.target.value);
  };

  if (meeting_id)
    return (
      <>
        <ConferenceConfig
          {...{
            deleteRoom,
            setRoomStatus,
            platform,
            meeting_id,
            requiresCreateRoom,
            host_name,
            roomStatus,
          }}
        />
        {
          {
            vimeo: (
              <VimeoStreamingPanel
                meeting_id={meeting_id}
                activityDispatch={activityDispatch}
                activityEdit={activityEdit}
                activity_name={props.activity_name}
                setMeetingId={setMeetingId}
                saveConfig={saveConfig}
              />
            ),
            wowza: (
              <WowzaStreamingPanel
                meeting_id={meeting_id}
                activityDispatch={activityDispatch}
                activityEdit={activityEdit}
                activity_name={props.activity_name}
                setMeetingId={setMeetingId}
                saveConfig={saveConfig}
              />
            ),
          }[platform]
        }
      </>
    );

  /**
   * Creación de una conferencia
   */

  /* console.log('GENERAL DATA =>>', {
    platform: platform,
    host_name: host_name,
    meeting_id: meeting_id,
    hasVideoconference: hasVideoconference,
  }); */
  return (
    <>
      <Form onFinish={handleClick} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
        {!meeting_id && (
          <Row gutter={24}>
            <Col span={8}>
              {/**Selección plataforma de la conferencia */}
              <Form.Item
                label={'Proveedor de transmisión'}
                tooltip={{
                  /* placement: 'bottomLeft', */
                  title: (
                    <Typography.Text style={{ color: '#fff' }}>
                      Canal o red social basada en videos, permite compartir y almacenar videos digitales para que los
                      usuarios comenten en la página de cada uno de ellos. Los usuarios deben estar registrados para
                      subir videos, crear su perfil y realizar otras configuraciones.
                    </Typography.Text>
                  ),
                }}>
                <Select defaultValue={platform} value={platform} name='platform' onChange={(e) => setPlatform(e)}>
                  <Option value='wowza'>
                    GEN streaming <Typography.Text type='secondary'>(recomendado)</Typography.Text>
                  </Option>
                  <Option value='vimeo'>Vimeo</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={'Origen de transmisión'}
                tooltip={{
                  /* placement: 'bottomLeft', */
                  title: (
                    <Typography.Text style={{ color: '#fff' }}>
                      Herramienta de transmisión en directo (en vivo) que emite en los canales o red social de tu
                      preferencia que transporta el contenido audiovisual como datos entre codificador y una plataforma
                      de streaming.
                    </Typography.Text>
                  ),
                }}>
                <List itemLayout='horizontal' bordered={false}>
                  <List.Item
                    style={{
                      borderRadius: '10px',
                      border: '1px solid lightgray',
                      padding: '10px',
                      marginBottom: '10px',
                    }}
                    actions={[
                      <Radio checked={transmition === 'EviusMeet'} onChange={(e) => setTransmition('EviusMeet')} />,
                    ]}>
                    <List.Item.Meta title={<b>GEN Meet</b>} />
                  </List.Item>
                  <List.Item
                    style={{
                      borderRadius: '10px',
                      border: '1px solid lightgray',
                      padding: '10px',
                      marginBottom: '10px',
                    }}
                    actions={[
                      <Radio checked={transmition === 'StreamYard'} onChange={(e) => setTransmition('StreamYard')} />,
                    ]}>
                    <List.Item.Meta title={<b>StreamYard</b>} />
                  </List.Item>
                  <List.Item
                    style={{
                      borderRadius: '10px',
                      border: '1px solid lightgray',
                      padding: '10px',
                    }}
                    actions={[<Radio checked={transmition === 'RTMP'} onChange={(e) => setTransmition('RTMP')} />]}
                  >
                    <List.Item.Meta title={<b>RTMP</b>} />
                  </List.Item>
                </List>
              </Form.Item>
            </Col>
            <Col span={16}>
              <Card style={{ borderRadius: '10px' }} bordered>
                <Row justify='center' align='middle' gutter={24}>
                  <Col span={16}>
                    <Typography.Title level={3}>
                      {'Crea una transmisión con '}{' '}
                      {transmition === 'EviusMeet' ? 'todo el poder de GEN.iality' : transmition}{' '}
                    </Typography.Title>
                    <Typography.Text type='secondary'>
                      <ul>
                        <li>
                          {transmition === 'EviusMeet'
                            ? 'Somos responsables de tus vídeos'
                            : 'No somos responsables de tus vídeos'}
                        </li>
                        <li>
                          {transmition === 'EviusMeet'
                            ? 'Cuentas con el mejor soporte'
                            : transmition === 'StreamYard'
                            ? 'Debes tener tu propia cuenta paga para acceder a los beneficios de la misma'
                            : 'Debes tener tu propia cuenta'}
                        </li>
                      </ul>
                    </Typography.Text>
                    <Space direction='vertical'>
                      {/** create a meeting or reuse and old one */}
                      {/** StoreAlreadyCreatedMeeting */}
                      {useAlreadyCreated ? (
                        <StoreAlreadyCreatedMeeting {...{ setMeetingId, meeting_id }} />
                      ) : (
                        <>
                          {
                            (console.log('debug ', platform),
                            {
                              vimeo: (
                                <VimeoStreamingPanel
                                  meeting_id={meeting_id}
                                  activityDispatch={activityDispatch}
                                  activityEdit={activityEdit}
                                  activity_name={props.activity_name}
                                  setMeetingId={setMeetingId}
                                  saveConfig={saveConfig}
                                />
                              ),
                              wowza: (
                                <WowzaStreamingPanel
                                  meeting_id={meeting_id}
                                  activityDispatch={activityDispatch}
                                  activityEdit={activityEdit}
                                  activity_name={props.activity_name}
                                  setMeetingId={setMeetingId}
                                  saveConfig={saveConfig}
                                />
                              ),
                              zoom: (
                                <PlatformZoomCreate
                                  {...{
                                    createZoomRoom,
                                    useAlreadyCreated,
                                    requiresCreateRoom,
                                    hasVideoconference,
                                    select_host_manual,
                                    handleChange,
                                    host_id,
                                    host_list,
                                  }}
                                />
                              ),
                              zoomExterno: (
                                <PlatformZoomCreate
                                  {...{
                                    createZoomRoom,
                                    useAlreadyCreated,
                                    requiresCreateRoom,
                                    hasVideoconference,
                                    select_host_manual,
                                    handleChange,
                                    host_id,
                                    host_list,
                                  }}
                                />
                              ),
                            }[platform])
                          }
                        </>
                      )}
                    </Space>
                  </Col>
                  <Col span={8}>
                    <Image
                      src={
                        transmition === 'StreamYard'
                          ? 'https://i.ytimg.com/an/DFUPaTuYL2U/15307377074422518640_mq.jpg?v=609d88d4'
                          : transmition === 'RTMP'
                          ? 'https://intinor.com/wp-content/uploads/2017/01/RTMP.png'
                          : 'https://evius.co/wp-content/uploads/2021/03/logo_3.png'
                      }
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        )}
      </Form>
    </>
  );
}
