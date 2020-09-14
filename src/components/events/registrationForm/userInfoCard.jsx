import React, { useState, useEffect, Fragment } from "react";
import { Redirect } from 'react-router-dom';

import API, { UsersApi, TicketsApi, EventsApi } from "../../../helpers/request";

import FormTags, { setSuccessMessageInRegisterForm } from "./constants";

import { Collapse, Form, Input, Col, Row, message, Typography, Checkbox, Alert, Card, Button, Result, Divider, Select } from "antd";
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
const { Panel } = Collapse;
const { TextArea } = Input;
const { Option } = Select;

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

export default ({ initialValues, eventId, extraFieldsOriginal, eventUserId, closeModal, conditionals }) => {
  const [user, setUser] = useState({});
  const [extraFields, setExtraFields] = useState(extraFieldsOriginal);
  const [validateEmail, setValidateEmail] = useState(false);
  const [value, setValue] = useState();
  const [submittedForm, setSubmittedForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [generalFormErrorMessageVisible, setGeneralFormErrorMessageVisible] = useState(false);
  const [notLoggedAndRegister, setNotLoggedAndRegister] = useState(false);
  const [formMessage, setFormMessage] = useState({});
  const [country, setCountry] = useState();
  const [region, setRegion] = useState()

  const [form] = Form.useForm();

  useEffect(() => {
    let formType = !eventUserId ? "register" : "transfer";
    setFormMessage(FormTags(formType));
    setSubmittedForm(false);
    hideConditionalFieldsToDefault();
    getEventData(eventId)
    form.resetFields();
  }, [eventUserId, initialValues]);

  const showGeneralMessage = () => {
    setGeneralFormErrorMessageVisible(true);
    setTimeout(() => {
      setGeneralFormErrorMessageVisible(false);
    }, 3000);
  };

  //Funcion para traer los datos del event para obtener la variable validateEmail y enviarla al estado
  const getEventData = async (eventId) => {
    const data = await EventsApi.getOne(eventId)
    //Para evitar errores se verifica si la variable existe
    if (data.validateEmail !== undefined) {
      setValidateEmail(data.validateEmail)
    }
  }

  const onFinish = async (values) => {
    setGeneralFormErrorMessageVisible(false);

    const key = "registerUserService";

    // message.loading({ content: !eventUserId ? "Registrando Usuario" : "Realizando Transferencia", key }, 10);
    message.loading({ content: "Actualizando Usuario", key }, 10);

    const snap = { properties: values };

    let textMessage = {};
    textMessage.key = key;

    try {
      let resp = await UsersApi.createOne(snap, eventId);

      if (resp.message === "OK") {
        console.log("RESP", resp);
        setSuccessMessageInRegisterForm(resp.status);
        // let statusMessage = resp.status == "CREATED" ? "Registrado" : "Actualizado";
        // textMessage.content = "Usuario " + statusMessage;
        textMessage.content = "Usuario " + formMessage.successMessage;

        setSuccessMessage(
          Object.entries(initialValues).length > 0
            ? `Actualización de datos exitosa`
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
      // textMessage.content = "Error... Intentalo mas tarde";
      textMessage.content = formMessage.errorMessage;

      textMessage.key = key;
      message.error(textMessage);
    }
  };

  const fieldsChange = (changedField) => { }

  const valuesChange = (changedField, allFields) => {
    let newExtraFields = [...extraFieldsOriginal]

    conditionals.map((conditional, key) => {
      let fulfillConditional = true
      Object.keys(allFields).map((changedkey) => {
        if (changedkey === conditional.fieldToValidate) {
          fulfillConditional = (conditional.value == allFields[changedkey])
        }
      })
      if (fulfillConditional) {
        //Campos ocultados por la condicion
        newExtraFields = newExtraFields.filter((field, key) => {
          return conditional.fields.indexOf(field.name) == -1
        })
      }
    })

    setExtraFields(newExtraFields)
  }

  const hideConditionalFieldsToDefault = () => {
    let newExtraFields = [...extraFieldsOriginal]

    conditionals.map((conditional, key) => {
      newExtraFields = newExtraFields.filter((field, key) => {
        return conditional.fields.indexOf(field.name) == -1
      })
    })

    setExtraFields(newExtraFields)
  }

  /**
   * Crear inputs usando ant-form, ant se encarga de los onChange y de actualizar los valores
   */
  const renderForm = () => {
    if (!extraFields) return ""
    let formUI = extraFields.map((m, key) => {
      // if (m.label === "pesovoto") return;            
      let type = m.type || "text";
      let props = m.props || {};
      let name = m.name;
      let label = m.label;
      let mandatory = m.mandatory;
      let description = m.description;
      let labelPosition = m.labelPosition;
      let target = name;
      let value = user[target];

      if (m.visibleByAdmin == false) {
        return (<div></div>);
      }

      if (conditionals.state === "enabled") {
        if (label === conditionals.field) {
          if (value === [conditionals.value]) {
            label = conditionals.field
          } else {
            return
          }
        }
      }
      let input = (
        <Input
          // {...props}
          addonBefore={
            labelPosition == "izquierda" ? (
              <span>
                {
                  mandatory && (
                    <span style={{ color: "red" }}>* </span>
                  )
                }
                <strong>{label}</strong>
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
            <p style={{ fontSize: "1.3em" }} className={`label has-text-grey ${mandatory ? "required" : ""}`}><strong>{label}</strong></p>
            <Divider />
          </React.Fragment>
        );
      }

      if (type === "boolean") {
        input = (
          <Checkbox {...props} key={key} name={name}>
            {mandatory ? (
              <span>
                <span style={{ color: "red" }}>* </span>
                <strong>{label}</strong>
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

        input = (
          <Checkbox.Group
            options={m.options}
            onChange={(checkedValues) => { value = JSON.stringify(checkedValues); }}
          />
        );
      }

      if (type === "list") {
        input = m.options.map((o, key) => {
          return (
            <Option key={key} value={o.value}>
              {o.value}
            </Option>
          );
        });
        input = (
          <Select defaultValue={value} style={{ width: "100%" }} name={name}>
            <Option value={""}>Seleccione...</Option>
            {input}
          </Select>
        );
      }

      if (type === "country") {
        input = (
          <CountryDropdown
            className="countryCity-styles"
            value={country}
            onChange={(val) => setCountry(val)}
            name={name}
          />
        )
      }

      if (type === "city") {
        input = (
          <RegionDropdown
            className="countryCity-styles"
            country={country}
            value={region}
            name={name}
            onChange={(val) => setRegion(val)} />
        )
      }

      let rule = (name == "email" || name == "names") ? { required: true } : { required: mandatory };

      //esogemos el tipo de validación para email
      rule = (type == "email") ? { ...rule, type: "email" } : rule;

      // let hideFields =
      //   mandatory == true || name == "email" || name == "names" ? { display: "block" } : { display: "none" };

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
                // style={eventUserId && hideFields}
                valuePropName={type == "boolean" ? "checked" : "value"}
                label={(labelPosition != "izquierda" || !labelPosition) && type !== "tituloseccion" ? label : "" && (labelPosition != "arriba" || !labelPosition)}
                name={name}
                rules={[rule]}
                key={"l" + key}
                htmlFor={key}
              >
                {input}
              </Form.Item>
              {description && description.length < 500 && <p>{description}</p>}
              {description && description.length > 500 && (
                <Collapse defaultActiveKey={["0"]}>
                  <Panel header="Política de privacidad, términos y condiciones" key="1">
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
            message="Datos actualizados"
            description="Tus datos han sido actualizados correctamente"
            type="info"
            showIcon
            closable
          />
        </Col>
      )}

      <br />
      <Col xs={24} sm={22} md={18} lg={18} xl={18} style={center}>
        {!submittedForm ? (
          <Card title="Actualizacion de campos" bodyStyle={textLeft}>
            {/* //Renderiza el formulario */}
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              validateMessages={validateMessages}
              initialValues={initialValues}
              onFinishFailed={showGeneralMessage}
              onFieldsChange={fieldsChange}
              onValuesChange={valuesChange}
            >
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
                      Actualizar Datos
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        ) : (
            <Card>
              <Result status="success" title="Datos Actualizados!" subTitle={successMessage} />
            </Card>
          )}
      </Col>
    </>
  );
};
