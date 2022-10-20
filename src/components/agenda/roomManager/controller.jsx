import { useContext, useEffect, useState, lazy } from 'react';
import { Card, Row, Col, Switch, Popover, Avatar, Empty, Image, Alert, Select, Form } from 'antd';
import GamepadVariantOutline from '@2fd/ant-design-icons/lib/GamepadVariantOutline';
import { getColumnSearchProps } from '../../speakers/getColumnSearch';
import { firestore } from '@helpers/firebase';
import AgendaContext from '@context/AgendaContext';
import { Suspense } from 'react';

const Header = lazy(() => import('../../../antdComponents/Header'));
const Table = lazy(() => import('../../../antdComponents/Table'));

export default function RoomController(props) {
  const { games, avalibleGames } = useContext(AgendaContext);
  const { handleTabsController, handleGamesSelected } = props;

  const [listOfGames, setListOfGames] = useState([]);
  const [updateMensaje, setUpdatedMensaje] = useState(false);
  const [columnsData, setColumnsData] = useState({});
  const [showavailableGames, setShowavailableGames] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setShowavailableGames(games);
  }, [games]);

  async function getGamesData() {
    const gamesData = [];
    const docRef = firestore.collection('gamesAvailable');
    await docRef.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        gamesData.push({ ...doc.data(), id: doc.id });
      });
    });

    if (avalibleGames?.length === 0) {
      setListOfGames(gamesData);
      handleGamesSelected('newOrUpdate', '', gamesData);
    } else if (avalibleGames?.length !== gamesData?.length) {
      setListOfGames(gamesData);
      handleGamesSelected('newOrUpdate', '', gamesData);
      setUpdatedMensaje(true);
    } else {
      setListOfGames(avalibleGames);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    (listOfGames != avalibleGames) && getGamesData();
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
            <Form.Item label={'Habilitar juegos'}>
              <Switch
                checked={games}
                onChange={(checked) => {
                  handleTabsController(checked, 'games'), setShowavailableGames(!showavailableGames);
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        {showavailableGames && (
          <>
            {updateMensaje && (
              <Alert
                showIcon
                type='warning'
                message={'El listado de juegos ha sido actualizado.'}
                description='Por favor seleccione los juegos que desee visualizar en la zona social de su lección'
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

            <Suspense fallback={<div>Cargando...</div>}>
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
            </Suspense>
          </>
        )}
      </Card>
    </>
  );
}
