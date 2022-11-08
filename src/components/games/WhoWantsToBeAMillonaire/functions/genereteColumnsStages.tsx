import FormatTextIcon from '@2fd/ant-design-icons/lib/FormatText';
import ImageOutlineIcon from '@2fd/ant-design-icons/lib/ImageOutline';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Row, Tag, Tooltip, Typography, Image } from 'antd';

const { Text } = Typography;

const GenerateColumnsStages = () => {
  const columns = [
    {
      title: 'Etapa',
      key: 'stage',
      dataIndex: 'stage',
      type: 'string',
      name: 'Etapa',
    },
    {
      title: 'Pregunta',
      key: 'question',
      dataIndex: 'string',
      name: 'Pregunta',
      render: (text: string, value: any, index: any) => {
        return value.carton_value.type === 'image' ? (
          <Tag color='blue' icon={<ImageOutlineIcon />}>
            Imagen
          </Tag>
        ) : (
          <Tag color='green' icon={<FormatTextIcon />}>
            Texto
          </Tag>
        );
      },
    },
    {
      title: 'Salvavidas',
      key: 'lifeSaver',
      dataIndex: 'boolean',
      name: 'Salvavidas',
    },
    {
      title: 'Puntaje',
      key: 'score',
      dataIndex: 'number',
      name: 'Puntaje',
    },
    {
      title: 'Opciones',
      key: 'action',
      type: 'string',
      name: '',
      render: (text: string, value: any, index: any) => {
        return (
          <Row gutter={[8, 8]}>
            <Col>
              <Tooltip placement='topLeft' title='Editar'>
                <Button icon={<EditOutlined />} type='primary' size='small' />
              </Tooltip>
            </Col>
            <Col>
              <Tooltip placement='topLeft' title='Eliminar'>
                <Button
                  key={`removeAction${index}`}
                  id={`removeAction${index}`}
                  icon={<DeleteOutlined />}
                  danger
                  size='small'
                />
              </Tooltip>
            </Col>
          </Row>
        );
      },
    },
  ];
  return columns;
};

export default GenerateColumnsStages;
