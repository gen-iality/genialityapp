import { BadgeApi } from '../../helpers/request';
import Header from '@/antdComponents/Header';
import { Form, Row, Col, Button, Space, Modal, Select, Typography, message, Table, Card, Tooltip } from 'antd';
import { useState, useEffect, useRef } from 'react';


import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  PlusCircleOutlined,
  SaveOutlined,
  PrinterOutlined,
  QrcodeOutlined,
} from '@ant-design/icons';
import ModalAdd from './components/ModalAdd';
import { getInitialValues, saveBadge } from './services';
import renderPrint from './utils/renderPrint';
import printBagde from './utils/printBagde';
import { fontSize, initialStateBagde } from './constants';
import ModalEdit from './components/ModalEdit';

const { Text, Link } = Typography;

export default function Index(props) {
  const { event } = props;
  const ifrmPrint = useRef();
  const [badges, setBadges] = useState([]);
  const [badge, setBadge] = useState(initialStateBagde);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleEdit, setIsVisibleEdit] = useState(false);
  const [qrExist, setQrExist] = useState(false);
  const [extraFields, setExtraFields] = useState([]);
  const filterOptions = event.user_properties ? event.user_properties : [];
  useEffect(() => {
    getInitialValues(event, setBadges, setQrExist);
  }, []);
  const addQR = () => {
    setBadges([
      ...badges,
      {
        edit: true,
        id_properties: {
          label: 'QR',
        },
        qr: true,
        size: 148,
      },
    ]);
    setQrExist(true);
  };

  const addField = (values) => {
    let dataAdd = {
      edit: true,
      id_properties: {
        label: 'default',
        value: values.id_properties,
      },
      size: values.size,
    };
    if (event) {
      const properties = event.user_properties;
      let labelFound = properties.find((propertie) => propertie.name === values.id_properties);
      dataAdd = {
        edit: true,
        id_properties: {
          label: labelFound?.label,
          value: values.id_properties,
        },
        size: values.size,
      };
    }
    setBadges([...badges, dataAdd]);
    setIsVisible(false);
    setExtraFields([...extraFields, dataAdd.id_properties]);
    // badges.push({ edit: true, id_properties: '', size: 18 });
  };
  const editField = () => {
    let dataEdit = {
      edit: true,
      id_properties: badge.id_properties,
      size: badge.size,
      qr: badge.qr,
    };
    badges[badge.index] = dataEdit;
    setBadges([...badges]);
    setIsVisibleEdit(false);
  };
  const removeField = (field) => {
    if (field.qr) setQrExist(false);
    setExtraFields([...extraFields, field.id_properties]);
    let badgesFilter = badges.filter((item) => item.id_properties != field.id_properties);
    setBadges(badgesFilter);
  };
  const actionEditField = (values, index) => {
    setBadge({ index, ...values });
    setIsVisibleEdit(true);
  };
  const columns = [
    {
      title: 'Propiedad',
      dataIndex: 'id_properties',
      key: 'id_properties',
      render: (_, record) => <Text>{record.id_properties.label}</Text>,
    },
    {
      title: 'Tamaño',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Opciones' /* <Button onClick={() => setIsVisible(!isVisible)} icon={<PlusOutlined />} /> */,
      key: 'action',
      align: 'center',
      render: (_, record, index) => (
        <Row gutter={[8, 8]} wrap justify='center'>
          <Col>
            <Tooltip placement='topLeft' title='Editar'>
              <Button
                type='primary'
                onClick={() => actionEditField(record, index)}
                icon={<EditOutlined />}
                size='small'
              />
            </Tooltip>
          </Col>
          <Col>
            <Tooltip placement='topLeft' title='Eliminar'>
              <Button onClick={() => removeField(_)} icon={<DeleteOutlined />} type='danger' size='small' />
            </Tooltip>
          </Col>
        </Row>
      ),
    },
  ];
  return (
    <>
      <Header
        title={'Configuración de escarapelas'}
        description={
          ' Acontinuación podrás crear la escarapela para tu evento. Agrega los Campos o QR, edita el tamaño de letra de los campos o del QR'
        }
      />

      <Row justify='center' wrap gutter={[16, 16]}>
        <Col span={16}>
          <Card hoverable={true} style={{ borderRadius: '20px' }}>
            <Row gutter={[8]} justify='end'>
              <Col>
                <Button
                  type='primary'
                  size='middle'
                  onClick={() => saveBadge(event, badges, message)}
                  block
                  icon={<SaveOutlined />}>
                  Guardar
                </Button>
              </Col>
              <Col>
                <Button
                  type='primary'
                  size='middle'
                  onClick={() => printBagde(ifrmPrint, badges)}
                  icon={<PrinterOutlined />}>
                  Imprimir
                </Button>
              </Col>
              {!qrExist && (
                <Col>
                  <Button size='middle' onClick={addQR} icon={<QrcodeOutlined />}>
                    Agregar QR
                  </Button>
                </Col>
              )}
              <Col>
                <Button
                  type='primary'
                  size='middle'
                  onClick={() => setIsVisible(!isVisible)}
                  icon={<PlusCircleOutlined />}>
                  Agregar
                </Button>
              </Col>
            </Row>
            <br />
            <Table columns={columns} dataSource={badges} />
          </Card>
        </Col>

        <Col span={8}>
          <Card hoverable={true} style={{ borderRadius: '20px', height: '100%' }}>
            <Typography.Title level={5}>Visualización de la escarapela</Typography.Title>
            {badges.length > 0 && (
              <div
                style={{
                  marginTop: '1rem',
                  border: '1px solid rgb(211, 211, 211)',
                  borderRadius: '5px',
                  padding: '10px',
                }}>
                {renderPrint(badges)}
              </div>
            )}
          </Card>
        </Col>
      </Row>
      <ModalAdd
        addField={addField}
        isVisible={isVisible}
        filterOptions={filterOptions}
        badges={badges}
        fontSize={fontSize}
        setIsVisible={setIsVisible}
      />
      <ModalEdit
        editField={editField}
        isVisible={isVisibleEdit}
        filterOptions={filterOptions}
        badges={badges}
        fontSize={fontSize}
        badge={badge}
        setIsVisible={setIsVisibleEdit}
        setBadge={setBadge}
      />
      <iframe title={'Print User'} ref={ifrmPrint} style={{ opacity: 0, display: 'none' }} />
    </>
  );
}
