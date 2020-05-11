import React, { Component, useEffect, useState, Fragment } from "react"
import { Avatar, Button, message, Form, List, Card, Input, Row, Col, Spin, Alert, Popconfirm, Modal } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { AuthUrl } from "../../helpers/constants";


let onChange = (setComment, e) => {
    setComment(e.target.value);
}

let innerOnSubmit = (onSubmit, comment, user, setVisibleNoUser) => {

    if (!user) {
        setVisibleNoUser(true);
        return;
    } else {
        onSubmit(comment);
    }


}



const { TextArea } = Input;
const CommentEditor = ({ onSubmit, user }) => {
    let [comment, setComment] = useState("");
    let [visibleNoUser, setVisibleNoUser] = useState(false);

    return (
        <>

            {true && (
                <Form.Item>
                    <Row
                        style={{
                            display: "flex",
                            justifyContent: "center",
                        }}>
                        <Col span={21}>
                            <TextArea
                                placeholder="Escribe un comentario..."
                                onChange={onChange.bind(null, setComment)}
                                value={comment}
                                autoSize
                                id="comment"
                            />

                        </Col>
                        <Button
                            id="submitButton"
                            htmlType="submit"
                            type="link"
                            onClick={innerOnSubmit.bind(null, onSubmit, comment, user, setVisibleNoUser)}
                            style={{ color: "gray" }}
                            icon={<SendOutlined />}
                        />
                    </Row>
                </Form.Item>

            )}

            <Modal
                title="Necesitas estar autenticad@"
                visible={visibleNoUser}
                cancelButtonProps={{ hidden: true }}
                onOk={() => { setVisibleNoUser(false) }}
            >
                <p>
                    <b>Para públicar:</b> Para públicar un mensaje debes estar autenticado, inicia sesión
                                                para poder realizar publicaciones &nbsp;&nbsp;
                                            <Button type="primary">
                        <a href={AuthUrl}>Ir a Ingreso</a>
                    </Button>
                </p>
            </Modal>

        </>
    )
};

export default CommentEditor;
