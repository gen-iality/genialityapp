import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Form,
  Tabs,
  Input,
  InputNumber,
  Card,
  Row,
  Col,
  Button,
  Affix,
  Image,
  Space,
  Typography,
  List,
  Modal,
  Avatar,
} from 'antd';
import Header from '../../../antdComponents/Header';
import { useState, useEffect } from 'react';
import ImageUploaderDragAndDrop from '../../imageUploaderDragAndDrop/imageUploaderDragAndDrop';
import InputColor from '@/components/games/bingo/components/InputColor';
import ValuesTable from '@/components/games/bingo/components/ValuesTable';
import { useFormItemsTable, useApperanceFormItems, useColumnsTable } from '@/components/games/bingo/hooks';
import CreateBingo from '@/components/games/bingo/components/CreateBingo';
import { useBingo } from '@/components/games/bingo/hooks/useBingo';
import ImportModal from './components/importModal';
import Loading from '@/components/profile/loading';
import PlayBingo from './components/PlayBingo';
import SelectDimension from './components/SelectDimension';
import { BingoApi } from '@/helpers/request';
import { DispatchMessageService } from '@/context/MessageService';
export default function index({ event }: { event: {} }) {
  const {
    bingo,
    isLoading,
    onSubmit,
    changeBingoDimensions,
    deleteBingo,
    formDataBingo,
    setValuesData,
    valuesData,
    setFormDataBingo,
    isVisibleModalTable,
    setIsVisibleModalTable,
    actionEditBallotValue,
    deleteBallotValue,
    canEditBallotValue,
    editBallotValue,
    onCancelValueTable,
    getBingoListenerNotifications,
    changeBingoDimensionsNew,
    dataNotifications,
    getBingoListener,
    dataFirebaseBingo,
    saveValueData,
  } = useBingo();
  // console.log('🚀 debug - index - formDataBingo', formDataBingo?.bingo_appearance);
  const [openAndCloseImportModal, setOpenAndCloseImportModal] = useState(false);

  const formLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };
  const formItemsImageTable = useFormItemsTable();
  const formItemsApperance = useApperanceFormItems();
  const columnsTable = useColumnsTable({ actionEditBallotValue, deleteBallotValue });
  let [listUsers, setListUsers] = useState([]);

  const saveImage = async (image: any, setImag: any, name: string) => {
    setImag(image);
    setValuesData({
      ...valuesData,
      [name]: {
        value: image,
        type: 'image',
      },
    });
  };

  //List of users that have or haven't bingo
  const getListUsersWithOrWithoutBingo = async () => {
    let list = [];
    try {
      list = await BingoApi.getListUsersWithOrWithoutBingo(event?._id); /* '633d9b3101de36465758db36' */
      setListUsers(list);
    } catch (err) {
      console.log(err, 'err');
    }
  };

  //Generate bingo for all users
  const generateBingoForAllUsers = async () => {
    Modal.confirm({
      title: `¿Está seguro de que desea generar de nuevo los cartones de bingo para todos los usuarios?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Una vez generado los cartones de bingo debe esperar unos segundos para que la acción quede completa',
      okText: 'Confirmar',
      cancelText: 'Cancelar',
      onOk() {
        const onGenerate = async () => {
          DispatchMessageService({
            type: 'loading',
            key: 'loading',
            msj: 'Por favor espere mientras se generan los cartones de bingos para todos los usuarios...',
            action: 'show',
          });
          try {
            await BingoApi.generateBingoForAllUsers(event, bingo);
            DispatchMessageService({
              key: 'loading',
              action: 'destroy',
            });
            DispatchMessageService({
              type: 'success',
              msj: '¡Se generaron correctamente los cartones de bingos para todos los usuarios!',
              action: 'show',
            });
          } catch (e) {
            DispatchMessageService({
              key: 'loading',
              action: 'destroy',
            });
            DispatchMessageService({
              type: 'error',
              msj: '¡Error generando los cartones de bingos para todos los usuarios!',
              action: 'show',
            });
          }
        };
        onGenerate();
      },
    });
  };

  //Generate bingo for exclusive users
  const generateBingoForExclusiveUsers = async () => {
    Modal.confirm({
      title: `¿Está seguro de que desea generar cartones de bingo para los usuarios restantes?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Una vez generado los cartones de bingo debe esperar unos segundos para que la acción quede completa',
      okText: 'Confirmar',
      cancelText: 'Cancelar',
      onOk() {
        const onGenerate = async () => {
          try {
            DispatchMessageService({
              type: 'loading',
              key: 'loading',
              msj: 'Por favor espere mientras se generan los cartones de bingos para los usuarios restantes...',
              action: 'show',
            });
            await BingoApi.generateBingoForExclusiveUsers(event);
            DispatchMessageService({
              key: 'loading',
              action: 'destroy',
            });
            DispatchMessageService({
              type: 'success',
              msj: '¡Se generaron correctamente los cartones de bingos para los usuarios restantes!',
              action: 'show',
            });
          } catch (e) {
            DispatchMessageService({
              key: 'loading',
              action: 'destroy',
            });
            DispatchMessageService({
              type: 'error',
              msj: '¡Error generando los cartones de bingos para los usuarios restantes!',
              action: 'show',
            });
          }
        };
        onGenerate();
      },
    });
  };

  useEffect(() => {
    const unSubscribe = getBingoListenerNotifications();
    const unSubscribe2 = getBingoListener();
    getListUsersWithOrWithoutBingo();
    return () => {
      unSubscribe();
      unSubscribe2();
    };
  }, []);

  return (
    <Form onFinish={onSubmit} {...formLayout}>
      <Header
        title={'Juego Bingo'}
        description={''}
        edit={!dataFirebaseBingo?.startGame && bingo}
        back
        save={!dataFirebaseBingo?.startGame ? true : false}
        form
        remove={deleteBingo}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <>
          {bingo && (
            <Tabs defaultActiveKey={dataFirebaseBingo?.startGame ? '3' : '1'}>
              <ImportModal
                event={event}
                openAndCloseImportModal={openAndCloseImportModal}
                setOpenAndCloseImportModal={setOpenAndCloseImportModal}
                extraFields={columnsTable}
                formData={formDataBingo}
                setFormData={setFormDataBingo}
                bingo={bingo}
              />
              <Tabs.TabPane tab='Configurar Bingo' key='1' disabled={dataFirebaseBingo?.startGame}>
                <Row gutter={[16, 16]} style={{ padding: '40px' }}>
                  <Col span={24} style={{ textAlign: 'right' }}></Col>
                  <Col span={10}>
                    <Affix offsetTop={80}>
                      <Card hoverable={true} style={{ cursor: 'auto', marginBottom: '20px', borderRadius: '20px' }}>
                        <Form.Item label='Titulo'>
                          <Input
                            name='name'
                            placeholder={'Titulo del Bingo'}
                            onChange={(e) => setFormDataBingo({ ...formDataBingo, name: e.target.value })}
                            value={formDataBingo.name}
                          />
                        </Form.Item>
                        <Form.Item label='Dimensiones del cartón'>
                          <SelectDimension
                            dimensions={formDataBingo.dimensions}
                            changeBingoDimensions={changeBingoDimensions}
                          />
                        </Form.Item>
                        {/* <Form.Item label='Cantidad de cartones'>
                          <InputNumber
                            disabled
                            name='amount_of_bingo'
                            style={{ width: '100%' }}
                            value={formDataBingo.amount_of_bingo}
                            onChange={(value) => setFormDataBingo({ ...formDataBingo, amount_of_bingo: value })}
                          />
                        </Form.Item> */}
                        <Form.Item label='Reglamento'>
                          <Input.TextArea
                            autoSize={{ minRows: 5, maxRows: 8 }}
                            cols={20}
                            wrap='hard'
                            name='regulation'
                            placeholder={'Reglamento del Bingo'}
                            onChange={(e) => setFormDataBingo({ ...formDataBingo, regulation: e.target.value })}
                            value={formDataBingo.regulation}
                          />
                        </Form.Item>
                      </Card>
                    </Affix>
                  </Col>
                  <Col span={14}>
                    <ValuesTable
                      columns={columnsTable}
                      dataSource={formDataBingo.bingo_values}
                      onChangeImage={saveImage}
                      setValuesData={(values: any) => setValuesData(values)}
                      valuesData={valuesData}
                      formsPropsImg={formItemsImageTable}
                      setIsVisible={setIsVisibleModalTable}
                      isVisible={isVisibleModalTable}
                      onCancel={() => onCancelValueTable()}
                      onSave={
                        //guarda todos los datos
                        () => {
                          if (canEditBallotValue.isEdit && canEditBallotValue.id !== null) {
                            editBallotValue(canEditBallotValue.id, valuesData);
                          } else {
                            saveValueData();
                          }
                        }
                      }>
                      <Button
                        type='primary'
                        icon={<UploadOutlined />}
                        onClick={() => {
                          setOpenAndCloseImportModal(true);
                        }}>
                        Importar Valores del Bingo
                      </Button>
                    </ValuesTable>
                  </Col>
                </Row>
              </Tabs.TabPane>
              <Tabs.TabPane tab='Apariencia del cartón' key='2' disabled={dataFirebaseBingo?.startGame}>
                <Row gutter={[16, 16]} style={{ padding: '40px' }}>
                  <Col span={24}>
                    <InputColor
                      color={formDataBingo.bingo_appearance.background_color!}
                      onChange={(color: any) =>
                        setFormDataBingo({
                          ...formDataBingo,
                          bingo_appearance: {
                            ...formDataBingo.bingo_appearance,
                            background_color: color.hex,
                          },
                        })
                      }
                    />
                  </Col>
                  {formItemsApperance.map((item: any) => (
                    <Col span={8} key={item.name}>
                      <Form.Item label={item.label} name={item.name}>
                        <ImageUploaderDragAndDrop
                          imageDataCallBack={(imgUrl) =>
                            setFormDataBingo({
                              ...formDataBingo,
                              bingo_appearance: {
                                ...formDataBingo.bingo_appearance,
                                [item.name]: imgUrl,
                              },
                            })
                          }
                          imageUrl={
                            formDataBingo.bingo_appearance[item.name as keyof typeof formDataBingo.bingo_appearance]
                          }
                          width={item.width}
                          height={item.height}
                        />
                      </Form.Item>
                    </Col>
                  ))}
                </Row>
              </Tabs.TabPane>

              <Tabs.TabPane tab='Asignación de cartones' key='3' disabled={dataFirebaseBingo?.startGame}>
                <Row gutter={[16, 16]} style={{ padding: '40px' }}>
                  <Col span={24} style={{ textAlign: 'right' }}></Col>
                  <Col span={12}>
                    <Card hoverable={true} style={{ cursor: 'auto', marginBottom: '20px', borderRadius: '20px' }}>
                      <Row justify='space-between' /* align='middle' */ wrap>
                        <Typography.Title level={5}>Lista de participantes</Typography.Title>
                        <Space direction='vertical'>
                          <Button type='primary' onClick={generateBingoForAllUsers}>
                            Generar cartones a todos
                          </Button>
                          <Button type='primary' onClick={generateBingoForExclusiveUsers}>
                            Generar cartones faltantes
                          </Button>
                        </Space>
                      </Row>
                      <br />
                      <Input.Search
                        addonBefore={<UserOutlined />}
                        placeholder='Buscar participante'
                        allowClear
                        style={{ width: '100%' }}
                        /* onSearch={onSearch} */
                      />
                      <br />
                      <List
                        dataSource={listUsers}
                        style={{ marginTop: '10px' }}
                        renderItem={(user) => (
                          <List.Item
                            key={user?._id}
                            actions={[
                              <>
                                {user?.bingo ? (
                                  <CheckCircleOutlined style={{ color: 'green', fontSize: '18px' }} />
                                ) : (
                                  <CloseCircleOutlined style={{ color: 'red', fontSize: '18px' }} />
                                )}
                              </>,
                            ]}>
                            <List.Item.Meta
                              avatar={<Avatar src={user?.properties?.picture} />}
                              title={user?.properties?.names}
                              description={user?.properties?.email}
                            />
                          </List.Item>
                        )}
                      />
                    </Card>
                  </Col>
                  <Col span={12}></Col>
                </Row>
              </Tabs.TabPane>

              <Tabs.TabPane tab='Jugar Bingo' key='4'>
                <PlayBingo
                  bingoValues={formDataBingo.bingo_values}
                  event={event}
                  notifications={dataNotifications}
                  dataFirebaseBingo={dataFirebaseBingo}
                  dimensions={formDataBingo.dimensions}
                />
              </Tabs.TabPane>
            </Tabs>
          )}
          {bingo === undefined && (
            <CreateBingo
              formDataBingo={formDataBingo}
              setFormDataBingo={setFormDataBingo}
              changeBingoDimensionsNew={changeBingoDimensionsNew}
            />
          )}
        </>
      )}
    </Form>
  );
}
