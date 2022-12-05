import FormatTextIcon from '@2fd/ant-design-icons/lib/FormatText';
import ImageOutlineIcon from '@2fd/ant-design-icons/lib/ImageOutline';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Row, Tag, Tooltip, Typography, Image } from 'antd';
import { useMillonaireCMS } from '../hooks/useMillonaireCMS';
const { Text } = Typography;

const GenerateColumnsBankQuestion = () => {
  const columns = [
    {
      title: 'Pregunta',
      key: 'question',
      dataIndex: 'question',
      type: 'string',
      name: 'Pregunta',
    },
    // {
    //   title: 'Tipo de pregunta',
    //   key: 'question_type',
    //   dataIndex: 'string',
    //   name: 'Tipo de pregunta',
    //   render: (text: string, value: any, index: any) => {
    //     return value.type === 'image' ? (
    //       <Tag color='blue' icon={<ImageOutlineIcon />}>
    //         Imagen
    //       </Tag>
    //     ) : (
    //       <Tag color='green' icon={<FormatTextIcon />}>
    //         Texto
    //       </Tag>
    //     );
    //   },
    // },
    {
      title: 'Tiempo por pregunta',
      key: 'timeForQuestion',
      dataIndex: 'number',
      name: 'Tiempo por pregunta',
    },
    // {
    //   title: '# respuestas',
    //   key: 'answers',
    //   dataIndex: 'object',
    //   name: '# respuestas',
    //   render: (text: string, value: any, index: any) => {
    //     return <Tag color='green'>{value.answers.length}</Tag>;
    //   },
    // },
    {
      title: 'Repuesta A',
      key: 'answer_a',
      type: 'string',
      name: 'Repuesta A',
    },
    {
      title: 'Repuesta B',
      key: 'answer_b',
      type: 'string',
      name: 'Repuesta B',
    },
    {
      title: 'Repuesta C',
      key: 'answer_c',
      type: 'string',
      name: 'Repuesta C',
    },
    {
      title: 'Repuesta D',
      key: 'answer_d',
      type: 'string',
      name: 'Repuesta D',
    },
    {
      title: 'Repuesta correcta',
      key: 'correct_answer',
      type: 'string',
      name: 'Repuesta correcta',
    },
  ];
  return columns;
};

export default GenerateColumnsBankQuestion;
