import { List, Button, Typography, Modal } from 'antd';
import { useMillonaireCMS } from '../hooks/useMillonaireCMS';
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function Answers() {
  const {
    question,
    onDeleteAnswer,
    onActionEditAnwser,
    onChangeVisibleModalAnswerList,
    isVisibleModalAnswerList,
  } = useMillonaireCMS();
  return (
    <>
      <Button onClick={() => onChangeVisibleModalAnswerList()}>Ver lista de respuestas</Button>
      <Modal
        title={
          <Title level={4} type='secondary'>
            Lista de respuestas
          </Title>
        }
        visible={isVisibleModalAnswerList}
        onCancel={() => onChangeVisibleModalAnswerList()}
        onOk={() => onChangeVisibleModalAnswerList()}>
        <List
          dataSource={question.answers}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                <Button
                  key={`removeAction${index}`}
                  id={`removeAction${index}`}
                  icon={<DeleteOutlined />}
                  danger
                  size='small'
                  onClick={() => onDeleteAnswer(item, index)}
                />,
                <Button
                  onClick={() => onActionEditAnwser(item, index)}
                  icon={<EditOutlined />}
                  type='primary'
                  size='small'
                />,
              ]}>
              <List.Item.Meta
                avatar={item.isCorrect ? <CheckOutlined /> : <CloseOutlined />}
                title={'RESPUESTA:'}
                description={item.answer}
              />
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
}
