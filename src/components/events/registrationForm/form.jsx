import React, { useState, useEffect, useRef, useCallback } from 'react';
import { UsersApi, TicketsApi, EventsApi, EventFieldsApi } from '../../../helpers/request';
import FormTags, { setSuccessMessageInRegisterForm } from './constants';
import {
  Collapse,
  Form,
  Input,
  Col,
  Row,
  message,
  Checkbox,
  Alert,
  Card,
  Button,
  Result,
  Divider,
  Upload,
  Select,
  Space,
  InputNumber,
} from 'antd';
import { InfoCircleOutlined, LoadingOutlined, ShopOutlined, UploadOutlined } from '@ant-design/icons';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import ReactSelect from 'react-select';
import { useIntl } from 'react-intl';
import ImgCrop from 'antd-img-crop';
import { saveImageStorage } from '../../../helpers/helperSaveImage';
import { areaCode } from '../../../helpers/constants';
import TypeRegister from '../../tickets/typeRegister';
import { ButtonPayment, PayForm } from './payRegister';
import { setSectionPermissions } from '../../../redux/sectionPermissions/actions';
import { connect } from 'react-redux';
// import InputFile from "./inputFile"
const { Option } = Select;
const { Panel } = Collapse;
const { TextArea, Password } = Input;

const textLeft = {
  textAlign: 'left',
  width: '100%',
};

const center = {
  margin: '0 auto',
  textAlign: 'center',
};

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(props) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (props.wrapperRef.current && props.wrapperRef.current.contains(event.target)) {
        if (event.target.id) {
          props.showSection(event.target.id);
        }
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [props]);
}

/**
 * Component that alerts if you click outside of it
 */
function OutsideAlerter(props) {
  const wrapperRef = useRef(null);
  useOutsideAlerter({ wrapperRef: wrapperRef, ...props });

  return <div ref={wrapperRef}>{props.children}</div>;
}

/** CAMPO LISTA  tipo justonebyattendee. cuando un asistente selecciona una opción esta
 * debe desaparecer del listado para que ninguna otra persona la pueda seleccionar
 */
let updateTakenOptionInTakeableList = (camposConOpcionTomada, values, eventId) => {
  camposConOpcionTomada.map((field) => {
    let taken = field.options.filter((option) => option.value == values[field.name]);
    let updatedField = { ...field };
    let fieldId = updatedField._id && updatedField._id['$oid'] ? updatedField._id['$oid'] : updatedField._id;
    // updatedField.optionstaken = updatedField.optionstaken ? [...updatedField.optionstaken, ...taken] : taken;

    // //Esto es un parche porque el field viene con campos tipo objeto que revientan el API

    // delete updatedField['_id'];
    // delete updatedField['updated_at'];
    // delete updatedField['created_at'];
    EventFieldsApi.registerListFieldOptionTaken(taken, fieldId, eventId);
  });
};

