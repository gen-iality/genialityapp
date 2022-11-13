import FormatTextIcon from '@2fd/ant-design-icons/lib/FormatText';
import ImageOutlineIcon from '@2fd/ant-design-icons/lib/ImageOutline';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Row, Tag, Tooltip, Typography, Image } from 'antd';
import { useMillonaireCMS } from '../hooks/useMillonaireCMS';
const { Text } = Typography;

const GenerateColumnsQuestion = () => {
  const { onDeleteQuestion, onActionEditQuestion } = useMillonaireCMS();
  const columns = [
    {
      title: 'Pregunta',
      key: 'question',
      dataIndex: 'question',
      type: 'string',
      name: 'Pregunta',
      render: (text: string, value: any, index: any) => {
        return value.type === 'image' ? (
          <Image
            preview={{ mask: 'Ver', maskClassName: 'borderRadius' }}
            style={{ borderRadius: '10px' }}
            width={50}
            height={50}
            src={value.question}
            alt={value.id || index + ' question'}
          />
        ) : (
          <Text>{value.question}</Text>
        );
      },
    },
    {
      title: 'Tipo de pregunta',
      key: 'question_type',
      dataIndex: 'string',
      name: 'Tipo de pregunta',
      render: (text: string, value: any, index: any) => {
        return value.type === 'image' ? (
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
      title: 'Tiempo por pregunta',
      key: 'timeForQuestion',
      dataIndex: 'number',
      name: 'Tiempo por pregunta',
      render: (text: string, value: any, index: any) => {
        return <Typography.Text>{value.timeForQuestion} segundos</Typography.Text>;
      },
    },
    {
      title: '# respuestas',
      key: 'answers',
      dataIndex: 'object',
      name: '# respuestas',
      render: (text: string, value: any, index: any) => {
        return <Tag color='green'>{value.answers.length}</Tag>;
      },
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
                <Button
                  onClick={() => onActionEditQuestion(value, index)}
                  icon={<EditOutlined />}
                  type='primary'
                  size='small'
                />
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
                  onClick={() => onDeleteQuestion(value)}
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

export default GenerateColumnsQuestion;
