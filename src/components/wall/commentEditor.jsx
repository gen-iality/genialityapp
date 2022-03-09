import React, { useContext, useState } from 'react';
import { Button, Form, Input, Row, Col, Modal } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { AuthUrl } from '../../helpers/constants';
import WallContext, { WallContextProvider } from '../../context/WallContext';

/*let innerOnSubmit = (onSubmit, comment, setComment, user, setVisibleNoUser) => {
  if (!user) {
    setVisibleNoUser(true);
    return;
  } else {
    onSubmit(comment);
   // setComment("")
  }
};*/

const { TextArea } = Input;
const CommentEditor = ({ onSubmit, item }) => {
  let [visibleNoUser, setVisibleNoUser] = useState(false);

  return <RenderEditor onSubmit={onSubmit} item={item} visibleNoUser={visibleNoUser} />;
};

const RenderEditor = ({ wallcontext, onSubmit, visibleNoUser, item }) => {
  const { comment, setComment, itemcomment, setItemComment } = useContext(WallContext);
  return (
    <>
      {' '}
      {
        <Form
          onFinish={(values) => {
            onSubmit(comment);
            setComment('');
          }}>
          <Form.Item name='comment'>
            <Row
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 20,
              }}>
              <Col span={21}>
                <TextArea
                  onChange={(e) => {
                    setComment(e.target.value);
                    if (itemcomment !== item.id) {
                      setItemComment(item.id);
                    }
                  }}
                  placeholder='Escribe un comentario...'
                  autoSize
                  value={itemcomment && item.id == itemcomment ? comment : ''}
                  autoFocus={itemcomment && item.id == itemcomment}
                  id='comment'
                  allowClear
                  showCount
                  maxLength={500}
                />
              </Col>
              <Button
                id='submitButton'
                htmlType='submit'
                type='primary'
                style={{ color: 'white' }}
                icon={<SendOutlined />}
              />
            </Row>
          </Form.Item>
          <Form.Item name='id' initialValue={item.id || ''}>
            <Input type='hidden' />
          </Form.Item>
        </Form>
      }
      <Modal
        title='Necesitas estar autenticad@'
        visible={visibleNoUser}
        cancelButtonProps={{ hidden: true }}
        onOk={() => {
          setVisibleNoUser(false);
        }}>
        <p>
          <b>Para públicar:</b> Para públicar un mensaje debes estar autenticado, inicia sesión para poder realizar
          publicaciones &nbsp;&nbsp;
          <Button type='primary'>
            <a href={AuthUrl}>Ir a Ingreso</a>
          </Button>
        </p>
      </Modal>
    </>
  );
};

export default CommentEditor;
