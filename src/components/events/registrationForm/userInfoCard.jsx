import { useState, useEffect } from 'react';
import { UsersApi, EventsApi } from '../../../helpers/request';
import FormTags, { setSuccessMessageInRegisterForm } from './constants';
import {
  Collapse,
  Form,
  Input,
  Col,
  Row,
  Checkbox,
  Alert,
  Card,
  Button,
  Result,
  Divider,
  Select,
  Upload,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { DispatchMessageService } from '../../../context/MessageService';

const { Panel } = Collapse;
const { TextArea } = Input;
const { Option } = Select;

const textLeft = {
  textAlign: 'left',
};

const center = {
  margin: '0 auto',
};

const validateMessages = {
  required: 'Este campo ${label} es obligatorio para completar el registro.',
  types: {
    email: '${label} no válido!',
  },
};

export default ({ initialValues, eventId, extraFieldsOriginal, eventUserId, closeModal, conditionals }) => {
  const [user, setUser] = useState({});
  const [extraFields, setExtraFields] = useState(extraFieldsOriginal);
  const [validateEmail, setValidateEmail] = useState(false);
  const [submittedForm, setSubmittedForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [generalFormErrorMessageVisible, setGeneralFormErrorMessageVisible] = useState(false);
  const [notLoggedAndRegister, setNotLoggedAndRegister] = useState(false);
  const [formMessage, setFormMessage] = useState({});
  const [country, setCountry] = useState();
  const [region, setRegion] = useState();
  const [fileSave, setFileSave] = useState([]);

  const [form] = Form.useForm();

  useEffect(() => {
    let formType = !eventUserId ? 'register' : 'transfer';
    setFormMessage(FormTags(formType));
    setSubmittedForm(false);
    hideConditionalFieldsToDefault();
    getEventData(eventId);
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
    const data = await EventsApi.getOne(eventId);
    //Para evitar errores se verifica si la variable existe
    if (data.validateEmail !== undefined) {
      setValidateEmail(data.validateEmail);
    }
  };

  const onFinish = async (values) => {
    values.files = fileSave;
    setGeneralFormErrorMessageVisible(false);

    const key = 'registerUserService';

    // message.loading({ content: !eventUserId ? "Registrando Usuario" : "Realizando Transferencia", key }, 10);
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Actualizando Usuario',
      duration: 10,
      action: 'show',
    });

    const snap = { properties: values };

    let textMessage = {};
    textMessage.key = key;

    try {
      let resp = await UsersApi.createOne(snap, eventId);

      if (resp.message === 'OK') {
        setSuccessMessageInRegisterForm(resp.status);
        // let statusMessage = resp.status == "CREATED" ? "Registrado" : "Actualizado";
        // textMessage.content = "Usuario " + statusMessage;
        textMessage.content = 'Usuario ' + formMessage.successMessage;

        setSuccessMessage(
          Object.entries(initialValues).length > 0
            ? `Actualización de datos exitosa`
            : `Fuiste registrado al curso con el correo ${values.email}, revisa tu correo para confirmar.`
        );

        setSubmittedForm(true);
        DispatchMessageService({
          key: 'loading',
          action: 'destroy',
        });
        DispatchMessageService({
          type: 'success',
          msj: textMessage,
          action: 'show',
        });
      } else {
        textMessage.content = resp;
        // Retorna un mensaje en caso de que ya se encuentre registrado el correo
        setNotLoggedAndRegister(true);
        DispatchMessageService({
          key: 'loading',
          action: 'destroy',
        });
        DispatchMessageService({
          type: 'success',
          msj: textMessage,
          action: 'show',
        });
      }
    } catch (err) {
      // textMessage.content = "Error... Intentalo mas tarde";
      textMessage.content = formMessage.errorMessage;

      textMessage.key = key;
      DispatchMessageService({
        key: 'loading',
        action: 'destroy',
      });
      DispatchMessageService({
        type: 'error',
        msj: textMessage,
        action: 'show',
      });
    }
  };

  const fieldsChange = (changedField) => {};

  const valuesChange = (changedField, allFields) => {
    let newExtraFields = [...extraFieldsOriginal];

    conditionals.map((conditional) => {
      let fulfillConditional = true;
      Object.keys(allFields).map((changedkey) => {
        if (changedkey === conditional.fieldToValidate) {
          fulfillConditional = conditional.value == allFields[changedkey];
        }
      });
      if (fulfillConditional) {
        //Campos ocultados por la condicion
        newExtraFields = newExtraFields.filter((field) => {
          return conditional.fields.indexOf(field.name) == -1;
        });
      }
    });

    setExtraFields(newExtraFields);
  };

  const hideConditionalFieldsToDefault = () => {
    let newExtraFields = [...extraFieldsOriginal];

    conditionals.map((conditional) => {
      newExtraFields = newExtraFields.filter((field) => {
        return conditional.fields.indexOf(field.name) == -1;
      });
    });

    setExtraFields(newExtraFields);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'application/pdf';
    if (!isJpgOrPng) {
      DispatchMessageService({
        type: 'error',
        msj: 'You can only upload PDF file!',
        action: 'show',
      });
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      DispatchMessageService({
        type: 'error',
        msj: 'Image must smaller than 5MB!',
        action: 'show',
      });
    }
    return isJpgOrPng && isLt5M;
  };

  const showRequest = async ({ file }) => {
    if (file) {
      if (file.response) {
        const response = file.response.trim();
        const newArray = fileSave.map((item) => item);
        newArray.push(response);

        setFileSave(newArray);
      }
    }
  };
  /**
   * Crear inputs usando ant-form, ant se encarga de los onChange y de actualizar los valores
   */
  const renderForm = () => {
    if (!extraFields) return '';
    let formUI = extraFields.map((m, key) => {
      // if (m.label === "pesovoto") return;
      let type = m.type || 'text';
      let props = m.props || {};
      let name = m.name;
      let label = m.label;
      let mandatory = m.mandatory;
      let description = m.description;
      let labelPosition = m.labelPosition;
      let target = name;
      let value = user[target];

      if (m.visibleByAdmin == true) {
        return <div key={key}></div>;
      }

      if (conditionals.state === 'enabled') {
        if (label === conditionals.field) {
          if (value === [conditionals.value]) {
            label = conditionals.field;
          } else {
            return;
          }
        }
      }
      let input = (
        <Input
          // {...props}
          addonBefore={
            labelPosition == 'izquierda' ? (
              <span>
                {mandatory && <span style={{ color: 'red' }}>* </span>}
                <strong>{label}</strong>
              </span>
            ) : (
              ''
            )
          }
          type={type}
          key={key}
          name={name}
          value={value}
        />
      );

      if (type === 'tituloseccion') {
        input = (
          <React.Fragment>
            <p style={{ fontSize: '1.3em' }} className={`label has-text-grey ${mandatory ? 'required' : ''}`}>
              <strong>{label}</strong>
            </p>
            <Divider />
          </React.Fragment>
        );
      }

      if (type === 'boolean') {
        input = (
          <Checkbox {...props} key={key} name={name}>
            {mandatory ? (
              <span>
                <span style={{ color: 'red' }}>* </span>
                <strong>{label}</strong>
              </span>
            ) : (
              label
            )}
          </Checkbox>
        );
      }

      if (type === 'longtext') {
        input = <TextArea rows={4} autoSize={{ minRows: 3, maxRows: 25 }} />;
      }

      if (type === 'multiplelist') {
        input = (
          <Checkbox.Group
            options={m.options}
            onChange={(checkedValues) => {
              value = JSON.stringify(checkedValues);
            }}
          />
        );
      }

      if (type === 'multiplelisttable') {
        input = <Select options={m.options} isMulti name={name} />;
      }

      if (type === 'list') {
        input = m.options.map((o, key) => {
          return (
            <Option key={key} value={o.value}>
              {o.value}
            </Option>
          );
        });
        input = (
          <Select defaultValue={value} style={{ width: '100%' }} name={name}>
            <Option value={''}>Seleccione...</Option>
            {input}
          </Select>
        );
      }

      if (type === 'country') {
        input = (
          <CountryDropdown
            className='countryCity-styles'
            value={country}
            onChange={(val) => setCountry(val)}
            name={name}
          />
        );
      }

      if (type === 'city') {
        input = (
          <RegionDropdown
            className='countryCity-styles'
            country={country}
            value={region}
            name={name}
            onChange={(val) => setRegion(val)}
          />
        );
      }

      if (type === 'file') {
        input = (
          <Upload
            action='https://api.evius.co/api/files/upload/'
            onChange={showRequest}
            multiple={false}
            listType='text'
            beforeUpload={beforeUpload}>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        );
      }
      // if (type === "password") {
      //   input = (
      //       <>
      //         <Password
      //         name='password'
      //         style={{ marginBottom: '15px'}}
      //         placeholder="Ingrese su password"
      //         key={key}
      //         onChange={val => setPassword(val)}
      //         type={type}
      //         value={value}
      //         {...props}
      //         />
      //       </>
      //   )
      // }

      let rule = name == 'email' || name == 'names' ? { required: true } : { required: mandatory };

      //esogemos el tipo de validación para email
      rule = type == 'email' ? { ...rule, type: 'email' } : rule;

      //rule = (type == "password") ? { ...rule, type: "password" } : rule;
      // let hideFields =
      //   mandatory == true || name == "email" || name == "names" ? { display: "block" } : { display: "none" };

      if (type == 'boolean' && mandatory) {
        let textoError = 'Debes llenar este  campo es obligatorio';
        rule = { validator: (_, value) => (value ? Promise.resolve() : Promise.reject(textoError)) };
      }

      return (
        <div key={'g' + key} name='field'>
          {type == 'tituloseccion' && input}
          {type != 'tituloseccion' && (
            <>
              <Form.Item
                // style={eventUserId && hideFields}
                valuePropName={type == 'boolean' ? 'checked' : 'value'}
                label={
                  (labelPosition != 'izquierda' || !labelPosition) && type !== 'tituloseccion'
                    ? label
                    : '' && (labelPosition != 'arriba' || !labelPosition)
                }
                name={name}
                rules={[rule]}
                key={'l' + key}
                htmlFor={key}>
                {input}
              </Form.Item>
              {description && description.length < 500 && <p>{description}</p>}
              {description && description.length > 500 && (
                <Collapse defaultActiveKey={['0']}>
                  <Panel header='Política de privacidad, términos y condiciones' key='1'>
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
            message='Datos actualizados'
            description='Tus datos han sido actualizados correctamente'
            type='info'
            showIcon
            closable
          />
        </Col>
      )}

      <br />
      <Col xs={24} sm={22} md={18} lg={18} xl={18} style={center}>
        {!submittedForm ? (
          <Card title='Actualización de campos' bodyStyle={textLeft}>
            {/* //Renderiza el formulario */}
            <Form
              form={form}
              layout='vertical'
              onFinish={onFinish}
              validateMessages={validateMessages}
              initialValues={initialValues}
              onFinishFailed={showGeneralMessage}
              onFieldsChange={fieldsChange}
              onValuesChange={valuesChange}>
              {renderForm()}
              <br />
              <br />

              <Row gutter={[24, 24]}>
                <Col span={24} style={{ display: 'inline-flex', justifyContent: 'center' }}>
                  {generalFormErrorMessageVisible && (
                    <Alert message='Falto por completar algunos campos. ' type='warning' />
                  )}
                </Col>
              </Row>

              <Row gutter={[24, 24]}>
                <Col span={24} style={{ display: 'inline-flex', justifyContent: 'center' }}>
                  <Form.Item>
                    <Button type='primary' htmlType='submit'>
                      Actualizar Datos
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        ) : (
          <Card>
            <Result status='success' title='Datos Actualizados!' subTitle={successMessage} />
          </Card>
        )}
      </Col>
    </>
  );
};