const FormRegister = ({
  initialValues,
  eventId,
  extraFieldsOriginal,
  eventUser,
  eventUserId,
  closeModal,
  conditionals,
  showSection,
  setSectionPermissions,
}) => {
  const intl = useIntl();
  const [extraFields, setExtraFields] = useState(extraFieldsOriginal);
  const [submittedForm, setSubmittedForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [generalFormErrorMessageVisible, setGeneralFormErrorMessageVisible] = useState(false);
  const [notLoggedAndRegister, setNotLoggedAndRegister] = useState(false);
  const [formMessage, setFormMessage] = useState({});
  const [country, setCountry] = useState();
  const [region, setRegion] = useState();
  const [password, setPassword] = useState('');
  const [event, setEvent] = useState(null);
  const [loggedurl, setLogguedurl] = useState(null);
  const [imageAvatar, setImageAvatar] = useState(null);
  let [ImgUrl, setImgUrl] = useState('');
  const [typeRegister, setTypeRegister] = useState('free');
  const [payMessage, setPayMessage] = useState(false);
  const [form] = Form.useForm();
  let [areacodeselected, setareacodeselected] = useState(57);
  let [numberareacode, setnumberareacode] = useState(null);
  let [fieldCode, setFieldCode] = useState(null);
  initialValues.codearea=null;

  useEffect(() => {
    let formType = !eventUserId ? 'register' : 'transfer';
    setFormMessage(FormTags(formType));
    setSubmittedForm(false);
    hideConditionalFieldsToDefault(conditionals, eventUser);

    getEventData(eventId);
    form.resetFields();
    if (window.fbq) {
      window.fbq('track', 'CompleteRegistration');
    }
  }, [eventUser, eventUserId, initialValues, conditionals, eventId]);

  useEffect(() => {
   
    if (!extraFields) return;
    let codeareafield = extraFields.filter((field) => field.type == 'codearea');
  if(codeareafield[0] ){
    
    let phonenumber =
      eventUser && codeareafield[0] && eventUser['properties'] ? eventUser['properties'][codeareafield[0].name] : '';
      let codeValue =
      eventUser&& eventUser['properties'] ? eventUser['properties']["code"] : '';
      console.log( eventUser && eventUser['properties']&&eventUser['properties'])      
      setFieldCode(codeareafield[0].name)      
    if (phonenumber &&  numberareacode==null ) {
      console.log("PHONE ACA==>",phonenumber.toString())
      let splitphone = phonenumber.toString().split(' ');
      setareacodeselected(codeValue );
      //setnumberareacode( );
      console.log("SPLIT2==>",codeValue  )
    }
  }
  }, [extraFields]);

  const showGeneralMessage = () => {
    setGeneralFormErrorMessageVisible(true);
    setTimeout(() => {
      setGeneralFormErrorMessageVisible(false);
    }, 3000);
  };

  //Funcion para traer los datos del event para obtener la variable validateEmail y enviarla al estado
  const getEventData = async (eventId) => {
    const data = await EventsApi.getOne(eventId);
    setEvent(data);
  };

  const onFinish = async (values) => {    
    if (areacodeselected) {
      //values[fieldCode] = `${numberareacode}`;
      values['code']=areacodeselected;
    }
    console.log("VALUES;",values)
   
  setSectionPermissions({ view: false, ticketview: false });
    values.password = password;
    let ruta = '';
    if (imageAvatar) {
      if (imageAvatar.fileList.length > 0) {
        ruta = await saveImageStorage(imageAvatar.fileList[0].thumbUrl);
      }
      values.picture = ruta;
    }

    // values.files = fileSave

    setGeneralFormErrorMessageVisible(false);
    setNotLoggedAndRegister(false);

    const key = 'registerUserService';

    // message.loading({ content: !eventUserId ? "Registrando Usuario" : "Realizando Transferencia", key }, 10);
    message.loading({ content: intl.formatMessage({ id: 'registration.message.loading' }), key }, 10);

    const snap = { properties: { ...values, typeRegister: typeRegister } };

    let textMessage = {};
    textMessage.key = key;
    if (eventUserId) {
      try {
        await TicketsApi.transferToUser(eventId, eventUserId, snap);
        // textMessage.content = "Transferencia Realizada";
        textMessage.content = formMessage.successMessage;
        setSuccessMessage(`Se ha realizado la transferencia del ticket al correo ${values.email}`);

        setSubmittedForm(true);
        message.success(textMessage);
        setTimeout(() => {
          closeModal({ status: 'sent_transfer', message: 'Transferencia Hecha' });
        }, 4000);
      } catch (err) {
        console.error('Se presento un problema', err);
        // textMessage.content = "Error... Intentalo mas tarde";
        textMessage.content = formMessage.errorMessage;
        message.error(textMessage);
      }
    } else {
      try {
        let resp = await UsersApi.createOne(snap, eventId);

        // CAMPO LISTA  tipo justonebyattendee. cuando un asistente selecciona una opción esta
        // debe desaparecer del listado para que ninguna otra persona la pueda seleccionar
        //
        let camposConOpcionTomada = extraFields.filter((m) => m.type == 'list' && m.justonebyattendee);
        updateTakenOptionInTakeableList(camposConOpcionTomada, values, eventId);

        //FIN CAMPO LISTA  tipo justonebyattendee //

        //if (resp.status !== 'UPDATED') {

          if (resp.data && resp.data.user && resp.data.user.initial_token){
          setSuccessMessageInRegisterForm(resp.status);
          // let statusMessage = resp.status === "CREATED" ? "Registrado" : "Actualizado";
          // textMessage.content = "Usuario " + statusMessage;
          textMessage.content = 'Usuario ' + formMessage.successMessage;

          let $msg =
            event.registration_message ||
            `Fuiste registrado al evento  ${values.email || ''}, revisa tu correo para confirmar.`;

          setSuccessMessage($msg);

          setSubmittedForm(true);
          message.success(intl.formatMessage({ id: 'registration.message.created' }));

          //Si validateEmail es verdadera redirigirá a la landing con el usuario ya logueado
          //todo el proceso de logueo depende del token en la url por eso se recarga la página
          if (event.validateEmail && resp.data.user.initial_token) {
            setLogguedurl(`/landing/${eventId}?token=${resp.data.user.initial_token}`);
            setTimeout(function() {
              window.location.replace(
                //`/landing/${eventId}/success/${typeRegister}?token=${resp.data.user.initial_token}`
                `/landing/${eventId}?token=${resp.data.user.initial_token}`
              );
            }, 100);
          }else{
            window.location.replace(`/landing/${eventId}/success/${typeRegister}`);
          }
        } else {
          //Usuario ACTUALIZADO
          // let msg =
          //   'Ya se ha realizado previamente el registro con el correo: ' +
          //   values.email +
          //   ', se ha enviado un nuevo correo con enlace de ingreso.';
          // textMessage.content = msg;
          if (typeRegister == 'free') {
            let msg =
              intl.formatMessage({ id: 'registration.already.registered' }) +
              ' ' +
              intl.formatMessage({ id: 'registration.message.success.subtitle' });

            textMessage.content = msg;

            setSuccessMessage(msg);
            // Retorna un mensaje en caso de que ya se encuentre registrado el correo
            setNotLoggedAndRegister(true);
            message.success(msg);
          } else {
            //alert('A PAGAR');
            setPayMessage(true);
          }
        }
      } catch (err) {
        // textMessage.content = "Error... Intentalo mas tarde";
        textMessage.content = formMessage.errorMessage;

        textMessage.key = key;
        message.error(textMessage);
      }
    }
  };

  const valuesChange = (allFields) => {
      updateFieldsVisibility(conditionals, allFields);
  };

  const updateFieldsVisibility = (conditionals, allFields) => {    
    let newExtraFields = [...extraFieldsOriginal];
    console.log("newExtraFields",newExtraFields)
    console.log("CONDITIONALS=>",conditionals)   
    newExtraFields = newExtraFields.filter((field) => {
      let fieldShouldBeDisplayed = false;
      let fieldHasCondition = false;

      //para cada campo revisamos si se cumplen todas las condiciones para mostrarlo
      
      conditionals.map((conditional) => {
        let fieldExistInThisCondition = conditional.fields.indexOf(field.name) !== -1;
        console.log("fieldExistInThisCondition==>",fieldExistInThisCondition)
        if (!fieldExistInThisCondition) return;

        fieldHasCondition = true;

        //Revisamos si las condiciones del campo tienen los valores adecuados para que se muestre
        let fulfillConditional = false;
        Object.keys(allFields).map((changedkey) => {
          if (changedkey === conditional.fieldToValidate) {
            fulfillConditional = conditional.value === allFields[changedkey];
          }
        });

        if (fulfillConditional) {
          fieldShouldBeDisplayed = true;
        }        
      });
      return (fieldHasCondition && fieldShouldBeDisplayed) || !fieldHasCondition;
    });
    setExtraFields(newExtraFields);
  };

  const hideConditionalFieldsToDefault = (conditionals, eventUser) => {
    let allFields = eventUser && eventUser['properties'] ? eventUser['properties'] : [];
    updateFieldsVisibility(conditionals, allFields);
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
    return isLt5M ? true : false;
  };

  /**
   * Crear inputs usando ant-form, ant se encarga de los onChange y de actualizar los valores
   */
  const renderForm = useCallback(() => {
    if (!extraFields) return '';
    let formUI = extraFields.map((m, key) => {
      if (m.visibleByAdmin == true) {
        return;
      }

      let type = m.type || 'text';
      let props = m.props || {};
      let name = m.name;
      let label = m.label;
      let mandatory = m.mandatory;
      let description = m.description;
      let labelPosition = m.labelPosition;
      let target = name;
      let value = eventUser && eventUser['properties'] ? eventUser['properties'][target] : '';

      //no entiendo b esto para que funciona
      if (conditionals.state === 'enabled') {
        if (label === conditionals.field) {
          if (true == true || value === [conditionals.value]) {
            label = conditionals.field;
          } else {
            return;
          }
        }
      }
      let input = (
        <Input
          disabled={m.name == 'email' && initialValues.email ? true : false}
          {...props}
          addonBefore={
            labelPosition === 'izquierda' && (
              <span>
                {mandatory && <span style={{ color: 'red' }}>* </span>}
                <strong>{label}</strong>
              </span>
            )
          }
          type={type}
          key={key}
          name={name}
          defaultValue={value}
        />
      );

      if (type === 'codearea') {
        const prefixSelector =(
          <Select
              style={{ width: '100%' }}
              value={areacodeselected}              
              //required={mandatory}
              onChange={(val) => {setareacodeselected(val);console.log(val)}}
              placeholder='Codigo de area del pais'>
              {areaCode.map((code, key) => {
                return (
                  <Option key={key} value={code.value}>
                    {code.label + ' (+' + code.value + ')'}
                  </Option>
                );
              })}
            </Select>
        );
        input = (        
            <Input
            addonBefore={prefixSelector} 
              //onChange={(e) => setnumberareacode(e.target.value)}
              defaultvalue={value?.toString().split()[2]}
              name={name}
              //required={mandatory}
              type='number'
              key={key}
              style={{ width: '100%' }}
              placeholder='Numero de telefono'
            />     
        );
      }

      if (type === 'tituloseccion') {
        input = (
          <React.Fragment>
            <div className={`label has-text-grey ${mandatory ? 'required' : ''}`}>
              <div
                dangerouslySetInnerHTML={{
                  __html: label,
                }}></div>
            </div>
            <Divider />
          </React.Fragment>
        );
      }

      if (type === 'multiplelisttable') {
        input = <ReactSelect options={m.options} isMulti name={name} />;
      }

      if (type === 'boolean') {
        input = (
          <Checkbox {...props} key={key} name={name} defaultChecked={Boolean(value)}>
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
        input = <TextArea rows={4} autoSize={{ minRows: 3, maxRows: 25 }} value={value} defaultValue={value} />;
      }

      if (type === 'multiplelist') {
        input = (
          <Checkbox.Group
            options={m.options}
            defaultValue={value}
            onChange={(checkedValues) => {
              value = JSON.stringify(checkedValues);
            }}
          />
        );
      }

      if (type === 'file') {
        input = (
          <Upload
            accept='application/pdf'
            action='https://api.evius.co/api/files/upload/'
            multiple={false}
            listType='text'
            beforeUpload={beforeUpload}
            defaultFileList={
              value && value.fileList
                ? value.fileList.map((file) => {
                    file.url = file.response || null;
                    return file;
                  })
                : []
            }>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        );
      }

      if (type === 'list') {
        //Filtramos las opciones ya tomadas si la opción justonebyattendee esta activada

        let fieldId = m._id && m._id['$oid'] ? m._id['$oid'] : m._id;

        if (event && m.justonebyattendee && m.options) {
          let takenoptions = event['takenoptions_' + fieldId];
          if (takenoptions) {
            m.options = m.options.filter((x) => {
              return takenoptions.filter((c) => x.value == c.value).length <= 0;
            });
          }
        }
        input = m.options.map((o, key) => {
          return (
            <Option key={key} value={o.value}>
              {o.value}
            </Option>
          );
        });
        input = (
          <Select style={{ width: '100%' }} name={name} defaultValue={value}>
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

      if (type === 'password') {
        input = (
          <Password
            name='password'
            placeholder='Ingrese su password'
            onChange={(e) => setPassword(e.target.value)}
            key={key}
            defaultValue={value}
            value={password}
            pattern='(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$'
            title={intl.formatMessage({ id: 'form.validate.message.password' })}
            required={true}
            message={intl.formatMessage({ id: 'form.field.required' })}
          />
        );
      }

      if (name === 'picture') {
        ImgUrl = ImgUrl !== '' ? ImgUrl : value !== '' && value !== null ? [{ url: value }] : undefined;

        input = (
          <div style={{ textAlign: 'center' }}>
            <ImgCrop rotate>
              <Upload
                accept='image/png,image/jpeg'
                onChange={(file) => {
                  setImageAvatar(file);
                  setImgUrl(file.fileList);
                }}
                multiple={false}
                listType='picture-card'
                maxCount={1}
                fileList={ImgUrl}
                beforeUpload={beforeUpload}>
                <Button icon={<UploadOutlined />}>Avatar</Button>
              </Upload>
            </ImgCrop>
          </div>
        );
      }

      let rule = name == 'email' || name == 'names' ? { required: true } : { required: mandatory };

      //esogemos el tipo de validación para email
      rule = type === 'email' ? { ...rule, type: 'email' } : rule;

      rule =
        type == 'password'
          ? {
              required: true,
              type: 'regexp',
              pattern: new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{10,}$/),
              message: 'El formato del password no es valido',
            }
          : rule;

      // let hideFields =
      //   mandatory === true || name === "email" || name === "names" ? { display: "block" } : { display: "none" };

      if (type === 'boolean' && mandatory) {
        let textoError = intl.formatMessage({ id: 'form.field.required' });
        rule = { validator: (_, value) => (value ? Promise.resolve() : Promise.reject(textoError)) };
      }

      console.log("RULES==>",rule,name)

      return (
        <div key={'g' + key} name='field'>
          {type === 'tituloseccion' && input}
          {type !== 'tituloseccion' && (
            <>
              <Form.Item
              // validateStatus={type=='codearea' && mandatory && (numberareacode==null || areacodeselected==null)&& 'error'}
                // style={eventUserId && hideFields}
                valuePropName={type === 'boolean' ? 'checked' : 'value'}
                label={
                  (labelPosition !== 'izquierda' || !labelPosition) && type !== 'tituloseccion'
                    ? label
                    : '' && (labelPosition !== 'arriba' || !labelPosition)
                }
                name={name}
                rules={[rule]}
                key={'l' + key}
                htmlFor={key}
                initialValue={value}>
                {input}
              </Form.Item>

              {description && description.length < 500 && <p>{description}</p>}
              {description && description.length > 500 && (
                <Collapse defaultActiveKey={['0']} style={{ margingBotton: '15px' }}>
                  <Panel header={intl.formatMessage({ id: 'registration.message.policy' })} key='1'>
                    <pre style={{ whiteSpace: 'normal' }}>{description}</pre>
                  </Panel>
                </Collapse>
              )}
            </>
          )}
        </div>
      );
    });
    return formUI;
  });

  return (
    <>
      <Col xs={24} sm={22} md={18} lg={18} xl={18} style={center}>
        {!submittedForm ? (
          <Card
            title={
              eventUser !== undefined && eventUser !== null
                ? intl.formatMessage({ id: 'registration.title.update' })
                : intl.formatMessage({ id: 'registration.title.create' })
            }
            bodyStyle={textLeft}>
            {/* //Renderiza el formulario */}
            {eventId && eventId == '60cb7c70a9e4de51ac7945a2' && !eventUser && (
              <TypeRegister typeRegister={typeRegister} setTypeRegister={setTypeRegister} />
            )}
            {eventUser !== undefined &&
              eventUser !== null &&
              eventUser.rol_id == '60e8a7e74f9fb74ccd00dc22' &&
              eventId &&
              eventId == '60cb7c70a9e4de51ac7945a2' && <ButtonPayment />}
            <Form
              form={form}
              layout='vertical'
              onFinish={onFinish}
              validateMessages={{
                required: intl.formatMessage({ id: 'form.field.required' }),
                types: {
                  email: intl.formatMessage({ id: 'form.validate.message.email' }),
                  regexp: 'malo',
                },
              }}
              initialValues={initialValues}
              onFinishFailed={showGeneralMessage}
              onValuesChange={valuesChange}>
              {/*eventId && eventId == '60cb7c70a9e4de51ac7945a2' && (
                <Row justify={'center'} style={{ marginBottom: 30 }}>
                  <Card style={{ width: 700, margin: 'auto', background: '#F7C2C6' }}>
                    <InfoCircleOutlined /> Una vez registrado para acceder a la puja de obras debes realizar la donación
                  </Card>
                </Row>
              )*/}
              {renderForm()}

              <Row gutter={[24, 24]}>
                <Col span={24} style={{ display: 'inline-flex', justifyContent: 'center' }}>
                  {generalFormErrorMessageVisible && (
                    <Alert message={intl.formatMessage({ id: 'form.missing.required.fields' })} type='warning' />
                  )}
                </Col>
              </Row>

              <Row gutter={[24, 24]}>
                <Col span={24} style={{ display: 'inline-flex', justifyContent: 'center' }}>
                  {notLoggedAndRegister && (
                    <Alert
                      message={intl.formatMessage({ id: 'registration.already.registered' })}
                      description={intl.formatMessage({ id: 'registration.message.success.subtitle' })}
                      type='warning'
                      showIcon
                      closable
                    />
                  )}
                </Col>

                <Col span={24} style={{ display: 'inline-flex', justifyContent: 'center' }}>
                  <Form.Item>
                    <Button type='primary' htmlType='submit'>
                      {eventUser
                        ? intl.formatMessage({ id: 'registration.button.update' })
                        : eventId === '5f9824fc1f8ccc414e33bec2'
                        ? 'Votar y Enviar'
                        : intl.formatMessage({ id: 'registration.button.create' })}
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        ) : (
          <LoadingOutlined style={{ fontSize: '40px' }} />
        )}
      </Col>
    </>
  );
};

const mapDispatchToProps = {
  setSectionPermissions,
};

export default connect(null, mapDispatchToProps)(FormRegister);
