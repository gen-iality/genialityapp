import { useState, useEffect, useRef, useCallback } from 'react';
import { UsersApi, TicketsApi, EventsApi, EventFieldsApi } from '../../../helpers/request';
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
  Divider,
  Upload,
  Select,
  Spin,
  Comment,
  Typography,
} from 'antd';
import { LoadingOutlined, PlayCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import ReactSelect from 'react-select';
import { useIntl } from 'react-intl';
import ImgCrop from 'antd-img-crop';

import { areaCode } from '../../../helpers/constants';
import TypeRegister from '../../tickets/typeRegister';
import { ButtonPayment } from './payRegister';
import { setSectionPermissions } from '../../../redux/sectionPermissions/actions';
import { connect } from 'react-redux';
import { useHelper } from '../../../context/helperContext/hooks/useHelper';
import { UseUserEvent } from '../../../context/eventUserContext';
import { UseEventContext } from '../../../context/eventContext';
import { UseCurrentUser } from '../../../context/userContext';
import { app } from '../../../helpers/firebase';
import { DispatchMessageService } from '../../../context/MessageService';

const { Option } = Select;
const { Panel } = Collapse;
const { TextArea, Password } = Input;

const textLeft = {
  textAlign: 'left',
  width: '100%',
  padding: '10px',
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
//OBTENER NOMBRE ARCHIVO
function obtenerName(fileUrl) {
  if (typeof fileUrl == 'string') {
    let splitUrl = fileUrl?.split('/');
    return splitUrl[splitUrl.length - 1];
  } else {
    return null;
  }
}

function isVisibleButton(basicDataUser, extraFields, cEventUser) {
  if (
    Object.keys(basicDataUser).length > 0 ||
    (fieldsAditional(extraFields) == 0 && Object.keys(basicDataUser).length == 0 && cEventUser.value !== null)
  ) {
    return true;
  }
  return false;
}

function fieldsAditional(extraFields) {
  if (extraFields) {
    const countFields = extraFields.filter(
      (field) => field.name !== 'names' && field.name !== 'email' && field.type !== 'password'
    );
    return countFields.length;
  }
  return 0;
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
  initialOtherValue,
  eventId,
  fields,
  eventUserOther,
  eventUserId,
  closeModal,
  conditionalsOther,
  organization,
  callback,
  options,
  loadingregister,
  setSectionPermissions,
  errorRegisterUser,
  basicDataUser = {},
  dataEventUser = {},
  HandleHookForm = () => {},
  setvalidateEventUser = () => {},
  validateEventUser,
}) => {
  const intl = useIntl();
  const cEvent = UseEventContext();
  const cEventUser = UseUserEvent();
  const cUser = UseCurrentUser();
  const {
    authModalState,
    typeModal,
    eventPrivate,
    handleChangeTypeModal,
    setRegister,
    authModalDispatch,
  } = useHelper();
  const [extraFields, setExtraFields] = useState(cEvent.value?.user_properties || [] || fields);
  const [submittedForm, setSubmittedForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [generalFormErrorMessageVisible, setGeneralFormErrorMessageVisible] = useState(false);
  const [notLoggedAndRegister, setNotLoggedAndRegister] = useState(false);
  const [formMessage, setFormMessage] = useState({});
  const [country, setCountry] = useState();
  const [region, setRegion] = useState();
  // const [password, setPassword] = useState('');
  const [event, setEvent] = useState(null);
  const [loggedurl, setLogguedurl] = useState(null);
  const [imageAvatar, setImageAvatar] = useState(null);
  let [ImgUrl, setImgUrl] = useState('');
  const [typeRegister, setTypeRegister] = useState('pay');
  const [payMessage, setPayMessage] = useState(false);
  const [form] = Form.useForm();
  let [areacodeselected, setareacodeselected] = useState();
  let [numberareacode, setnumberareacode] = useState(null);
  let [fieldCode, setFieldCode] = useState(null);
  const [initialValues, setinitialValues] = useState({});

  const [conditionals, setconditionals] = useState(
    organization ? conditionalsOther : cEvent.value?.fields_conditions || []
  );
  const [eventUser, seteventUser] = useState(organization ? eventUserOther : cEventUser.value || {});
  const [extraFieldsOriginal, setextraFieldsOriginal] = useState(
    organization ? fields : cEvent.value?.user_properties || {}
  );
  const buttonSubmit = useRef(null);

  useEffect(() => {
    let initialValuesGeneral = {};
    if (basicDataUser || basicDataUser) {
      initialValuesGeneral = {
        ...basicDataUser,
        ...dataEventUser,
      };
    }
    setinitialValues(
      organization
        ? initialOtherValue
        : cEventUser?.value != null && cEventUser?.value != undefined
        ? cEventUser?.value?.properties
        : cUser.value
        ? cUser.value
        : initialValuesGeneral
    );
  }, [cUser.value, cEventUser]);

  useEffect(() => {
    if (validateEventUser?.status) {
      buttonSubmit?.current?.click();
    }
  }, [validateEventUser?.status, validateEventUser?.statusFields]);

  useEffect(() => {
    let formType = !cEventUser.value?._id ? 'register' : 'transfer';
    setFormMessage(FormTags(formType));
    setSubmittedForm(false);
    hideConditionalFieldsToDefault(conditionals, cEventUser);

    !organization && getEventData(eventId);
    form.resetFields();
    if (window.fbq) {
      window.fbq('track', 'CompleteRegistration');
    }
  }, [cEventUser.value, initialValues, conditionals, cEvent.value?._id]);

  useEffect(() => {
    if (!extraFields) return;
    let codeareafield = extraFields.filter((field) => field.type == 'codearea');
    if (codeareafield[0]) {
      let phonenumber =
        eventUser && codeareafield[0] && eventUser['properties'] ? eventUser['properties'][codeareafield[0].name] : '';
      let codeValue = eventUser && eventUser['properties'] ? eventUser['properties']['code'] : '';
      setFieldCode(codeareafield[0].name);
      if (phonenumber && numberareacode == null) {
        let splitphone = phonenumber.toString().split(' ');
        setareacodeselected(codeValue);
      }
    }
    let pais = extraFields.filter((field) => field.type == 'country');
    if (pais[0]) {
      let paisSelected = initialValues && pais[0] ? initialValues[pais[0].name] : '';
      setCountry(paisSelected);
    }
  }, []);

  useEffect(() => {
    form.resetFields();
    setGeneralFormErrorMessageVisible(false);
  }, [authModalState.currentAuthScreen, typeModal]);

  const showGeneralMessage = (values, error, date) => {
    setvalidateEventUser({
      ...validateEventUser,
      statusFields: false,
    });
    setGeneralFormErrorMessageVisible(true);
    setTimeout(() => {
      setGeneralFormErrorMessageVisible(false);
    }, 4000);
  };

  //Funcion para traer los datos del event para obtener la variable validateEmail y enviarla al estado
  const getEventData = async (eventId) => {
    const data = await EventsApi.getOne(cEvent.value?._id);
    setEvent(data);
  };

  const onFinish = async (values) => {
    if (Object.keys(basicDataUser).length > 0) {
      setvalidateEventUser({
        statusFields: true,
        status: false,
      });
      return;
    }

    if (values['email']) {
      values['email'] = values['email'].toLowerCase();
    }

    if (areacodeselected) {
      values['code'] = areacodeselected;
    }

    //OBTENER RUTA ARCHIVOS FILE
    Object.values(extraFields).map((value) => {
      if (value.type == 'file') {
        values[value.name] = values[value.name]?.fileList
          ? values[value.name]?.fileList[0]?.response.trim()
          : typeof values[value.name] == 'string'
          ? values[value.name]
          : null;
      }
    });

    if (imageAvatar) {
      if (imageAvatar.fileList[0]) {
        values.picture = imageAvatar.fileList[0].response;
      } else {
        values.picture = '';
      }
    } else {
      delete values.picture;
    }
    if (callback) {
      callback(values);
    } else {
      const { data } = await EventsApi.getStatusRegister(cEvent.value?._id, values.email);
      if (data.length == 0 || cEventUser.value) {
        setSectionPermissions({ view: false, ticketview: false });
        // values.password = password;

        // values.files = fileSave

        setGeneralFormErrorMessageVisible(false);
        setNotLoggedAndRegister(false);

        const key = 'registerUserService';

        // message.loading({ content: !eventUserId ? "Registrando Usuario" : "Realizando Transferencia", key }, 10);
        DispatchMessageService({
          type: 'loading',
          key: 'loading',
          msj: intl.formatMessage({ id: 'registration.message.loading' }),
          duration: 10,
          action: 'show',
        });

        const registerBody = { ...values };
        const eventUserBody = {
          properties: { ...values, typeRegister: typeRegister },
        };

        let textMessage = {};
        textMessage.key = key;
        let eventUserId;

        if (eventUserId) {
          try {
            await TicketsApi.transferToUser(cEvent.value?._id, eventUserId, registerBody);
            // textMessage.content = "Transferencia Realizada";
            textMessage.content = formMessage.successMessage;
            setSuccessMessage(`Se ha realizado la transferencia del ticket al correo ${values.email}`);

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
            setTimeout(() => {
              closeModal({
                status: 'sent_transfer',
                message: 'Transferencia Hecha',
              });
            }, 4000);
          } catch (err) {
            // textMessage.content = "Error... Intentalo mas tarde";
            textMessage.content = formMessage.errorMessage;
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
        } else {
          try {
            let resp = undefined;
            switch (typeModal) {
              case 'registerForTheEvent':
                const registerForTheEventData = await UsersApi.createOne(eventUserBody, cEvent.value?._id);
                resp = registerForTheEventData;

                break;

              case 'update':
                const updateData = await UsersApi.editEventUser(eventUserBody, cEvent.value?._id, cEventUser.value._id);
                resp = updateData;
                break;

              default:
                resp = await UsersApi.createUser(registerBody, cEvent.value?._id);

                break;
            }

            // CAMPO LISTA  tipo justonebyattendee. cuando un asistente selecciona una opción esta
            // debe desaparecer del listado para que ninguna otra persona la pueda seleccionar
            //
            let camposConOpcionTomada = extraFields.filter((m) => m.type == 'list' && m.justonebyattendee);
            updateTakenOptionInTakeableList(camposConOpcionTomada, values, cEvent.value?._id);

            if (resp && resp._id) {
              setSuccessMessageInRegisterForm(resp.status);
              cEventUser.setUpdateUser(true);
              handleChangeTypeModal(null);
              textMessage.content = 'Usuario ' + formMessage.successMessage;

              let $msg =
                organization == 1
                  ? ''
                  : event.registration_message ||
                    `Fuiste registrado al evento  ${values.email || ''}, revisa tu correo para confirmar.`;

              setSuccessMessage($msg);

              setSubmittedForm(true);
              DispatchMessageService({
                type: 'success',
                msj: intl.formatMessage({ id: 'registration.message.created' }),
                action: 'show',
              });

              //Si validateEmail es verdadera redirigirá a la landing con el usuario ya logueado
              //todo el proceso de logueo depende del token en la url por eso se recarga la página
              if (!cEvent?.value?.validateEmail && resp._id) {
                const loginFirebase = async () => {
                  app
                    .auth()
                    .signInWithEmailAndPassword(resp.email || resp.properties.email, values.password)
                    .then((response) => {
                      if (response.user) {
                        cEventUser.setUpdateUser(true);
                        handleChangeTypeModal(null);
                        setSubmittedForm(false);
                        switch (typeModal) {
                          case 'registerForTheEvent':
                            setRegister(2);
                            break;

                          case 'update':
                            setRegister(4);
                            break;
                        }
                        // }
                      } else {
                        setErrorLogin(true);
                      }
                    });
                };
                loginFirebase();
              } else {
                window.location.replace(
                  `/landing/${cEvent.value?._id}/${eventPrivate.section}?register=${cEventUser.value == null ? 1 : 4}`
                );
              }
            } else {
              if (typeRegister == 'free') {
                let msg =
                  intl.formatMessage({
                    id: 'registration.already.registered',
                  }) +
                  ' ' +
                  intl.formatMessage({
                    id: 'registration.message.success.subtitle',
                  });

                textMessage.content = msg;

                setSuccessMessage(msg);
                // Retorna un mensaje en caso de que ya se encuentre registrado el correo
                setNotLoggedAndRegister(true);
                DispatchMessageService({
                  type: 'success',
                  msj: msg,
                  action: 'show',
                });
              } else {
                setPayMessage(true);
              }
            }
          } catch (err) {
            textMessage.content = formMessage.errorMessage;
            textMessage.key = key;
            DispatchMessageService({
              type: 'error',
              msj: textMessage,
              action: 'show',
            });
          }
        }
      } else {
        setNotLoggedAndRegister(true);
      }
    }
  };

  const ValidateEmptyFields = (allValues) => {
    // if (allValues.picture == '') {
    //   delete allValues.picture;
    // }
    // if (basicDataUser || dataEventUser) {
    //   let noneEmpyFields = Object.keys(allValues).filter((m) => allValues[m] == '' || allValues[m] == undefined).length;
    //   console.log('leng', noneEmpyFields, Object.keys(allValues).length);
    //   if (noneEmpyFields == 0) {
    //     console.log('activelo');
    //     hookValidations(false, '');
    //   } else {
    //     hookValidations(
    //       true,
    //       intl.formatMessage({
    //         id: 'feedback.title.error',
    //         defaultMessage: 'Complete los campos solicitados correctamente.',
    //       })
    //     );
    //   }
    // }
  };

  const valuesChange = (changedValues, allValues) => {
    //validar que todos los campos de event user esten llenos
    ValidateEmptyFields(allValues);
    let e = {
      target: {
        value: changedValues[Object.keys(changedValues)[0]],
      },
    };
    HandleHookForm(e, Object.keys(changedValues)[0], null);
    updateFieldsVisibility(conditionals, allValues);
  };

  const updateFieldsVisibility = (conditionals, allFields) => {
    let newExtraFields = [...extraFieldsOriginal];

    newExtraFields = newExtraFields.filter((field) => {
      let fieldShouldBeDisplayed = false;
      let fieldHasCondition = false;

      //para cada campo revisamos si se cumplen todas las condiciones para mostrarlo

      conditionals.map((conditional) => {
        let fieldExistInThisCondition = conditional.fields.indexOf(field.name) !== -1;

        if (!fieldExistInThisCondition) return;
        fieldHasCondition = true;
        //Revisamos si las condiciones del campo tienen los valores adecuados para que se muestre
        let fulfillConditional = false;

        //valor actual del condicional en el formulario
        let valueToValidate = allFields[conditional.fieldToValidate];
        fulfillConditional = conditional.value === valueToValidate;
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
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      DispatchMessageService({
        type: 'error',
        msj: 'Image must smaller than 5MB!',
        action: 'show',
      });
    }
    return isLt5M ? true : false;
  };

  function validateUrl() {
    let url = window.location.pathname;
    return url.includes('/landing/') ? true : false;
  }
  /**
   * Crear inputs usando ant-form, ant se encarga de los onChange y de actualizar los valores
   */
  const renderForm = useCallback(() => {
    if (!extraFields) return '';
    let formUI = extraFields.map((m, key) => {
      /* console.log(m, key) */
      if (m.visibleByAdmin == true) {
        return;
      }
      //Este if es nuevo para poder validar las contraseñas viejos (nuevo flujo para no mostrar esos campos)
      if (m.name !== 'contrasena' && m.name !== 'password') {
        let type = m.type || 'text';
        let props = m.props || {};
        let name = m.name;
        let label = m.label;
        let mandatory = m.mandatory;
        let description = m.description;
        let labelPosition = m.labelPosition;
        let target = name;
        let value = callback
          ? eventUser && eventUser['properties']
            ? eventUser['properties'][target]
            : ''
          : initialValues
          ? initialValues[target]
          : '';
        //VISIBILIDAD DE CAMPOS
        let visible =
          (initialValues?.email && name == 'email') || (initialValues?.names && name == 'names') ? true : false;

        /* console.log(initialValues, 'initialValues', m) */

        //no entiendo b esto para que funciona
        // if (conditionals.state === "enabled") {
        //   if (label === conditionals.field) {
        //     if (true == true || value === [conditionals.value]) {
        //       label = conditionals.field;
        //     } else {
        //       return;
        //     }
        //   }
        // }
        let input = (
          <Input
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
          const prefixSelector = (
            <Select
              showSearch
              optionFilterProp='children'
              style={{ fontSize: '12px', width: 150 }}
              value={areacodeselected}
              onChange={(val) => {
                setareacodeselected(val);
                //console.log(val);
              }}
              placeholder='Código de area del pais'>
              {areaCode.map((code, key) => {
                return (
                  <Option key={key} value={code.value}>
                    {`${code.label} (+${code.value})`}
                  </Option>
                );
              })}
            </Select>
          );
          input = (
            <Input
              // addonBefore={prefixSelector}
              //onChange={(e) => setnumberareacode(e.target.value)}
              defaultvalue={value?.toString().split()[2]}
              disabled={
                /* cEvent.value.allow_register === false && Este para el caso que se evalue tambien anonimo */
                //como validar cuando es usuario y admin?
                cUser.value?.autorizaciontratamientodedatospersonales === true
                  ? true
                  : m.name == 'email' && initialValues?.email
                  ? true
                  : cEvent?.value?.visibility === 'PUBLIC' && m.name == 'names' && initialValues?.names
                  ? true
                  : false
              }
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
              //required={mandatory}
              // type='number'
              // key={key}
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

        let rule = name == 'email' || name == 'names' ? { required: true } : { required: mandatory };
        if (type === 'multiplelisttable') {
          input = <ReactSelect options={m.options} isMulti name={name} />;
        }

        if (type === 'boolean') {
          if (mandatory) {
            let textoError = intl.formatMessage({ id: 'form.field.required' });

            rule = {
              validator: (_, value) => (value == true ? Promise.resolve() : Promise.reject(textoError)),
            };
          } else {
            rule = {
              validator: (_, value) =>
                value == true || value == false || value == '' || value == undefined
                  ? Promise.resolve()
                  : Promise.reject(textoError),
            };
          }
          return (
            <div key={'g' + key} name='field'>
              {
                <>
                  <Form.Item
                    valuePropName={'checked'}
                    name={name}
                    rules={[rule]}
                    form={form}
                    key={'l' + key}
                    htmlFor={key}
                    initialValue={value}>
                    <Checkbox {...props} key={key} name={name} defaultChecked={Boolean(value ? value : false)}>
                      {mandatory ? (
                        <span>
                          <span style={{ color: 'red' }}>* </span>
                          <strong>{label}</strong>
                        </span>
                      ) : (
                        label
                      )}
                    </Checkbox>
                  </Form.Item>
                  {cEvent.value?._id == '60cb7c70a9e4de51ac7945a2' && (
                    <Row style={{ marginTop: 20 }}>
                      {' '}
                      <a target='_blank' rel='noreferrer' href={'https://tiempodejuego.org/tyclaventana/'}>
                        <PlayCircleOutlined /> Ver términos y condiciones
                      </a>
                    </Row>
                  )}
                  {description && description.length < 500 && <p>{description}</p>}
                  {description && description.length > 500 && (
                    <Collapse defaultActiveKey={['0']} style={{ margingBotton: '15px' }}>
                      <Panel
                        header={intl.formatMessage({
                          id: 'registration.message.policy',
                        })}
                        key='1'>
                        <pre
                          dangerouslySetInnerHTML={{
                            __html: description,
                          }}
                          style={{ whiteSpace: 'normal' }}></pre>
                      </Panel>
                    </Collapse>
                  )}
                </>
              }
            </div>
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
              accept='application/pdf,image/png, image/jpeg,image/jpg,application/msword,.docx'
              action='https://api.evius.co/api/files/upload/'
              multiple={false}
              listType='text'
              beforeUpload={beforeUpload}
              defaultFileList={
                value
                  ? [
                      {
                        name: typeof value == 'string' ? obtenerName(value) : null,
                        url: typeof value == 'string' ? value : null,
                      },
                    ]
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
                {o.label}
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

        //SE DEBE QUEDAR PARA RENDRIZAR EL CAMPO IMAGEN DENTRO DEL CMS
        if (type === 'avatar') {
          ImgUrl = ImgUrl !== '' ? ImgUrl : value !== '' && value !== null ? [{ url: value }] : undefined;

          input = (
            <div style={{ textAlign: 'center' }}>
              <ImgCrop rotate shape='round'>
                <Upload
                  action={'https://api.evius.co/api/files/upload/'}
                  accept='image/png,image/jpeg'
                  onChange={(file) => {
                    setImageAvatar(file);
                  }}
                  multiple={false}
                  listType='picture'
                  maxCount={1}
                  defaultFileList={
                    value
                      ? [
                          {
                            name: typeof value == 'string' ? obtenerName(value) : null,
                            url: typeof value == 'string' ? value : null,
                          },
                        ]
                      : []
                  }
                  beforeUpload={beforeUpload}>
                  <Button type='primary' icon={<UploadOutlined />}>
                    {intl.formatMessage({
                      id: 'form.button.avatar',
                      defaultMessage: 'Subir imagen de perfil',
                    })}
                  </Button>
                </Upload>
              </ImgCrop>
            </div>
          );
        }

        //esogemos el tipo de validación para email
        rule = type === 'email' ? { ...rule, type: 'email' } : rule;

        rule =
          type == 'password'
            ? {
                required: true,
                pattern: new RegExp(/^[A-Za-z0-9_-]{8,}$/),
                message: 'Mínimo 8 caracteres con letras y números, no se permiten caracteres especiales',
              }
            : rule;

        return (
          type !== 'boolean' && (
            <div key={'g' + key} name='field'>
              {type === 'tituloseccion' && input}
              {type !== 'tituloseccion' && (
                <>
                  <Form.Item
                    // validateStatus={type=='codearea' && mandatory && (numberareacode==null || areacodeselected==null)&& 'error'}
                    // style={eventUserId && hideFields}
                    noStyle={visible}
                    hidden={visible}
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
                      <Panel
                        header={intl.formatMessage({
                          id: 'registration.message.policy',
                        })}
                        key='1'>
                        <pre style={{ whiteSpace: 'normal' }}>{description}</pre>
                      </Panel>
                    </Collapse>
                  )}
                </>
              )}
            </div>
          )
        );
      }
    });

    return formUI;
  });

  return (
    <>
      <Col xs={24} sm={22} md={24} lg={24} xl={24} style={center}>
        {!submittedForm ? (
          <Card
            bordered={false}
            // title={
            //   eventUser !== undefined && eventUser !== null
            //     ? intl.formatMessage({ id: 'registration.title.update' })
            //     : intl.formatMessage({ id: 'registration.title.create' })
            // }
            bodyStyle={textLeft}>
            {/* //Renderiza el formulario */}
            {cEvent.value?._id && cEvent.value?._id == '60cb7c70a9e4de51ac7945a2' && !eventUser && (
              <TypeRegister typeRegister={typeRegister} setTypeRegister={setTypeRegister} />
            )}
            {eventUser !== undefined &&
              eventUser !== null &&
              eventUser.rol_id == '60e8a7e74f9fb74ccd00dc22' &&
              cEvent.value?._id &&
              cEvent.value?._id == '60cb7c70a9e4de51ac7945a2' && (
                <Row style={{ textAlign: 'center' }} justify={'center'} align={'center'}>
                  <strong>Te invitamos a realizar el pago para poder participar en las pujas.</strong>
                </Row>
              )}
            {eventUser !== undefined &&
              eventUser !== null &&
              eventUser.rol_id == '60e8a8b7f6817c280300dc23' &&
              cEvent.value?._id &&
              cEvent.value?._id == '60cb7c70a9e4de51ac7945a2' && (
                <Row style={{ textAlign: 'center' }} justify={'center'} align={'center'}>
                  <strong>Ya eres un asistente pago</strong>
                </Row>
              )}
            {eventUser !== undefined &&
              eventUser !== null &&
              eventUser.rol_id == '60e8a7e74f9fb74ccd00dc22' &&
              cEvent.value?._id &&
              cEvent.value?._id == '60cb7c70a9e4de51ac7945a2' && <ButtonPayment />}

            <Form
              form={form}
              layout='vertical'
              onFinish={onFinish}
              validateMessages={{
                required: intl.formatMessage({ id: 'form.field.required' }),
                types: {
                  email: intl.formatMessage({
                    id: 'form.validate.message.email',
                  }),
                  // regexp: 'malo',
                },
              }}
              initialValues={initialValues}
              onFinishFailed={showGeneralMessage}
              onValuesChange={valuesChange}>
              {/*cEvent.value?._id && cEvent.value?._id == '60cb7c70a9e4de51ac7945a2' && (
                <Row justify={'center'} style={{ marginBottom: 30 }}>
                  <Card style={{ width: 700, margin: 'auto', background: '#F7C2C6' }}>
                    <InfoCircleOutlined /> Una vez registrado para acceder a la puja de obras debes realizar la donación
                  </Card>
                </Row>
              )*/}
              <Row style={{ paddingBottom: '5px' }} gutter={[8, 8]}>
                <Col span={24}>
                  <Card style={{ borderRadius: '8px' }} bodyStyle={{ padding: '20px' }}>
                    <Typography.Title level={5}>
                      {intl.formatMessage({
                        id: 'title.user_data',
                        defaultMessage: 'Datos del usuario',
                      })}
                    </Typography.Title>
                    <Comment
                      author={<Typography.Text style={{ fontSize: '18px' }}>{initialValues?.names}</Typography.Text>}
                      content={<Typography.Text style={{ fontSize: '18px' }}>{initialValues?.email}</Typography.Text>}
                    />
                  </Card>
                </Col>
                <Col span={24}>
                  <Card
                    bodyStyle={{ padding: '20px' }}
                    style={{
                      height: 'auto',
                      maxHeight: '50vh',
                      overflowY: 'auto',
                      paddingRight: '0px',
                      borderRadius: '8px',
                    }}>
                    {fieldsAditional(extraFields) > 0 && (
                      <Typography.Title level={5}>
                        {intl.formatMessage({
                          id: 'modal.title.registerevent',
                          defaultMessage: 'Información adicional para el evento',
                        })}
                      </Typography.Title>
                    )}
                    {renderForm()}
                    {typeModal == 'update' && isVisibleButton(basicDataUser, extraFields, cEventUser) ? (
                      <div style={{ textAlign: 'center', width: '100%' }}>
                        {intl.formatMessage({
                          id: 'msg.no_fields_update',
                          defaultMessage: 'No hay campos disponibles para actualizar en este evento',
                        })}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', width: '100%' }}>
                        {fieldsAditional(extraFields) === 0 &&
                          intl.formatMessage({
                            id: 'msg.no_fields_create',
                            defaultMessage: 'No hay campos adicionales en este evento',
                          })}
                      </div>
                    )}
                  </Card>
                </Col>
              </Row>

              <Row gutter={[24, 24]} style={{ marginTop: '5px' }}>
                {generalFormErrorMessageVisible && (
                  <Col span={24} style={{ display: 'inline-flex', justifyContent: 'center' }}>
                    <Alert
                      className='animate__animated animate__bounceIn'
                      style={{
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                        backgroundColor: '#FFFFFF',
                        color: '#000000',
                        borderLeft: '5px solid #FAAD14',
                        fontSize: '14px',
                        borderRadius: '5px',
                      }}
                      message={intl.formatMessage({
                        id: 'form.missing.required.fields',
                      })}
                      type='warning'
                      showIcon
                      closable
                    />
                  </Col>
                )}
                {notLoggedAndRegister && (
                  <Col span={24} style={{ display: 'inline-flex', justifyContent: 'center' }}>
                    <Alert
                      className='animate__animated animate__bounceIn'
                      style={{
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                        backgroundColor: '#FFFFFF',
                        color: '#000000',
                        borderLeft: '5px solid #FAAD14',
                        fontSize: '14px',
                        borderRadius: '5px',
                      }}
                      afterClose={() => setNotLoggedAndRegister(false)}
                      message={intl.formatMessage({
                        id: 'registration.already.registered',
                      })}
                      description={
                        <Button
                          size='middle'
                          type='primary'
                          onClick={() => {
                            authModalDispatch({ type: 'showLogin' });
                            setNotLoggedAndRegister(false);
                          }}>
                          {intl.formatMessage({
                            id: 'modal.title.login',
                            defaultMessage: 'Iniciar sesión',
                          })}
                        </Button>
                      }
                      type='warning'
                      showIcon
                      closable
                    />
                  </Col>
                )}

                {errorRegisterUser && (
                  <Col span={24} style={{ display: 'inline-flex', justifyContent: 'center' }}>
                    <Alert
                      className='animate__animated animate__bounceIn'
                      type='warning'
                      showIcon
                      style={{
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                        backgroundColor: '#FFFFFF',
                        color: '#000000',
                        borderLeft: '5px solid #FAAD14',
                        fontSize: '14px',
                        borderRadius: '5px',
                      }}
                      message={'Ya te encuetras registrado en evius'}
                    />
                  </Col>
                )}
                <Col span={24} align='center'>
                  {!loadingregister && (
                    <Form.Item>
                      <Button
                        size='large'
                        ref={buttonSubmit}
                        style={{
                          display: isVisibleButton(basicDataUser, extraFields, cEventUser) ? 'none' : 'block',
                        }}
                        type='primary'
                        htmlType='submit'>
                        {(initialValues !== null && cEventUser.value !== null && !initialValues.user) ||
                        (initialValues !== null && Object.keys(initialValues).length === 0)
                          ? intl.formatMessage({ id: 'Button.signup' })
                          : intl.formatMessage({
                              id: 'registration.button.update',
                            })}
                      </Button>

                      {options &&
                        initialValues !== null &&
                        initialValues._id &&
                        options.map((option) => (
                          <Button
                            key={'option-' + option.text}
                            icon={option.icon}
                            onClick={() => option.action(eventUser)}
                            type={option.type}
                            style={{
                              marginLeft: 10,
                              marginTop: 10,
                            }}>
                            {option.text}
                          </Button>
                        ))}
                    </Form.Item>
                  )}
                  {loadingregister && <Spin />}
                </Col>
              </Row>
            </Form>
          </Card>
        ) : (
          <LoadingOutlined style={{ fontSize: '50px' }} />
        )}
      </Col>
    </>
  );
};

const mapDispatchToProps = {
  setSectionPermissions,
};

export default connect(null, mapDispatchToProps)(FormRegister);
