import React, { useState, useEffect } from "react";
import { UsersApi, TicketsApi, EventsApi, Actions } from "../../../helpers/request";
import FormTags, { setSuccessMessageInRegisterForm } from "./constants";
import { Collapse, Form, Input, Col, Row, message, Checkbox, Alert, Card, Button, Result, Divider, Upload, Select } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import ReactSelect from 'react-select'
// import InputFile from "./inputFile"
const { Option } = Select;
const { Panel } = Collapse;
const { TextArea, Password } = Input;

const textLeft = {
  textAlign: "left",
};

const center = {
  margin: "0 auto",
};

const validateMessages = {
  required: "Este campo ${label} es obligatorio para completar el registro.",
  types: {
    email: "${label} no válido!",
    regexp: "malo"
  }
};

const options = [
  { value: "Buenos dias 1", label: "Buenos dias 1" },
  { value: "Buenos dias 2", label: "Buenos dias 2" },
  { value: "Buenos dias 3", label: "Buenos dias 3" },
  { value: "Buenos dias 4", label: "Buenos dias 4" },
  { value: "Buenos dias 5", label: "Buenos dias 5" },
  { value: "Buenos dias 6", label: "Buenos dias 6" },
  { value: "Buenos dias 7", label: "Buenos dias 7" },
  { value: "Buenos dias 8", label: "Buenos dias 8" },
  { value: "Buenos dias 9", label: "Buenos dias 9" },
  { value: "Buenos dias 10", label: "Buenos dias 10" },
  { value: "Buenos dias 11", label: "Buenos dias 11" },
  { value: "Buenos dias 12", label: "Buenos dias 12" },
  { value: "Buenos dias 13", label: "Buenos dias 13" },
  { value: "Buenos dias 14", label: "Buenos dias 14" },
  { value: "Buenos dias 15", label: "Buenos dias 15" },
  { value: "Buenos dias 16", label: "Buenos dias 16" },
  { value: "Buenos dias 17", label: "Buenos dias 17" },
  { value: "Buenos dias 18", label: "Buenos dias 18" },
]

