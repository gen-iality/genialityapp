import FormatTextIcon from '@2fd/ant-design-icons/lib/FormatText';
import ImageOutlineIcon from '@2fd/ant-design-icons/lib/ImageOutline';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Row, Tag, Tooltip, Typography, Image } from 'antd';
import { useMillonaireCMS } from '../hooks/useMillonaireCMS';
const { Text } = Typography;

const GenerateColumnsStages = () => {
  const { onDeleteStage, millonaire, onActionEditStage, active } = useMillonaireCMS();
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
      render: (text: string, value: any, index: any) => {
        if(value?.question) {
          const question = millonaire?.questions?.find((question) => question?.id === value?.question );
          return question ? <Text>{question.question}</Text> : <Text type='danger'>No se encontró la pregunta</Text>;
        }
        return <Text type='danger'>Debe asignar una pregunta</Text>;
      },
    },
    {
      title: 'Salvavidas',
      key: 'lifeSaver',
      dataIndex: 'lifeSaver',
      name: 'Salvavidas',
      render: (text: string, value: any, index: any) => {
        return value.lifeSaver === true ? <Tag color='green'>Si</Tag> : <Tag color='red'>No</Tag>;
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
            <Col>
              <Tooltip placement='topLeft' title={active ? 'No se puede eidtar por que la dinamica esta activa' :'Editar'}>
                <Button
                  onClick={() => onActionEditStage(value, index)}
                  icon={<EditOutlined />}
                  type='primary'
                  size='small'
                  disabled={active}
                />
              </Tooltip>
            </Col>
            {/* <Col>
              <Tooltip placement='topLeft' title={active ? 'No se puede eliminar por que la dinamica esta activa': 'Eliminar'}>
                <Button
                  key={`removeAction${index}`}
                  id={`removeAction${index}`}
                  icon={<DeleteOutlined />}
                  danger
                  disabled={active}
                  size='small'
                  onClick={() => onDeleteStage(value)}
                />
              </Tooltip>
            </Col> */}
          </Row>
        );
      },
    },
  ];
  return columns;
};

export default GenerateColumnsStages;
