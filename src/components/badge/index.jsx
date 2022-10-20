import { BadgeApi } from '../../helpers/request';
import Header from '@/antdComponents/Header';
import { Form, Row, Col, Button, Space, Modal, Select, Typography, message, Table } from 'antd';
import { useState, useEffect, useRef } from 'react';

const { Text, Link } = Typography;
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import ModalAdd from './components/ModalAdd';
import { getInitialValues, saveBadge } from './services';
import renderPrint from './utils/renderPrint';
import printBagde from './utils/printBagde';
import { fontSize, initialStateBagde } from './constants';
import ModalEdit from './components/ModalEdit';
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
      const labelFound = properties.find((propertie) => propertie.name === values.id_properties);
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
    const dataEdit = {
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
    const badgesFilter = badges.filter((item) => item.id_properties != field.id_properties);
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
      title: <Button onClick={() => setIsVisible(!isVisible)} icon={<PlusOutlined />} />,

      key: 'action',
      render: (_, record, index) => (
        <Space size='middle'>
          <Button onClick={() => actionEditField(record, index)} icon={<EditOutlined />}>
            Editar
          </Button>
          <Button onClick={() => removeField(_)} icon={<DeleteOutlined />}>
            Eliminar
          </Button>
        </Space>
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
          <Space style={{ marginBottom: 8 }}>
            <Button type='primary' onClick={() => saveBadge(event, badges, message)} block>
              Guardar
            </Button>
            {!qrExist && <Button onClick={addQR}>Agregar QR</Button>}
            <Button type='primary' onClick={() => printBagde(ifrmPrint, badges)}>
              Imprimir
            </Button>
          </Space>
          <Table columns={columns} dataSource={badges} />
        </Col>

        <Col span={8}>
          <div
            style={{
              marginTop: '1rem',
              border: '1px solid rgb(211, 211, 211)',
              borderRadius: '5px',
              padding: '10px',
            }}>
            {renderPrint(badges)}
          </div>
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
