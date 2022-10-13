import { UploadOutlined } from '@ant-design/icons';
import { Form, Tabs, Input, InputNumber, Card, Row, Col, Button, Affix, Image } from 'antd';
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
  const [openAndCloseImportModal, setOpenAndCloseImportModal] = useState(false);

  const formLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };
  const formItemsImageTable = useFormItemsTable();
  const formItemsApperance = useApperanceFormItems();
  const columnsTable = useColumnsTable({ actionEditBallotValue, deleteBallotValue });

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

  useEffect(() => {
    const unSubscribe = getBingoListenerNotifications();
    const unSubscribe2 = getBingoListener();
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

              <Tabs.TabPane tab='Jugar Bingo' key='3'>
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
