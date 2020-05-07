import React, { Component } from "react";

import { EventsApi } from "../../helpers/request";
import { fieldNameEmailFirst } from "../../helpers/utils";
import { Form, Input, Button, Card, Col, Row, Switch } from "antd";

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

class UserRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: {},
      user: {},
      emailError: false,
      valid: true,
      extraFields: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
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

  async componentDidMount() {
    // Trae la información del evento
    const event = await EventsApi.getOne(this.props.eventId);

    const properties = event.user_properties;
    console.log("properties:", properties);
    // Trae la informacion para los input
    let extraFields = fieldNameEmailFirst(properties);
    extraFields = this.addDefaultLabels(extraFields);
    extraFields = this.orderFieldsByWeight(extraFields);
    this.setState({ extraFields });

    let user = {};
    this.props.extraFields.map((obj) => (user[obj.name] = ""));
    this.setState({ user });
  }

  async handleSubmit(e) {
    let { user } = this.state;

    e.preventDefault();
    e.stopPropagation();
    console.log("Handle Submit");

    const snap = {
      properties: user,
    };
    console.log(snap);
  }

  onFinish = (values) => {
    console.log("On finish");
    console.log(values);
  };

  // Función que crea los input del componente

  renderForm = () => {
    const { extraFields } = this.state;
    let formUI = extraFields.map((m, key) => {
      let type = m.type || "text";
      let props = m.props || {};
      let name = m.name;
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

      let rule = type == "email" ? { type: "email" } : { required: mandatory };
      return (
        <div key={"g" + key} name="field">
          {m.type !== "boolean" && (
            <Form.Item label={name} name={name} rules={[rule]} key={"l" + key} htmlFor={key}>
              {input}
            </Form.Item>
          )}
        </div>
      );
    });
    return formUI;
  };

  render() {
    return (
      <>
        <Col xs={24} sm={22} md={18} lg={18} xl={18} style={center}>
          <Card title="Formulario de registro" bodyStyle={textLeft}>
            {/* //Renderiza el formulario */}
            <Form {...layout} onFinish={this.onFinish} validateMessages={validateMessages}>
              {this.renderForm()}
              <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                <Button type="primary" htmlType="submit">
                  Registrarse
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </>
    );
  }
}

export default UserRegistration;
