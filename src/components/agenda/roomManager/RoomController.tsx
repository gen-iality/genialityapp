import { useContext, useEffect, useState, lazy, useCallback } from 'react';
import { Card, Row, Col, Switch, Popover, Avatar, Empty, Image, Alert, Select, Form } from 'antd';
import GamepadVariantOutline from '@2fd/ant-design-icons/lib/GamepadVariantOutline';
import { getColumnSearchProps } from '@components/speakers/getColumnSearch';
import { firestore } from '@helpers/firebase';
import AgendaContext from '@context/AgendaContext';
import { Suspense } from 'react';

const Header = lazy(() => import('../../../antdComponents/Header'));
const Table = lazy(() => import('../../../antdComponents/Table'));

/**
 * TODO: check that switch component can change the current game status
 */
export default function RoomController() {
  // const [loadedGameList, setLoadedGameList] = useState([]);
  const [isAvailableChanges, setIsAvailableChanges] = useState(false);
  const [columnsData, setColumnsData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [columns, setColumns] = useState<any[]>([])

  const agendaContext = useContext(AgendaContext);
  const {
    games: isGamesActived,
    avalibleGames: availableGames,
  } = agendaContext;

  const requestGames = async() => {
    const newAvailableGames: any[] = [];
    const docRef = firestore.collection('gamesAvailable');
    const querySnapshot = await docRef.get() // async does not bite)))

    querySnapshot.forEach((doc) => {
      newAvailableGames.push({ ...doc.data(), id: doc.id })
    })

    // Load the available games
    agendaContext.setAvailableGames(newAvailableGames)
    setIsAvailableChanges(true)

    setIsLoading(false);
  }

  const updateStatusOfGame = (status: boolean, gameId: string, allGames: any[]) => {
    console.debug('allGames', allGames)
    const newData = allGames.map((game: any) => {
      if (game.id === gameId) return { ...game, showGame: status };
      else return { ...game };
    });
    console.debug('new allGames', newData)
    agendaContext.setAvailableGames(newData);
    setIsAvailableChanges(false);
  }

  // We need to load the game list
  useEffect(() => {
    requestGames()
  }, [])

  // If the games status changes, we have to update the config
  useEffect(() => agendaContext.saveConfig(), [isGamesActived])

  // If the game availabled list changes, we have to update the config
  useEffect(() => {
    if (isLoading) return
    agendaContext.saveConfig()
  }, [availableGames])

  useEffect(() => {
    const newColumns: any[] = [
      {
        key: 'logo',
        title: 'Logo',
        render: (value: any, item: any) => (
          <Row gutter={8}>
            <Col>
              <Popover
                placement="top"
                content={() => (
                  <>
                    {item.picture ? (
                      <Image key={`img ${item._id}`} width={200} height={200} src={item.picture} />
                    ) : (
                      <Empty description="Imagen no encontrada" />
                    )}
                  </>
                )}>
                {item.picture ? (
                  <Avatar key={`img ${item._id}`} src={item.picture} />
                ) : (
                  <Avatar icon={<GamepadVariantOutline />} />
                )}
              </Popover>
            </Col>
          </Row>
        ),
      },
      {
        key: 'name',
        title: 'Nombre',
        dataIndex: 'name',
        ...getColumnSearchProps('name', columnsData),
      },
      {
        key: 'visibility',
        title: 'Visible',
        dataIndex: 'showGame',
        render(value: any, item: any) {
          return (
            <Switch
              checkedChildren="Sí"
              unCheckedChildren="No"
              onChange={(status) => updateStatusOfGame(status, item.id, availableGames)}
              checked={item.showGame}
              id={`editSwitch ${item.index}`}
            />
          );
        },
      },
    ];

    setColumns(newColumns)
  }, [availableGames])

  return (
    <Card>
      <Row style={{ padding: '8px 0px' }}>
        <Col span={24}>
          <Form.Item label="Habilitar juegos">
            <Switch
              checked={isGamesActived}
              onChange={(isChecked) => agendaContext.setGames(isChecked)}
            />
          </Form.Item>
        </Col>
      </Row>

      {isGamesActived && (
        <>
          {isAvailableChanges && (
            <Alert
              showIcon
              type="warning"
              message="El listado de juegos ha sido actualizado."
              description="Por favor seleccione los juegos que desee visualizar en la zona social de su lección"
              className="animate__animated animate__bounceIn animate__faster"
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
              title="Juegos disponibles"
              titleTooltip="Seleccione los juegos que desea mostrar en la zona social"
              description="Seleccione los juegos que desea mostrar en la zona social"
            />
            <Table
              key="index"
              list={availableGames}
              header={columns}
              setColumnsData={setColumnsData}
              loading={isLoading}
              search
            />
          </Suspense>
        </>
      )}
    </Card>
  );
}
