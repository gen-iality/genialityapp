/** React's libraries imports */
import { useState, useEffect, useRef, useCallback } from 'react';
import ReactSelect from 'react-select';
import { useIntl } from 'react-intl';
import PhoneInput from 'react-phone-number-input';

/** Antd imports */
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
  Avatar,
} from 'antd';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';

/** Helpers and utils imports */
import { EventFieldsApi } from '@helpers/request';
import { countryApi } from '@helpers/request';

/** Context imports */
import { useHelper } from '@context/helperContext/hooks/useHelper';
import { useUserEvent } from '@context/eventUserContext';
import { useEventContext } from '@context/eventContext';
import { useCurrentUser } from '@context/userContext';
import { DispatchMessageService } from '@context/MessageService';

/**TODO::ocaciona error en ios */

const { Option } = Select;
const { Panel } = Collapse;
const { TextArea } = Input;

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
// Obtener nombre archivo
function obtenerName(fileUrl) {
  if (typeof fileUrl == 'string') {
    const splitUrl = fileUrl?.split('/');
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

function isRegister(initialValues, cEventUser) {
  return (initialValues !== null && Object.keys(initialValues).length === 0) || cEventUser.value == null;
}

function fieldsAditional(extraFields) {
  if (extraFields) {
    const countFields = extraFields.filter(
      (field) =>
        field.name !== 'names' && field.name !== 'email' && (field.type !== 'password' || field.name === 'contrasena'),
    );
    return countFields.length;
  }
  return 0;
}

/** CAMPO LISTA  tipo justonebyattendee. cuando un asistente selecciona una opción esta
 * debe desaparecer del listado para que ninguna otra persona la pueda seleccionar
 */
const UpdateTakenOptionInTakeableList = (camposConOpcionTomada, values, eventId) => {
  camposConOpcionTomada.map((field) => {
    const taken = field.options.filter((option) => option.value == values[field.name]);
    const updatedField = { ...field };
    const fieldId = updatedField._id && updatedField._id['$oid'] ? updatedField._id['$oid'] : updatedField._id;
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
  errorRegisterUser,
  basicDataUser = {},
  dataEventUser = {},
  dataOrgMember = {},
  HandleHookForm = () => {},
  setvalidateEventUser = () => {},
  setValidateOrgMember = () => {},
  validateEventUser,
  validateOrgMember,
  editUser,
}) => {
  const intl = useIntl();
  const cEvent = useEventContext();
  const cEventUser = useUserEvent();
  const cUser = useCurrentUser();
  const { currentAuthScreen, typeModal, helperDispatch } = useHelper();
  const [form] = Form.useForm();

  // Estado de carga para obtener los datos de pais, región y ciudad del formulario
  const [loading, setLoading] = useState(false);

  // Estados del evento - ¿Será necesario este estado? - ¿const cEvent = useEventContext()?
  const [event, setEvent] = useState(null);

  // Estado de los datos iniciales del usuario. ¿Se usará solo para el Modal?
  const [initialValues, setinitialValues] = useState({});

  // Estados de campos dinámicos
  const [extraFields, setExtraFields] = useState(cEvent.value?.user_properties || [] || fields);
  const [extraFieldsOriginal, setextraFieldsOriginal] = useState(
    organization ? fields : cEvent.value?.user_properties || {},
  );

  // Estados relacionados al formulario
  const [submittedForm, setSubmittedForm] = useState(false);
  const [generalFormErrorMessageVisible, setGeneralFormErrorMessageVisible] = useState(false);
  const [notLoggedAndRegister, setNotLoggedAndRegister] = useState(false);

  // Estados relacionados a los campos del formulario
  const [imageAvatar, setImageAvatar] = useState(null);
  const [country, setCountry] = useState({ name: '', countryCode: '', inputName: '' });
  const [region, setRegion] = useState({ name: '', regionCode: '', inputName: '' });
  const [city, setCity] = useState({ name: '', regionCode: '', inputName: '' });
  const [countries, setCountries] = useState([]);
  const [regiones, setRegiones] = useState([]);
  const [cities, setCities] = useState([]);

  // Estados que no creo que sean necesarios. ¿o si? -> Convertirlos a variables sin necesidad de estados
  const [eventUser, seteventUser] = useState(organization ? eventUserOther : cEventUser.value || {});
  // eslint-disable-next-line prefer-const
  let [ImgUrl, setImgUrl] = useState('');
  const [conditionals, setconditionals] = useState(
    organization ? conditionalsOther : cEvent.value?.fields_conditions || [],
  );

  const buttonSubmit = useRef(null);
  const getCountries = async () => {
    setLoading(true);
    try {
      const response = await countryApi.getCountries();
      setCountries(response);
    } catch (error) {
      setCountries([]);
    }
    setLoading(false);
  };

  const getIso2ByName = (name) => {
    const countryFound = countries.find((country) => country.name === name);
    if (countryFound) {
      setCountry({
        ...country,
        name: countryFound.name,
        countryCode: countryFound.iso2,
      });
      getState(countryFound.iso2);
      getCitiesByCountry(countryFound.iso2);
    }
  };

  const getNameTypeCountry = () => {
    if (extraFields.length === 0) return '';
    const fieldFound = extraFields.find((field) => field.type === 'country');
    if (!fieldFound) return '';
    if (fieldFound.length > 1) {
      return fieldFound[0].name;
    }
    return fieldFound.name;
  };

  const getState = async (country) => {
    setLoading(true);
    try {
      const response = await countryApi.getStatesByCountry(country);
      setRegiones(response);
      if (response.length === 0) {
        form.setFieldsValue({
          [region.inputName !== '' ? region.inputName : 'region']: 'NA',
        });
      }
    } catch (error) {
      setRegiones([]);
    }
    setLoading(false);
  };

  const getCities = async (country, state) => {
    setLoading(true);
    try {
      const response = await countryApi.getCities(country, state);
      setCities(response);
      if (response.length === 0) {
        form.setFieldsValue({
          [city.inputName !== '' ? city.inputName : 'city']: 'NA',
        });
      }
    } catch (error) {
      setCities([]);
    }
    setLoading(false);
  };

  const getCitiesByCountry = async (country) => {
    setLoading(true);
    try {
      const response = await countryApi.getCitiesByCountry(country);

      setCities(response);
    } catch (error) {
      setCities([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    getCountries();
    return () => {
      setCountries([]);
    };
  }, []);

  useEffect(() => {
    getIso2ByName(form.getFieldValue(getNameTypeCountry()));
  }, [initialValues, countries]);

  useEffect(() => {
    let initialValuesGeneral = {};
    if (basicDataUser || basicDataUser) {
      initialValuesGeneral = {
        ...basicDataUser,
        ...dataEventUser,
      };
    }
    console.log('initialValues2', initialValuesGeneral, cUser, cEventUser);
    setinitialValues(
      organization
        ? {
            ...initialOtherValue?.properties,
            _id: initialOtherValue._id,
            rol_id: initialOtherValue.rol_id,
            checked_in: initialOtherValue.checked_in,
            checkedin_at: initialOtherValue.checkedin_at,
          }
        : cEventUser?.value != null && cEventUser?.value != undefined
        ? cEventUser?.value?.properties
        : cUser.value
        ? cUser.value
        : initialValuesGeneral,
    );
  }, [cUser.value, cEventUser]);

  useEffect(() => {
    if (validateEventUser?.status) {
      buttonSubmit?.current?.click();
    }
  }, [validateEventUser?.status, validateEventUser?.statusFields]);

  useEffect(() => {
    if (validateOrgMember?.status) {
      buttonSubmit?.current?.click();
    }
  }, [validateOrgMember?.status, validateOrgMember?.statusFields]);

  useEffect(() => {
    form.resetFields();
    setGeneralFormErrorMessageVisible(false);
  }, [currentAuthScreen, typeModal]);

  const showGeneralMessage = (values, error, date) => {
    setvalidateEventUser({
      ...validateEventUser,
      statusFields: false,
    });

    setValidateOrgMember({
      ...validateOrgMember,
      statusFields: false,
    });

    setGeneralFormErrorMessageVisible(true);
    setTimeout(() => {
      setGeneralFormErrorMessageVisible(false);
    }, 4000);
  };

  const onFinish = async (values) => {
    console.log('onFinish - Values', values);
    console.log('onFinish - initialValues', initialValues);

    values = { ...initialValues, ...values };
    console.log('onFinish - initialValues + values', values);

    console.log('onFinish - basicDataUser', basicDataUser);
    if (Object.keys(basicDataUser).length > 0) {
      setvalidateEventUser({
        statusFields: true,
        status: false,
      });

      setValidateOrgMember({
        statusFields: true,
        status: false,
      });

      return;
    }

    if (values.email) {
      values.email = values.email.toLowerCase();
    }

    // Obtener ruta archivos file
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
      console.log('5. Esto se ejecuta?');
      callback(values);
    }
  };

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues]);

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
    const e = {
      target: {
        value: changedValues[Object.keys(changedValues)[0]],
      },
    };
    HandleHookForm(e, Object.keys(changedValues)[0], null);
    updateFieldsVisibility(conditionals, allValues);
  };

  const updateFieldsVisibility = (conditionals, allFields) => {
    console.log('conditionals', conditionals);
    console.log('extraFieldsOriginal', extraFieldsOriginal);
    let newExtraFields = [...extraFieldsOriginal];

    newExtraFields = newExtraFields.filter((field) => {
      let fieldShouldBeDisplayed = false;
      let fieldHasCondition = false;

      //para cada campo revisamos si se cumplen todas las condiciones para mostrarlo

      conditionals.map((conditional) => {
        const fieldExistInThisCondition = conditional.fields.indexOf(field.name) !== -1;

        if (!fieldExistInThisCondition) return;
        fieldHasCondition = true;
        //Revisamos si las condiciones del campo tienen los valores adecuados para que se muestre
        let fulfillConditional = false;

        //valor actual del condicional en el formulario
        const valueToValidate = allFields[conditional.fieldToValidate];
        fulfillConditional = conditional.value === valueToValidate;
        if (fulfillConditional) {
          fieldShouldBeDisplayed = true;
        }
      });
      return (fieldHasCondition && fieldShouldBeDisplayed) || !fieldHasCondition;
    });
    setExtraFields(newExtraFields);
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
    return isLt5M;
  };

  function validateUrl() {
    const url = window.location.pathname;
    return url.includes('/landing/');
  }

  /**
   * Crear inputs usando ant-form, ant se encarga de los onChange y de actualizar los valores
   */
  const renderForm = useCallback(() => {
    if (!extraFields) return '';
    const formUI = extraFields.map((m, key) => {
      /* console.log(m, key) */
      if (m.visibleByAdmin) {
        return;
      }
      //Este if es nuevo para poder validar las contraseñas viejos (nuevo flujo para no mostrar esos campos)
      if (m.name !== 'contrasena' && m.name !== 'password') {
        const type = m.type || 'text';
        const props = m.props || {};
        const name = m.name;
        const label = m.label;
        const mandatory = m.mandatory;
        const description = m.description;
        const labelPosition = m.labelPosition;
        const target = name;
        let value = callback
          ? eventUser && eventUser['properties']
            ? eventUser['properties'][target]
            : ''
          : initialValues
          ? initialValues[target]
          : '';
        // Visibilidad de campos
        const visible =
          (initialValues?.email && name == 'email') ||
          (initialValues?.names && name == 'names') ||
          (initialOtherValue?.email && name == 'email') //||
            ? //(initialOtherValue?.names && name == 'names')
              true
            : false;
        const validations =
          (type === 'region' && regiones.length == 0) ||
          (type === 'country' && countries.length == 0) ||
          (type === 'city' && cities.length == 0);
        /* console.log(initialValues, 'initialValues', m) */

        //no entiendo b esto para que funciona
        // if (conditionals.state === "enabled") {
        //   if (label === conditionals.field) {
        //     if (true || value === [conditionals.value]) {
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
          input = (
            <PhoneInput
              placeholder={intl.formatMessage({
                id: 'form.phoneInput.placeholder',
                defaultMessage: 'Ingrese número de contacto',
              })}
              defaultCountry="CO"
              international
            />
          );
        }

        if (type === 'tituloseccion') {
          input = (
            <>
              <div className={`label has-text-grey ${mandatory ? 'required' : ''}`}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: label,
                  }}
                ></div>
              </div>
              <Divider />
            </>
          );
        }

        let rule = name == 'email' || name == 'names' ? { required: true } : { required: mandatory };
        if (type === 'multiplelisttable') {
          input = <ReactSelect options={m.options} isMulti name={name} />;
        }

        const textoError = intl.formatMessage({ id: 'form.field.required' });
        if (type === 'boolean') {
          if (mandatory) {
            rule = {
              validator: (_, value) => (value ? Promise.resolve() : Promise.reject(textoError)),
            };
          } else {
            rule = {
              validator: (_, value) =>
                value || !value || value == '' || value == undefined
                  ? Promise.resolve()
                  : Promise.reject(textoError),
            };
          }
          return (
            <div key={'g' + key} name="field">
              {
                <>
                  <Form.Item
                    valuePropName="checked"
                    name={name}
                    rules={[rule]}
                    form={form}
                    key={'l' + key}
                    htmlFor={key}
                    initialValue={value}
                  >
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
                  {description && description.length < 500 && <p>{description}</p>}
                  {description && description.length > 500 && (
                    <Collapse defaultActiveKey={['0']} style={{ margingBotton: '15px' }}>
                      <Panel
                        header={intl.formatMessage({
                          id: 'registration.message.policy',
                        })}
                        key="1"
                      >
                        <pre
                          dangerouslySetInnerHTML={{
                            __html: description,
                          }}
                          style={{ whiteSpace: 'normal' }}
                        ></pre>
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
              accept="application/pdf,image/png, image/jpeg,image/jpg,application/msword,.docx"
              action='https://api.evius.co/api/files/upload/'
              listType="text"
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
              }
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          );
        }

        if (type === 'list') {
          //Filtramos las opciones ya tomadas si la opción justonebyattendee esta activada

          const fieldId = m._id && m._id['$oid'] ? m._id['$oid'] : m._id;

          if (event && m.justonebyattendee && m.options) {
            const takenoptions = event['takenoptions_' + fieldId];
            if (takenoptions) {
              m.options = m.options.filter((x) => {
                return takenoptions.filter((c) => x.value == c.value).length <= 0;
              });
            }
          }
          input = m.options
            ? m.options.map((o, key) => {
                return (
                  <Option key={key} value={o.value}>
                    {o.label}
                  </Option>
                );
              })
            : [];
          input = (
            <Select style={{ width: '100%' }} name={name} defaultValue={value}>
              <Option value="">Seleccione...</Option>
              {input}
            </Select>
          );
        }

        if (type === 'country') {
          input = (
            <Form.Item id="country_input_form" initialValue={value} name={name} noStyle>
              <Select
                showSearch
                optionFilterProp="children"
                style={{ width: '100%' }}
                onChange={(nameCountry, aditionalData) => {
                  form.setFieldsValue({
                    [region.inputName !== '' ? region.inputName : 'region']: '',
                    [city.inputName !== '' ? city.inputName : 'city']: '',
                  });
                  getCitiesByCountry(aditionalData.key);
                  getState(aditionalData.key);
                  setCountry({ name: nameCountry, countryCode: aditionalData.key, inputName: name });
                }}
                disabled={loading || countries.length === 0}
                loading={loading}
                placeholder="Seleccione un país"
              >
                {countries.map((country) => (
                  <Option key={country.iso2} value={country.name}>
                    {country.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          );
        }
        if (type === 'region') {
          input = (
            <Form.Item initialValue={value} name={name} noStyle>
              <Select
                showSearch
                optionFilterProp="children"
                style={{ width: '100%' }}
                onChange={(nameRegion, aditionalData) => {
                  form.setFieldsValue({
                    [city.inputName !== '' ? city.inputName : 'city']: '',
                  });
                  getCities(country.countryCode, aditionalData.key);
                  setRegion({ name: nameRegion, regionCode: aditionalData.key, inputName: name });
                }}
                disabled={loading || regiones.length === 0}
                loading={loading}
                placeholder="Seleccione un región"
              >
                {regiones.map((regiones) => (
                  <Option key={regiones.iso2} value={regiones.name}>
                    {regiones.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          );
        }

        if (type === 'city') {
          input = (
            <Form.Item initialValue={value} name={name} noStyle>
              <Select
                showSearch
                optionFilterProp="children"
                style={{ width: '100%' }}
                disabled={loading || cities.length === 0}
                loading={loading}
                onChange={(nameCity, aditionalData) => {
                  setCity({ name: nameCity, regionCode: aditionalData.key, inputName: name });
                }}
                placeholder="Seleccione una ciudad"
              >
                {cities.map((cityCode, key) => {
                  return (
                    <Option key={key} value={cityCode.name}>
                      {cityCode.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          );
        }

        // Se debe quedar para rendrizar el campo imagen dentro del cms
        if (type === 'avatar') {
          ImgUrl = ImgUrl !== '' ? ImgUrl : value !== '' && value !== null ? [{ url: value }] : undefined;

          input = (
            <div style={{ textAlign: 'center' }}>
              <ImgCrop rotate shape="round">
                <Upload
                  action="https://api.evius.co/api/files/upload/"
                  accept="image/png,image/jpeg"
                  onChange={(file) => {
                    setImageAvatar(file);
                  }}
                  listType="picture"
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
                  beforeUpload={beforeUpload}
                >
                  <Button type="primary" icon={<UploadOutlined />}>
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
            <div key={'g' + key} name="field">
              {type === 'tituloseccion' && input}
              {type !== 'tituloseccion' && (
                <>
                  <Form.Item
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
                    rules={validations ? [{ required: false }] : [rule]}
                    key={'l' + key}
                    htmlFor={key}
                    initialValue={value}
                  >
                    {input}
                  </Form.Item>

                  {description && description.length < 500 && <p>{description}</p>}
                  {description && description.length > 500 && (
                    <Collapse defaultActiveKey={['0']} style={{ margingBotton: '15px' }}>
                      <Panel
                        header={intl.formatMessage({
                          id: 'registration.message.policy',
                        })}
                        key="1"
                      >
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
          <Card bodyStyle={textLeft}>
            <Form
              form={form}
              layout="vertical"
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
              initialValues={organization ? initialOtherValue : initialValues}
              onFinishFailed={showGeneralMessage}
              onValuesChange={valuesChange}
            >
              <Row style={{ paddingBottom: '5px' }} gutter={[8, 8]}>
                <Col span={24}>
                  {editUser && (
                    <Card style={{ borderRadius: '8px' }} bodyStyle={{ padding: '20px' }}>
                      <Typography.Title level={5}>
                        {intl.formatMessage({
                          id: 'title.user_data',
                          defaultMessage: 'Datos del usuario',
                        })}
                      </Typography.Title>
                      {/* Revisar bien que valor usamos para picture ahorita guarda todo un objeto de tipo file que no tiene sentido deberia ser solo la url de la imagen */}
                      {organization ? (
                        <Comment
                          avatar={initialOtherValue.picture ? <Avatar src={initialOtherValue?.picture} /> : null}
                          author={
                            <Typography.Text style={{ fontSize: '18px' }}>{initialOtherValue?.names}</Typography.Text>
                          }
                          content={
                            <Typography.Text style={{ fontSize: '18px' }}>{initialOtherValue?.email}</Typography.Text>
                          }
                        />
                      ) : (
                        <Comment
                          avatar={
                            initialValues.picture ? (
                              <Avatar
                                src={
                                  initialValues?.picture[0]?.thumbUrl ||
                                  initialValues?.picture[0]?.url ||
                                  initialValues?.picture
                                }
                              />
                            ) : cUser?.value?.picture ? (
                              cUser?.value?.picture
                            ) : null
                          }
                          author={
                            <Typography.Text style={{ fontSize: '18px' }}>{initialValues?.names}</Typography.Text>
                          }
                          content={
                            <Typography.Text style={{ fontSize: '18px' }}>{initialValues?.email}</Typography.Text>
                          }
                        />
                      )}
                    </Card>
                  )}
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
                    }}
                  >
                    {fieldsAditional(extraFields) > 0 && editUser && (
                      <Typography.Title level={5}>
                        {intl.formatMessage({
                          id: 'modal.title.registerevent',
                          defaultMessage: 'Información adicional para el curso',
                        })}
                      </Typography.Title>
                    )}
                    {renderForm()}
                    {typeModal == 'update' && isVisibleButton(basicDataUser, extraFields, cEventUser) ? (
                      <div style={{ textAlign: 'center', width: '100%' }}>
                        {intl.formatMessage({
                          id: 'msg.no_fields_update',
                          defaultMessage: 'No hay campos disponibles para actualizar en este curso',
                        })}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', width: '100%' }}>
                        {fieldsAditional(extraFields) === 0 &&
                          intl.formatMessage({
                            id: 'msg.no_fields_create',
                            defaultMessage: 'No hay campos adicionales en este curso',
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
                      className="animate__animated animate__bounceIn"
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
                      type="warning"
                      showIcon
                      closable
                    />
                  </Col>
                )}
                {notLoggedAndRegister && (
                  <Col span={24} style={{ display: 'inline-flex', justifyContent: 'center' }}>
                    <Alert
                      className="animate__animated animate__bounceIn"
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
                          size="middle"
                          type="primary"
                          onClick={() => {
                            helperDispatch({ type: 'showLogin' });
                            setNotLoggedAndRegister(false);
                          }}
                        >
                          {intl.formatMessage({
                            id: 'modal.title.login',
                            defaultMessage: 'Iniciar sesión',
                          })}
                        </Button>
                      }
                      type="warning"
                      showIcon
                      closable
                    />
                  </Col>
                )}

                {errorRegisterUser && (
                  <Col span={24} style={{ display: 'inline-flex', justifyContent: 'center' }}>
                    <Alert
                      className="animate__animated animate__bounceIn"
                      type="warning"
                      showIcon
                      style={{
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                        backgroundColor: '#FFFFFF',
                        color: '#000000',
                        borderLeft: '5px solid #FAAD14',
                        fontSize: '14px',
                        borderRadius: '5px',
                      }}
                      message="Ya te encuetras registrado en evius"
                    />
                  </Col>
                )}
                <Col span={24} align="center">
                  {!loadingregister && (
                    <Form.Item>
                      <Button
                        size="large"
                        ref={buttonSubmit}
                        style={{
                          display: isVisibleButton(basicDataUser, extraFields, cEventUser) ? 'none' : 'block',
                        }}
                        // Restricciones
                        // disabled={!eventIsActive}
                        type="primary"
                        htmlType="submit"
                      >
                        {}
                        {isRegister(initialValues, cEventUser)
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
                            }}
                          >
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

export default FormRegister;
