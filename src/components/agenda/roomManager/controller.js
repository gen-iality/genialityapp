import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Switch, Popover, Avatar, Empty, Image } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import Header from '../../../antdComponents/Header';
import Table from '../../../antdComponents/Table';
import { getColumnSearchProps } from '../../speakers/getColumnSearch';
import { firestore } from '../../../helpers/firebase';

export default function RoomController(props) {
  const { handleRoomState, handleTabsController, roomStatus, surveys, games } = props;
  const [listOfGames, setListOfGames] = useState([]);
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

    setListOfGames(gamesData);
    setIsLoading(false);
  }

  useEffect(() => {
    getGamesData();
  }, [games]);

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
                <Avatar icon={<InfoCircleOutlined />} />
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
      title: 'Url',
      dataIndex: 'baseUrl',
      ...getColumnSearchProps('email', columnsData),
    },
    {
      title: 'Visible',
      dataIndex: 'showGame',
      render(val, item) {
        const [publish, setPublish] = useState(item.showGame);
        const update = async (checked) => {
          const docRef = firestore.collection('gamesAvailable').doc(item.id);
          docRef
            .update({
              showGame: checked,
            })
            .then(() => {
              setPublish(checked);
            })
            .catch((error) => {
              console.error('Error updating document: ', error);
            });
        };
        return (
          <Switch
            checkedChildren='Sí'
            unCheckedChildren='No'
            onChange={update}
            checked={publish}
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
            <label className='label'>Estado de videoconferencia</label>
            <div className='select is-primary'>
              <select defaultValue={roomStatus} onChange={handleRoomState}>
                <option value=''>Sin Estado</option>
                <option value='open_meeting_room'>Conferencia Abierta</option>
                <option value='closed_meeting_room'>Conferencia no Iniciada</option>
                <option value='ended_meeting_room'>Conferencia Terminada</option>
              </select>
            </div>
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
        <Row style={{ padding: '8px 0px' }}>
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
        </Row>
        {showavailableGames && (
          <>
            {' '}
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
              // extraFn={extraField}
              // extraFnIcon={<SendOutlined />}
              // extraFnTitle='Enviar notificación a este usuario'
            />
          </>
        )}
      </Card>
    </>
  );
}
