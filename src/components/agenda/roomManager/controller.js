import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Switch, Popover, Avatar, Empty, Image } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import Header from '../../../antdComponents/Header';
import Table from '../../../antdComponents/Table';
import { getColumnSearchProps } from '../../speakers/getColumnSearch';
import { firestore } from '../../../helpers/firebase';

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
  const [listOfGames, setListOfGames] = useState([]);
  let [columnsData, setColumnsData] = useState({});
  const [showavailableGames, setShowavailableGames] = useState(games);
  const [isLoading, setIsLoading] = useState(true);

  async function getGamesData() {
    if (avalibleGames === undefined) {
      let gamesData = [];
      const docRef = firestore.collection('gamesAvailable');
      await docRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          gamesData.push({ ...doc.data(), id: doc.id });
        });
      });

      setListOfGames(gamesData);
    } else {
      setListOfGames(avalibleGames);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    getGamesData();
  }, [games, avalibleGames]);

  function whatIsMyStatus(item) {
    console.log('10. ', avalibleGames);
    // if (avalibleGames && avalibleGames.length > 0) {
    //   let itemFilter = avalibleGames.map((avalibleGame) => {
    //     if (avalibleGame.id === item.id) {
    //       // console.log('10. ifff');
    //       return true;
    //     } else {
    //       // console.log('10. ifff');
    //       return false;
    //     }
    //   });
    //   // console.log('10. itemFilter[0] ', itemFilter[0]);
    //   return itemFilter[0];
    // }
  }
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
        return (
          <Switch
            checkedChildren='Sí'
            unCheckedChildren='No'
            onChange={(status) => handleGamesSelected(status, item.id, listOfGames)}
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
            />
          </>
        )}
      </Card>
    </>
  );
}
