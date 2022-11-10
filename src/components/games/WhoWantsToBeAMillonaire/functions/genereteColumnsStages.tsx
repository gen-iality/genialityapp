import FormatTextIcon from '@2fd/ant-design-icons/lib/FormatText';
import ImageOutlineIcon from '@2fd/ant-design-icons/lib/ImageOutline';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Row, Tag, Tooltip, Typography, Image } from 'antd';
import { useMillonaireCMS } from '../hooks/useMillonaireCMS';
const { Text } = Typography;

const GenerateColumnsStages = () => {
  const { onDeleteStage } = useMillonaireCMS();
  const columns = [
    {
      title: 'Etapa',
      key: 'stage',
      dataIndex: 'stage',
      type: 'string',
      name: 'Etapa',
    },
    {
      title: 'Pregunta ID',
      key: 'question',
      dataIndex: 'question',
      name: 'Pregunta ID',
    },
    {
      title: 'Salvavidas',
      key: 'lifeSaver',
      dataIndex: 'lifeSaver',
      name: 'Salvavidas',
      render: (text: string, value: any, index: any) => {
        return value.lifeSaver === true ? <Tag color='green'>Salvavidad</Tag> : <Tag color='red'>No Salvavidad</Tag>;
      },
    },
    {
      title: 'Puntaje',
      key: 'score',
      dataIndex: 'score',
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
            {/* <Col>
              <Tooltip placement='topLeft' title='Editar'>
                <Button icon={<EditOutlined />} type='primary' size='small' />
              </Tooltip>
            </Col> */}
            <Col>
              <Tooltip placement='topLeft' title='Eliminar'>
                <Button
                  key={`removeAction${index}`}
                  id={`removeAction${index}`}
                  icon={<DeleteOutlined />}
                  danger
                  size='small'
                  onClick={() => onDeleteStage(value)}
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
