import { useState, useEffect } from 'react';

import { Button, Input, Row, Form, Modal, Col, Card, message, Alert, Table, Select, Tooltip, Divider } from 'antd';
import {
  ExclamationCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { handleRequestError } from '../../helpers/utils';
import { firestore } from '../../helpers/firebase';
import { SketchPicker } from 'react-color';
import Header from '../../antdComponents/Header';
import { DispatchMessageService } from '../../context/MessageService';

const { Option } = Select;
const { confirm } = Modal;

const Stands = (props) => {
  const [standsList, setStands] = useState();
  const [editStands, setEditStands] = useState(false);
  const [selectedStand, setSelectedStand] = useState(null);
  const [nameStand, setNameStand] = useState(null);
  const [documentEmpresa, setDocumentEmpresa] = useState(null);
  const [visualization, setVisualization] = useState('list');
  const [config, setconfig] = useState(null);
  const [colorStand, setColorStand] = useState('#2C2A29');
  const [viewModalColor, setViewModalColor] = useState(false);
  const [noValid, setNoValid] = useState(false);

  let columns = [
    {
      title: 'Nombre',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: 'Valor',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
      render(key, record) {
        return (
          <input
            type='color'
            style={{ width: '60%', height: 31, marginTop: 1 }}
            value={record.color}
            disabled
            onClick={() => null}
            onChange={null}
          />
        );
      },
    },
    {
      title: 'Opciones',
      dataIndex: 'id',
      key: 'id',
      render(key, record) {
        return (
          <>
            <Row wrap gutter={[8, 8]}>
              <Col>
                <Tooltip placement='topLeft' title='Editar'>
                  <Button
                    key={`editAction${record.index}`}
                    id={`editAction${record.index}`}
                    onClick={() => {
                      setEditStands(true);
                      setViewModalColor(false);
                      setNoValid(false);
                      obtenerStand(record);
                    }}
                    icon={<EditOutlined />}
                    type='primary'
                    size='small'
                  />
                </Tooltip>
              </Col>
              <Col>
                <Tooltip placement='topLeft' title='Eliminar'>
                  <Button
                    key={`removeAction${record.index}`}
                    id={`removeAction${record.index}`}
                    onClick={() => {
                      deleteStand(key);
                    }}
                    icon={<DeleteOutlined />}
                    type='danger'
                    size='small'
                  />
                </Tooltip>
              </Col>
            </Row>
          </>
        );
      },
    },
  ];

  function handleChange(value) {
    setVisualization(value);
  }

  async function obtenerConfig() {
    let config = await firestore
      .collection('event_companies')
      .doc(props.event._id)
      .get();
    setconfig(config.data());
    if (config.data().config) {
      setVisualization(config.data().config.visualization);
    }
  }

  async function saveConfiguration() {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere mientras se guarda la información...',
      action: 'show',
    });
    await firestore
      .collection('event_companies')
      .doc(props.event._id)
      .set(
        {
          config: { visualization: visualization },
        },
        { merge: true }
      );
    DispatchMessageService({
      key: 'loading',
      action: 'destroy',
    });
    DispatchMessageService({
      type: 'success',
      msj: 'Configuración guardada correctamente!',
      action: 'show',
    });
  }

  const editStand = async () => {
    if (nameStand !== '' && nameStand !== null) {
      let list = standsList;
      let selectedStandEdit =
        selectedStand !== null
          ? { ...selectedStand, label: nameStand, value: nameStand, color: colorStand }
          : { label: nameStand, value: nameStand, id: standsList.length, color: colorStand };
      selectedStand !== null ? (list[selectedStand.id] = selectedStandEdit) : list.push(selectedStandEdit);
      let modifyObject = { ...documentEmpresa, stand_types: list };
      await actualizarData(modifyObject);
      DispatchMessageService({
        type: 'success',
        msj: 'Información guardada correctamente!',
        action: 'show',
      });

      handleCancel();
    } else {
      DispatchMessageService({
        type: 'error',
        msj: 'Información inválida!',
        action: 'show',
      });
      setNoValid(true);
    }
  };

  async function actualizarData(data) {
    await firestore
      .collection('event_companies')
      .doc(props.event._id)
      .set(data);
    obtenerStands();
  }

  const handleClickSelectColor = () => {
    setViewModalColor(true);
  };

  async function deleteStand(id) {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere mientras se borra la información...',
      action: 'show',
    });
    confirm({
      title: `¿Está seguro de eliminar la información?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Una vez eliminado, no lo podrá recuperar',
      okText: 'Borrar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        const onHandlerRemove = async () => {
          try {
            let list = standsList;
            list = list.filter((stand) => stand.id !== id);
            let modifyObject = { ...documentEmpresa, stand_types: list };
            await actualizarData(modifyObject);
            DispatchMessageService({
              key: 'loading',
              action: 'destroy',
            });
            DispatchMessageService({
              type: 'success',
              msj: 'Se eliminó la información correctamente!',
              action: 'show',
            });
          } catch (e) {
            DispatchMessageService({
              key: 'loading',
              action: 'destroy',
            });
            DispatchMessageService({
              type: 'error',
              msj: handleRequestError(e).message,
              action: 'show',
            });
          }
        };
        onHandlerRemove();
      },
    });
  }

  function obtenerStand(record) {
    if (record != null) {
      if (record.color) {
        setColorStand(record.color);
      } else {
        setColorStand('');
      }
      setSelectedStand(record);
      setNameStand(record.value);
    } else {
      setNameStand(null);
      setSelectedStand(null);
    }
  }

  const HandlerEditText = (e) => {
    const value = e.target.value;
    setNameStand(value);
    if (e.target.value.length > 0) {
      setNoValid(false);
    }
  };

  const handleCancel = () => {
    setEditStands(false);
    setNoValid(false);
  };

  useEffect(() => {
    obtenerConfig();
    obtenerStands();
  }, []);

  const obtenerStands = () => {
    firestore
      .collection('event_companies')
      .doc(props.event._id)
      .get()
      .then((resp) => {
        setDocumentEmpresa(resp.data());
        let standTypesOptions = resp.data().stand_types;
        let listStands = [];
        standTypesOptions &&
          standTypesOptions.map((stands, indx) => {
            stands.label && stands.label.label !== null && listStands.push({ ...stands, id: indx });
          });
        setStands(listStands);
      });
  };

  return (
    <div>
      <Header title={'Configuración'} back />

      <Row justify='center' wrap gutter={12}>
        <Col span={20}>
          <Alert
            message={
              'Visualización: Permite cambiar la forma de visualizar las empresas en la sección de ferias, por defecto se muestra en forma de listado'
            }
          />
          <br />
          <Row justify='space-between'>
            <p>Visualización: </p>
            <Select value={visualization} style={{ width: 220, marginLeft: 30 }} onChange={handleChange}>
              <Option value='list'>Listado</Option>
              <Option value='stand'>Stand</Option>
            </Select>
            <Button onClick={() => saveConfiguration()} type='primary' icon={<SaveOutlined />}>
              {'Guardar'}
            </Button>
          </Row>

          <Divider />

          <Card
            title='Tipos de stands'
            extra={
              <Button
                onClick={() => {
                  setEditStands(true);
                  setColorStand('#2C2A29');
                  setViewModalColor(false);
                  setNoValid(false);
                  obtenerStand(null);
                }}
                type='primary'
                icon={<PlusCircleOutlined />}>
                {'Agregar'}
              </Button>
            }
            bordered={false}>
            <Table columns={columns} dataSource={standsList} pagination={false} rowKey='_id' />

            <Modal
              title={selectedStand ? 'Editar stand' : 'Agregar stand'}
              visible={editStands}
              onOk={editStand}
              onCancel={handleCancel}>
              <Form>
                <Form.Item
                  validateStatus={!noValid ? 'success' : 'error'}
                  label={<span style={{ width: 70 }}>Nombre</span>}>
                  <Input value={nameStand && nameStand} onChange={(e) => HandlerEditText(e)} />
                  {noValid && <small style={{ color: 'red' }}>Ingrese un nombre válido</small>}
                </Form.Item>
                <Form.Item label={<span style={{ width: 70 }}>Color</span>}>
                  <div onClick={() => handleClickSelectColor()}>
                    <input
                      type='color'
                      style={{ marginRight: '3%', width: '8%', height: 31, marginTop: 1 }}
                      value={colorStand}
                      disabled
                      onClick={() => null}
                      onChange={null}
                    />
                    <Button> {!selectedStand ? 'Seleccionar' : 'Escoger'}</Button>
                  </div>
                  {viewModalColor && (
                    <div
                      style={{
                        position: 'fixed',
                        top: '270px',
                        right: '0px',
                        bottom: '0px',
                        left: '600px',
                        zIndex: 10000,
                      }}>
                      <Card size='small' style={{ width: '250px' }}>
                        <SketchPicker
                          color={colorStand}
                          onChangeComplete={(color) => {
                            setColorStand(color.hex);
                          }}
                        />
                        <Button style={{ marginTop: 20 }} onClick={() => setViewModalColor(false)}>
                          {' '}
                          Aceptar
                        </Button>
                      </Card>
                    </div>
                  )}
                </Form.Item>
              </Form>
            </Modal>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Stands;
