import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Switch, Popover, Avatar, Empty, Image, Alert, Select, Form } from 'antd';
import GamepadVariantOutline from '@2fd/ant-design-icons/lib/GamepadVariantOutline';
import Header from '../../../antdComponents/Header';
import Table from '../../../antdComponents/Table';
import { getColumnSearchProps } from '../../speakers/getColumnSearch';
import { firestore } from '../../../helpers/firebase';

const { Option } = Select;

export default function RoomController(props) {
  const {
    handleRoomState,
    handleTabsController,
    handleGamesSelected,
    roomStatus,
    surveys,
    games,
    avalibleGames,
  } = props;
  console.log(props, 'propssssssss');
  const [listOfGames, setListOfGames] = useState([]);
  const [updateMensaje, setUpdatedMensaje] = useState(false);
  let [columnsData, setColumnsData] = useState({});
  const [showavailableGames, setShowavailableGames] = useState(games);
  const [isLoading, setIsLoading] = useState(true);

  async function getGamesData() {
    let gamesData = [];
    const docRef = firestore.collection('gamesAvailable');
    await docRef.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        gamesData.push({ ...doc.data(), id: doc.id });
      });
    });

    if (avalibleGames.length === 0) {
      setListOfGames(gamesData);
      handleGamesSelected('newOrUpdate', '', gamesData);
    } else if (avalibleGames.length !== gamesData.length) {
      setListOfGames(gamesData);
      handleGamesSelected('newOrUpdate', '', gamesData);
      setUpdatedMensaje(true);
    } else {
      setListOfGames(avalibleGames);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    getGamesData();
  }, [avalibleGames]);

  const columns = [
    {
      title: 'Logo',
      render: (item) => (
        <Row gutter={8}>
          <Col>
            <Popover
              placement='top'
              content={() => (
                <>
                  {item.picture ? (
                    <Image key={'img' + item._id} width={200} height={200} src={item.picture} />
                  ) : (
                    <Empty description='Imagen no encontrada' />
                  )}
                </>
              )}>
              {item.picture ? (
                <Avatar key={'img' + item._id} src={item.picture} />
              ) : (
                <Avatar icon={<GamepadVariantOutline />} />
              )}
            </Popover>
          </Col>
        </Row>
      ),
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      ...getColumnSearchProps('name', columnsData),
    },
    {
      title: 'Visible',
      dataIndex: 'showGame',
      render(val, item) {
        return (
          <Switch
            checkedChildren='Sí'
            unCheckedChildren='No'
            onChange={(status) => {
              handleGamesSelected(status, item.id, listOfGames);
              setUpdatedMensaje(false);
            }}
            checked={item.showGame}
            id={`editSwitch${item.index}`}
          />
        );
      },
    },
  ];

  return (
    <>
      <Card>
        <Row style={{ padding: '8px 0px' }}>
          <Col span={24}>
            {/* <Form.Item label={'Estado de videoconferencia'}>
              <Select defaultValue={roomStatus} onChange={handleRoomState}>
                <Option value=''>Sin Estado</Option>
                <Option value='open_meeting_room'>Conferencia Abierta</Option>
                <Option value='closed_meeting_room'>Conferencia no Iniciada</Option>
                <Option value='ended_meeting_room'>Conferencia Terminada</Option>
              </Select>
            </Form.Item> */}
            {/* <label className='label'>Estado de videoconferencia</label>
            <div className='select is-primary'>
              <select defaultValue={roomStatus} onChange={handleRoomState}>
                <option value=''>Sin Estado</option>
                <option value='open_meeting_room'>Conferencia Abierta</option>
                <option value='closed_meeting_room'>Conferencia no Iniciada</option>
                <option value='ended_meeting_room'>Conferencia Terminada</option>
              </select>
            </div> */}

            <Form.Item label={'Habilitar Juegos'}>
              <Switch
                checked={games}
                onChange={(checked) => {
                  handleTabsController(checked, 'games'), setShowavailableGames(!showavailableGames);
                }}
              />
            </Form.Item>
            {/* <Form.Item label={'Habilitar Chat'}>
              <Switch checked={chat} onChange={(checked) => handleTabsController(checked, 'chat')} />
            </Form.Item> */}
            {/* <Form.Item label={'Habilitar Encuestas'}>
              <Switch checked={surveys} onChange={(checked) => handleTabsController(checked, 'surveys')} />
            </Form.Item> */}
          </Col>
        </Row>

        {/* <Row style={{ padding: '8px 0px' }}>
          <Col xs={12} lg={8}>
            Habilitar Chat
          </Col>
          <Col xs={4} lg={2}>
            <Switch checked={chat} onChange={(checked) => handleTabsController(checked, 'chat')} />
          </Col>
        </Row> */}
        {/* <Row style={{ padding: '8px 0px' }}>
          <Col xs={12} lg={8}>
            Habilitar Encuestas
          </Col>
          <Col xs={4} lg={2}>
            <Switch checked={surveys} onChange={(checked) => handleTabsController(checked, 'surveys')} />
          </Col>
        </Row> */}
        {/* <Row style={{ padding: '8px 0px' }}>
          <Col xs={12} lg={8}>
            Habilitar Juegos
          </Col>
          <Col xs={4} lg={2}>
            <Switch
              checked={games}
              onChange={(checked) => {
                handleTabsController(checked, 'games'), setShowavailableGames(!showavailableGames);
              }}
            />
          </Col>
        </Row> */}
        {showavailableGames && (
          <>
            {updateMensaje && (
              <Alert
                showIcon
                type='warning'
                message={'El listado de juegos ha sido actualizado.'}
                description='Por favor seleccione los juegos que desee visualizar en la zona social de su actividad'
                className='animate__animated animate__bounceIn animate__faster'
                style={{
                  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  borderLeft: '5px solid #FAAD14',
                  fontSize: '14px',
                  textAlign: 'start',
                  borderRadius: '5px',
                  margin: '15px',
                }}
              />
            )}
            <Header
              title={'Juegos disponibles'}
              titleTooltip={'Seleccione los juegos que desea mostrar en la zona social'}
              description='Seleccione los juegos que desea mostrar en la zona social'
            />
            <Table
              key='index'
              list={listOfGames}
              header={columns}
              setColumnsData={setColumnsData}
              loading={isLoading}
              search
            />
          </>
        )}
      </Card>
    </>
  );
}
