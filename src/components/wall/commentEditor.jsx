import React, { useState } from 'react';
import { Button, Form, Input, Row, Col, Modal } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { AuthUrl } from '../../helpers/constants';



let innerOnSubmit = (onSubmit, comment, setComment, user, setVisibleNoUser) => {
  if (!user) {
    setVisibleNoUser(true);
    return;
  } else {
    onSubmit(comment);
    setComment("")
  }
};

const { TextArea } = Input;
const CommentEditor = ({ onSubmit, user,item,setItemComment,itemcomment,setComment,comment }) => {
  let [visibleNoUser, setVisibleNoUser] = useState(false);

  let onChange = ( e) => {
    setComment(e.target.value);   
    setItemComment(item.id);
  };

  return (
    <>
      {true && (
        <Form.Item >
          <Row
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop:20
            }}>
            <Col span={21}>
              <TextArea
                placeholder='Escribe un comentario...'
                onChange={onChange}
                value={itemcomment&& item.id==itemcomment ? comment:''}
                autoSize
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
              onClick={innerOnSubmit.bind(null, onSubmit, comment, setComment, user, setVisibleNoUser)}
              style={{ color: 'white' }}
              icon={<SendOutlined />}
            />
          </Row>
        </Form.Item>
      )}

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
