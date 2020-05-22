import React, { Component, useState, useEffect } from "react";

import API, { EventsApi, UsersApi } from "../../helpers/request";
import { fieldNameEmailFirst } from "../../helpers/utils";
import * as Cookie from "js-cookie";

import { Collapse, Form, Input, Button, Card, Col, Row, Switch, Spin, message, Typography, Result, Alert, Checkbox } from "antd";
const { Panel } = Collapse;
const { TextArea } = Input;
const { Text } = Typography;

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
    email: "${label} no vá¡lido!",
  },
};

// Componente que muestra la informacion del usuario registrado
const UserInfoCard = ({ currentUser, extraFields }) => {
  const [infoUser, setInfoUser] = useState({});
  const [loading, setLoading] = useState(true);
  console.log("currentuser", currentUser.properties, extraFields);
  // Se obtiene las propiedades y se asignan a un array con el valor que contenga
  const parseObjectToArray = async (info) => {
    let userProperties = new Promise((resolve, reject) => {
      let userProperties = [];

      for (const key in info) {
        if (key != "displayName") {
          let fieldLabel = "";
          fieldLabel = extraFields.filter((item) => key == item.name);
          fieldLabel = fieldLabel && fieldLabel.length && fieldLabel[0].label ? fieldLabel[0].label : key;
          userProperties.push({ key: key, property: fieldLabel, value: info[key] });
        }
      }
      resolve(userProperties);
    });

    let result = await userProperties;
    setInfoUser(result);
    setLoading(false);
  };

  useEffect(() => {
    parseObjectToArray(currentUser.properties);
  }, [currentUser]);

  if (!loading)
    return (
      <Card title="El usuario ya se encuentra registrado">
        {infoUser.map((field, key) => (
          <Row key={key} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={12}>
              <Text strong>{field.property}</Text>
            </Col>
            <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={12}>
              <Text>{field.value}</Text>
            </Col>
          </Row>
        ))}
      </Card>
    );

  return <Spin></Spin>;
};

class UserRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      emailError: false,
      valid: true,
      extraFields: [],
      loading: true,
      initialValues: {},
      eventUsers: [],
      registeredUser: false,
      submittedForm: false,
      successMessage: null,
    };
  }

  // Agrega el nombre del input

  addDefaultLabels = (extraFields) => {
    extraFields = extraFields.map((field) => {
      field["label"] = field["label"] ? field["label"] : field["name"];
      return field;
    });
    return extraFields;
  };

  orderFieldsByWeight = (extraFields) => {
    extraFields = extraFields.sort((a, b) =>
      (a.order_weight && !b.order_weight) || (a.order_weight && b.order_weight && a.order_weight < b.order_weight)
        ? -1
        : 1
    );
    return extraFields;
  };

  // Funcion para consultar la informacion del actual usuario
  getCurrentUser = async () => {
    let { eventUsers } = this.state;

    let evius_token = Cookie.get("evius_token");

    if (!evius_token) {
      this.setState({ currentUser: "guest", loading: false });
    } else {
      try {
        const resp = await API.get(`/auth/currentUser?evius_token=${Cookie.get("evius_token")}`);
        if (resp.status === 200) {
          const data = resp.data;

          //   Se valida si el usuario ya se encuentra registrado al evento
          let existUser = eventUsers.find((user) => user.properties.email == data.email);

          this.setState({
            currentUser: existUser && existUser,
            loading: false,
            registeredUser: existUser ? true : false,
            initialValues: { names: data.names, email: data.email },
          });
        }
      } catch (error) {
        const { status } = error.response;
      }
    }
  };

  async componentDidMount() {
    // Trae la informaciÃ³n del evento
    const event = await EventsApi.getOne(this.props.eventId);

    const eventUsers = await UsersApi.getAll(this.props.eventId, "?pageSize=10000");

    const properties = event.user_properties;

    console.log("PROPS", properties);
    // Trae la informacion para los input
    let extraFields = fieldNameEmailFirst(properties);
    extraFields = this.addDefaultLabels(extraFields);
    extraFields = this.orderFieldsByWeight(extraFields);
    this.setState({ extraFields, eventUsers: eventUsers.data }, this.getCurrentUser);
    console.log("extraFields", properties);
  }

  onFinish = async (values) => {
    let { initialValues, eventUsers } = this.state;
    const key = "registerUserService";
    console.log("values", values);

    message.loading({ content: "Registrando Usuario", key });

    const snap = { properties: values };

    let textMessage = {};
    textMessage.key = key;

    try {
      let resp = await UsersApi.createOne(snap, this.props.eventId);

      if (resp.message === "OK") {
        console.log("RESP", resp);
        let statusMessage = resp.status == "CREATED" ? "Registrado" : "Actualizado";
        textMessage.content = "Usuario " + statusMessage;
        this.setState({
          successMessage:
            Object.entries(initialValues).length > 0
              ? `Fuiste registrado al evento exitosamente`
              : `Fuiste registrado al evento con el correo ${values.email}, revisa tu correo para confirmar.`,
        });
        this.setState({ submittedForm: true });
        message.success(textMessage);
      } else {
        textMessage.content = resp;

        this.setState({ notLoggedAndRegister: true });
        message.success(textMessage);
      }
    } catch (err) {
      textMessage.content = "Error... Intentalo mas tarde";
      textMessage.key = key;
      message.error(textMessage);
    }

    // console.log("este es el mensaje:", textMessage);
  };

  // FunciÃ³n que crea los input del componente
  renderForm = () => {
    const { extraFields } = this.state;


    let formUI = extraFields.map((m, key) => {
      let type = m.type || "text";
      let props = m.props || {};
      let name = m.name;
      let label = m.label;
      let mandatory = m.mandatory;
      let description = m.description;
      let labelPosition = m.labelPosition;
      let target = name;
      let value = this.state.user[target];
      let input = <Input  {...props} addonBefore={labelPosition == "izquierda" ? (mandatory ? "* " : "") + label : ""} type={type} key={key} name={name} value={value} />;


      if (type === "tituloseccion") {
        input = (
          <React.Fragment>
            <p className={`label has-text-grey is-capitalized ${mandatory ? "required" : ""}`} >
              {label}
            </p>
          </React.Fragment>
        );
      }

      if (type === "boolean") {
        input = (
          <Checkbox key={key} name={name} onChange={(e) => { value = e.target.checked }}>{label}</Checkbox>
        );
      }

      if (type === "longtext") {
        input = (
          <TextArea rows={4} autoSize={{ minRows: 3, maxRows: 25 }} />
        );
      }


      if (type === "multiplelist") {
        console.log(m.options);
        input = (
          <Checkbox.Group options={m.options} onChange={(checkedValues) => { value = JSON.stringify(checkedValues) }} />
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

      return (
        <div key={"g" + key} name="field">
          {type == "tituloseccion" && input}
          {type != "tituloseccion" && (
            <>
              <Form.Item valuePropName={(type == "boolean") ? 'checked' : 'value'} label={((labelPosition != "arriba" || !labelPosition) && type !== "tituloseccion") ? label : ""} name={name} rules={[rule]} key={"l" + key} htmlFor={key}>
                {input}
              </Form.Item>
              {description && description.length < 500 && (<p>{description}</p>)}
              {description && description.length > 500 &&
                (<Collapse defaultActiveKey={['0']}>
                  <Panel header="Politica de privacidad, terminos y condiciones" key="1">
                    <p><pre>{description}</pre></p>
                  </Panel>
                </Collapse>)}
            </>
          )
          }


        </div >
      );
    });
    return formUI;
  };

  render() {
    let {
      loading,
      initialValues,
      registeredUser,
      currentUser,
      submittedForm,
      successMessage,
      extraFields,
      notLoggedAndRegister,
    } = this.state;
    if (!loading)
      return !registeredUser ? (
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
              <Card title="Formulario de registro" bodyStyle={textLeft}>
                {/* //Renderiza el formulario */}
                <Form
                  layout="vertical"
                  onFinish={this.onFinish}
                  validateMessages={validateMessages}
                  initialValues={initialValues}>
                  {this.renderForm()}
                  <Row justify="center">
                    <Form.Item wrapperCol={{ ...center, span: 12 }}>
                      <Button type="primary" htmlType="submit">
                        Registrarse
                      </Button>
                    </Form.Item>
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
      ) : (
          <UserInfoCard currentUser={currentUser} extraFields={extraFields} />
        );
    return <Spin></Spin>;
  }
}

export default UserRegistration;