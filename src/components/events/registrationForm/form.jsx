import React, { useState, useEffect, Fragment } from "react";

import API, { UsersApi, TicketsApi } from "../../../helpers/request";

import { Collapse, Form, Input, Col, Row, message, Typography, Checkbox, Alert, Card, Button, Result } from "antd";
const { Panel } = Collapse;
const { TextArea } = Input;

const textLeft = {
  textAlign: "left",
};

const center = {
  margin: "0 auto",
};

// Grid para formulario
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};

const validateMessages = {
  required: "Este campo ${label} es obligatorio para completar el registro.",
  types: {
    email: "${label} no válido!",
  },
};

export default ({ initialValues, eventId, extraFields, eventUserId, closeModal }) => {
  const [user, setUser] = useState({});
  const [submittedForm, setSubmittedForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [generalFormErrorMessageVisible, setGeneralFormErrorMessageVisible] = useState(false);
  const [notLoggedAndRegister, setNotLoggedAndRegister] = useState(false);

  useEffect(() => {
    setSubmittedForm(false);
  }, [eventUserId]);

  const showGeneralMessage = () => {
    setGeneralFormErrorMessageVisible(true);
    setTimeout(() => {
      setGeneralFormErrorMessageVisible(false);
    }, 3000);
  };

  const onFinish = async (values) => {
    setGeneralFormErrorMessageVisible(false);

    const key = "registerUserService";
    console.log("values", values);

    message.loading({ content: !eventUserId ? "Registrando Usuario" : "Realizando Transferencia", key }, 10);

    const snap = { properties: values };

    let textMessage = {};
    textMessage.key = key;

    if (eventUserId) {
      try {
        let resp = await TicketsApi.transferToUser(eventId, eventUserId, snap);
        console.log("resp:", resp);
        textMessage.content = "Transferencia Realizada";
        setSuccessMessage(`Se ha realizado la transferencia del ticket al correo ${values.email}`);

        setSubmittedForm(true);
        message.success(textMessage);
        setTimeout(() => {
          closeModal({ status: "sent_transfer", message: "Transferencia Hecha" });
        }, 4000);
      } catch (err) {
        console.log("Se presento un problema", err);
        textMessage.content = "Error... Intentalo mas tarde";
        message.error(textMessage);
      }
    } else {
      try {
        let resp = await UsersApi.createOne(snap, eventId);

        if (resp.message === "OK") {
          console.log("RESP", resp);
          let statusMessage = resp.status == "CREATED" ? "Registrado" : "Actualizado";
          textMessage.content = "Usuario " + statusMessage;
          setSuccessMessage(
            Object.entries(initialValues).length > 0
              ? `Fuiste registrado al evento exitosamente`
              : `Fuiste registrado al evento con el correo ${values.email}, revisa tu correo para confirmar.`
          );

          setSubmittedForm(true);
          message.success(textMessage);
        } else {
          textMessage.content = resp;
          // Retorna un mensaje en caso de que ya se encuentre registrado el correo
          setNotLoggedAndRegister(true);
          message.success(textMessage);
        }
      } catch (err) {
        textMessage.content = "Error... Intentalo mas tarde";
        textMessage.key = key;
        message.error(textMessage);
      }
    }
  };

  /**
   * Crear inputs usando ant-form, ant se encarga de los onChange y de actualizar los valores
   */
  const renderForm = () => {
    let formUI = extraFields.map((m, key) => {
      let type = m.type || "text";
      let props = m.props || {};
      let name = m.name;
      let label = m.label;
      let mandatory = m.mandatory;
      let description = m.description;
      let labelPosition = m.labelPosition;
      let target = name;
      let value = user[target];
      let input = (
        <Input
          {...props}
          addonBefore={
            labelPosition == "izquierda" ? (
              <span>
                <span style={{ color: "red" }}>* </span>
                {label}
              </span>
            ) : (
              ""
            )
          }
          type={type}
          key={key}
          name={name}
          value={value}
        />
      );

      if (type === "tituloseccion") {
        input = (
          <React.Fragment>
            <p className={`label has-text-grey is-capitalized ${mandatory ? "required" : ""}`}>{label}</p>
          </React.Fragment>
        );
      }

      if (type === "boolean") {
        input = (
          <Checkbox {...props} key={key} name={name}>
            {mandatory ? (
              <span>
                <span style={{ color: "red" }}>* </span>
                {label}
              </span>
            ) : (
              label
            )}
          </Checkbox>
        );
      }

      if (type === "longtext") {
        input = <TextArea rows={4} autoSize={{ minRows: 3, maxRows: 25 }} />;
      }

      if (type === "multiplelist") {
        console.log(m.options);
        input = (
          <Checkbox.Group
            options={m.options}
            onChange={(checkedValues) => {
              value = JSON.stringify(checkedValues);
            }}
          />
        );
      }

      if (type === "list") {
        input = m.options.map((o, key) => {
          return (
            <option key={key} value={o.value}>
              {o.value}
            </option>
          );
        });
        input = (
          <div className="select" style={{ width: "100%" }}>
            <select style={{ width: "100%" }} name={name} value={value}>
              <option value={""}>Seleccione...</option>
              {input}
            </select>
          </div>
        );
      }

      let rule = name == "email" || name == "names" ? { required: true } : { required: mandatory };
      rule = type == "email" ? { ...rule, type: "email" } : rule;
      if (type == "boolean" && mandatory) {
        let textoError = "Debes llenar este  campo es obligatorio";
        rule = { validator: (_, value) => (value ? Promise.resolve() : Promise.reject(textoError)) };
      }

      return (
        <div key={"g" + key} name="field">
          {type == "tituloseccion" && input}
          {type != "tituloseccion" && (
            <>
              <Form.Item
                valuePropName={type == "boolean" ? "checked" : "value"}
                label={(labelPosition != "arriba" || !labelPosition) && type !== "tituloseccion" ? label : ""}
                name={name}
                rules={[rule]}
                key={"l" + key}
                htmlFor={key}>
                {input}
              </Form.Item>
              {description && description.length < 500 && <p>{description}</p>}
              {description && description.length > 500 && (
                <Collapse defaultActiveKey={["0"]}>
                  <Panel header="Politica de privacidad, terminos y condiciones" key="1">
                    <pre>{description}</pre>
                  </Panel>
                </Collapse>
              )}
            </>
          )}
        </div>
      );
    });
    return formUI;
  };

  return (
    <>
      {notLoggedAndRegister && (
        <Col xs={24} sm={22} md={18} lg={18} xl={18} style={center}>
          <Alert
            message="Ya se encuentra registrado"
            description="Ya has realizado previamente el registro al evento, por favor revisa tu correo."
            type="info"
            showIcon
            closable
          />
        </Col>
      )}

      <br />
      <Col xs={24} sm={22} md={18} lg={18} xl={18} style={center}>
        {!submittedForm ? (
          <Card title={!eventUserId ? "Formulario de Registro" : "Transferir Ticket a Usuario"} bodyStyle={textLeft}>
            {/* //Renderiza el formulario */}
            <Form
              layout="vertical"
              onFinish={onFinish}
              validateMessages={validateMessages}
              initialValues={initialValues}
              onFinishFailed={showGeneralMessage}>
              {renderForm()}
              <br />
              <br />

              <Row gutter={[24, 24]}>
                <Col span={24} style={{ display: "inline-flex", justifyContent: "center" }}>
                  {generalFormErrorMessageVisible && (
                    <Alert message="Falto por completar algunos campos. " type="warning" />
                  )}
                </Col>
              </Row>

              <Row gutter={[24, 24]}>
                <Col span={24} style={{ display: "inline-flex", justifyContent: "center" }}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Registrarse
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        ) : (
          <Card>
            <Result status="success" title="Has sido registrado exitosamente!" subTitle={successMessage} />
          </Card>
        )}
      </Col>
    </>
  );
};