export default ({ initialValues, eventId, extraFieldsOriginal, eventUser, eventUserId, closeModal, conditionals }) => {
  const [user, setUser] = useState({});
  const [extraFields, setExtraFields] = useState(extraFieldsOriginal);
  const [validateEmail, setValidateEmail] = useState(false);
  const [submittedForm, setSubmittedForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [generalFormErrorMessageVisible, setGeneralFormErrorMessageVisible] = useState(false);
  const [notLoggedAndRegister, setNotLoggedAndRegister] = useState(false);
  const [formMessage, setFormMessage] = useState({});
  const [country, setCountry] = useState();
  const [region, setRegion] = useState()
  const [password, setPassword] = useState('')
  const [event, setEvent] = useState(null)
  // const [ fileSave, setFileSave ] = useState( [] )

  const [form] = Form.useForm();
  console.log("eventUser", eventUser);
  useEffect(() => {
    console.log('form methods', form)
    form.setFields([
      {
        name: 'password',
        errors: ['Ingrese un password'],
      },
    ]);
  }, [form])

  useEffect(() => {
    let formType = !eventUserId ? "register" : "transfer";
    setFormMessage(FormTags(formType));
    setSubmittedForm(false);
    hideConditionalFieldsToDefault(conditionals, eventUser);

    getEventData(eventId)
    form.resetFields();

    if (window.fbq) { window.fbq('track', 'CompleteRegistration'); }
  }, [eventUser, eventUserId, initialValues, conditionals]);

  const showGeneralMessage = () => {
    setGeneralFormErrorMessageVisible(true);
    setTimeout(() => {
      setGeneralFormErrorMessageVisible(false);
    }, 3000);
  };

  //Funcion para traer los datos del event para obtener la variable validateEmail y enviarla al estado
  const getEventData = async (eventId) => {
    const data = await EventsApi.getOne(eventId)
    setEvent(data);
    //Para evitar errores se verifica si la variable existe
    if (data.validateEmail !== undefined) {
      setValidateEmail(data.validateEmail)
    }
  }

  const onFinish = async (values) => {
    values.password = password
    // values.files = fileSave

    setGeneralFormErrorMessageVisible(false);

    const key = "registerUserService";

    // message.loading({ content: !eventUserId ? "Registrando Usuario" : "Realizando Transferencia", key }, 10);
    message.loading({ content: formMessage.loadingMessage, key }, 10);

    const snap = { properties: values };

    let textMessage = {};
    textMessage.key = key;
    if (eventUserId) {
      try {
        let resp = await TicketsApi.transferToUser(eventId, eventUserId, snap);
        // textMessage.content = "Transferencia Realizada";
        textMessage.content = formMessage.successMessage;
        setSuccessMessage(`Se ha realizado la transferencia del ticket al correo ${values.email}`);

        setSubmittedForm(true);
        message.success(textMessage);
        setTimeout(() => {
          closeModal({ status: "sent_transfer", message: "Transferencia Hecha" });
        }, 4000);
      } catch (err) {
        console.error("Se presento un problema", err);
        // textMessage.content = "Error... Intentalo mas tarde";
        textMessage.content = formMessage.errorMessage;
        message.error(textMessage);
      }
    } else {
      try {
        let resp = await UsersApi.createOne(snap, eventId);

        if (resp.message === "OK") {
          setSuccessMessageInRegisterForm(resp.status);
          // let statusMessage = resp.status === "CREATED" ? "Registrado" : "Actualizado";
          // textMessage.content = "Usuario " + statusMessage;
          textMessage.content = "Usuario " + formMessage.successMessage;

          let $msg = event.registration_message || `Fuiste registrado al evento  ${values.email || ""}, revisa tu correo para confirmar.`

          setSuccessMessage($msg)

          setSubmittedForm(true);
          message.success(textMessage);
          //Si validateEmail es verdadera redirigirá a la landing con el usuario ya logueado, esta quemado el token por pruebas
          if (event.validateEmail && resp.data.user.initial_token) {

            setTimeout(function () {
              window.location.replace(`/landing/${eventId}?token=${resp.data.user.initial_token}`);
            }, 3000);
          }

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
    }
  };

  const fieldsChange = (changedField) => {
    console.log("fieldsChange");
  }


  const valuesChange = (changedField, allFields) => {
    console.log("valuesChange");
    updateFieldsVisibility(conditionals, allFields);
  }

  const updateFieldsVisibility = (conditionals, allFields) => {
    let newExtraFields = [...extraFieldsOriginal]
    newExtraFields = newExtraFields.filter((field) => {
      let fieldShouldBeDisplayed = false
      let fieldHasCondition = false

      //para cada campo revisamos si se cumplen todas las condiciones para mostrarlo
      conditionals.map((conditional) => {
        let fieldExistInThisCondition = conditional.fields.indexOf(field.name) !== -1
        if (!fieldExistInThisCondition) return;

        fieldHasCondition = true

        //Revisamos si las condiciones del campo tienen los valores adecuados para que se muestre
        let fulfillConditional = false
        Object.keys(allFields).map((changedkey) => {
          if (changedkey === conditional.fieldToValidate) {
            fulfillConditional = (conditional.value === allFields[changedkey])
          }
        })

        if (fulfillConditional) {
          fieldShouldBeDisplayed = true
        }

      })
      return (fieldHasCondition && fieldShouldBeDisplayed) || !fieldHasCondition
    })
    console.log("newExtraFields", newExtraFields, "allFields", allFields, "conditionals", conditionals);
    setExtraFields(newExtraFields)
  }

  const hideConditionalFieldsToDefault = (conditionals, eventUser) => {
    let allFields = (eventUser && eventUser["properties"]) ? eventUser["properties"] : [];
    updateFieldsVisibility(conditionals, allFields);
  }

  const handleChangePassword = e => {
    setPassword(e.target.value)
    form.setFieldsValue({ password: password })
  };

  const beforeUpload = (file) => {
    // const isJpgOrPng = file.type === 'application/pdf';
    // if (!isJpgOrPng) {
    //   message.error('You can only upload PDF file!');
    // }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must smaller than 5MB!');
    }
    return (isLt5M) ? true : false;
  };

  /**
   * Crear inputs usando ant-form, ant se encarga de los onChange y de actualizar los valores
   */
  const renderForm = () => {
    console.log("renderForm", eventUser);
    if (!extraFields) return ""
    let formUI = extraFields.map((m, key) => {
      let type = m.type || "text";
      let props = m.props || {};
      let name = m.name;
      let label = m.label;
      let mandatory = m.mandatory;
      let description = m.description;
      let labelPosition = m.labelPosition;
      let target = name;
      let value = eventUser && eventUser["properties"] ? eventUser["properties"][target] : "";

      //no entiendo b esto para que funciona
      if (conditionals.state === "enabled") {
        if (label === conditionals.field) {
          if (true == true || (value === [conditionals.value])) {
            label = conditionals.field
          } else {
            return
          }
        }
      }
      let input = (
        <Input
          {...props}
          addonBefore={labelPosition === "izquierda" && (<span>{mandatory && (<span style={{ color: "red" }}>* </span>)}<strong>{label}</strong></span>)}
          type={type}
          key={key}
          name={name}
          defaultValue={value}
        />
      );

      if (type === "tituloseccion") {
        input = (
          <React.Fragment>
            <div style={{ fontSize: "1.3em" }} className={`label has-text-grey ${mandatory ? "required" : ""}`}>
              <div
                dangerouslySetInnerHTML={{
                  __html: label
                }}></div>
            </div>
            <Divider />
          </React.Fragment>
        );
      }

      if (type === "multiplelisttable") {
        input = (
          <ReactSelect options={m.options} isMulti name={name} />
        )
      }

      if (type === "boolean") {
        input = (
          <Checkbox {...props} key={key} name={name} defaultChecked={Boolean(value)}>
            { mandatory ? (
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
        input = <TextArea rows={4} autoSize={{ minRows: 3, maxRows: 25 }} value={value} defaultValue={value} />;
      }

      if (type === "multiplelist") {
        input = (
          <Checkbox.Group
            options={m.options}
            defaultValue={value}
            onChange={(checkedValues) => { value = JSON.stringify(checkedValues); }}
          />
        );
      }

      if (type === "file") {
        input = (
          <Upload
            accept="application/pdf"
            action='https://api.evius.co/api/files/upload/'
            multiple={false}
            listType='text'
            beforeUpload={beforeUpload}
            defaultFileList={(value && value.fileList) ? value.fileList.map((file) => { file.url = file.response || null; return file }) : []}

          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        )
      }

      if (type === "list") {
        input = m.options.map((o, key) => {
          return (<Option key={key} value={o.value}>{o.value}</Option>);
        });
        input = (
          <Select style={{ width: "100%" }} name={name} defaultValue={value}>
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

      if (type === "password") {
        input = (
          <Password
            name='password'
            style={{ margin: '15px' }}
            placeholder="Ingrese su password"
            onChange={handleChangePassword}
            key={key}
            value={password}
            pattern="(?=^.{10,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$"
            title="El password debe tener mínimo 10 caracteres, una mayúscula, una minúscula y un número"
          />
        )
      }



      let rule = (name == "email" || name == "names") ? { required: true } : { required: mandatory };

      //esogemos el tipo de validación para email
      rule = (type === "email") ? { ...rule, type: "email" } : rule;

      rule = (type == "password") ? {
        required: true,
        type: "regexp",
        pattern: new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{10,}$/),
        message: "El formato del password no es valido"
      } : rule;

      // let hideFields =
      //   mandatory === true || name === "email" || name === "names" ? { display: "block" } : { display: "none" };

      if (type === "boolean" && mandatory) {
        let textoError = "Debes llenar este  campo es obligatorio";
        rule = { validator: (_, value) => (value ? Promise.resolve() : Promise.reject(textoError)) };
      }

      return (

        <div key={"g" + key} name="field">
          {type === "tituloseccion" && input}
          {type !== "tituloseccion" && (
            <>
              <Form.Item
                // style={eventUserId && hideFields}
                valuePropName={type === "boolean" ? "checked" : "value"}
                label={(labelPosition !== "izquierda" || !labelPosition) && type !== "tituloseccion" ? label : "" && (labelPosition !== "arriba" || !labelPosition)}
                name={name}
                rules={[rule]}
                key={"l" + key}
                htmlFor={key}
                initialValue={value}
              >
                {input}
              </Form.Item>

              {description && description.length < 500 && <p>{description}</p>}
              {description && description.length > 500 && (
                <Collapse defaultActiveKey={["0"]} style={{ margingBotton: '15px' }}>
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
          <Card title={formMessage.titleModal} bodyStyle={textLeft}>
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
                      {eventUser ? "Actualizar" : eventId === '5f9824fc1f8ccc414e33bec2' ? 'Votar y Enviar' : formMessage.formButton}
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        ) : (
            <Card>
              <Result status="success" title={formMessage.resultTitle} subTitle=''>

                <div
                  dangerouslySetInnerHTML={{
                    __html: successMessage
                  }}>
                </div>
              </Result>
            </Card>
          )}
      </Col>
    </>
  );
};
