import React, { Component, useState, useEffect } from "react";

import API, { EventsApi, UsersApi } from "../../helpers/request";
import { fieldNameEmailFirst } from "../../helpers/utils";
import * as Cookie from "js-cookie";

import { Form, Input, Button, Card, Col, Row, Switch, Spin, message, Typography, Result } from "antd";

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
  required: "${label} es requerido!",
  types: {
    email: "${label} no válido!",
  },
};

// Componente que muestra la informacion del usuario registrado
const UserInfoCard = ({ currentUser }) => {
  const [infoUser, setInfoUser] = useState({});
  const [loading, setLoading] = useState(true);

  // Se obtiene las propiedades y se asignan a un array con el valor que contenga
  const parseObjectToArray = async (info) => {
    let userProperties = new Promise((resolve, reject) => {
      let userProperties = [];

      for (const key in info) {
        if (key != "displayName") userProperties.push({ property: key, value: info[key] });
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
          // Solo se desea obtener el id del usuario

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
    // Trae la información del evento
    const event = await EventsApi.getOne(this.props.eventId);

    const eventUsers = await UsersApi.getAll(this.props.eventId, "?pageSize=10000");

    const properties = event.user_properties;

    // Trae la informacion para los input
    let extraFields = fieldNameEmailFirst(properties);
    extraFields = this.addDefaultLabels(extraFields);
    extraFields = this.orderFieldsByWeight(extraFields);
    this.setState({ extraFields, eventUsers: eventUsers.data }, this.getCurrentUser);
  }

  onFinish = async (values) => {
    let { currentUser, eventUsers } = this.state;
    const key = "registerUserService";

    let existUser = eventUsers.find((user) => user.properties.email == values.email);
    console.log("existUser: ", existUser);

    message.loading({ content: "Registrando Usuario", key });
    const snap = {
      properties: values,
    };
    // console.log(snap);

    let textMessage = {};

    try {
      let resp = await UsersApi.createOne(snap, this.props.eventId);

      if (resp.message === "OK") {
        let statusMessage = resp.status == "CREATED" ? "Registrado" : "Actualizado";
        textMessage.content = "Usuario " + statusMessage;
        this.setState({
          successMessage: `Fuiste registrado al evento con el correo ${values.email}, revisa tu correo para confirmar.`,
        });
      } else {
        textMessage.content = "El usuario no pudo ser creado";
      }

      textMessage.key = key;
      message.success(textMessage).then(() => {
        this.setState({ submittedForm: true });
      });
    } catch (err) {
      textMessage.content = "Error... Intentalo mas tarde";
      textMessage.key = key;
      message.error(textMessage);
    }

    // console.log("este es el mensaje:", textMessage);
  };

  // Función que crea los input del componente

  renderForm = () => {
    const { extraFields } = this.state;
    let formUI = extraFields.map((m, key) => {
      let type = m.type || "text";
      let props = m.props || {};
      let name = m.name;
      let label = m.label;
      let mandatory = m.mandatory;
      let target = name;
      let value = this.state.user[target];
      let input = <Input {...props} type={type} key={key} name={name} value={value} />;

      if (type === "boolean") {
        input = (
          <React.Fragment>
            <input name={name} id={name} className="is-checkradio is-primary is-rtl" type="checkbox" checked={value} />
            <label className={`label has-text-grey-light is-capitalized ${mandatory ? "required" : ""}`} htmlFor={name}>
              {name}
            </label>
          </React.Fragment>
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
          {m.type !== "boolean" && (
            <Form.Item label={label} name={name} rules={[rule]} key={"l" + key} htmlFor={key}>
              {input}
            </Form.Item>
          )}
        </div>
      );
    });
    return formUI;
  };

  render() {
    let { loading, initialValues, registeredUser, currentUser, submittedForm, successMessage } = this.state;
    if (!loading)
      return !registeredUser ? (
        <>
          <Col xs={24} sm={22} md={18} lg={18} xl={18} style={center}>
            {!submittedForm ? (
              <Card title="Formulario de registro" bodyStyle={textLeft}>
                {/* //Renderiza el formulario */}
                <Form
                  {...layout}
                  onFinish={this.onFinish}
                  validateMessages={validateMessages}
                  initialValues={initialValues}>
                  {this.renderForm()}
                  <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                    <Button type="primary" htmlType="submit">
                      Registrarse
                    </Button>
                  </Form.Item>
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
        <UserInfoCard currentUser={currentUser} />
      );
    return <Spin></Spin>;
  }
}

export default UserRegistration;
