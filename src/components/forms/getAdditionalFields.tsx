import { useEffect, useState } from 'react';
import { Button, Checkbox, Collapse, Divider, Form, Input, Select, Upload, DatePicker } from 'antd';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { useIntl } from 'react-intl';
import { ApiUrl, areaCode } from '@/helpers/constants';
import { beforeUpload, getImagename } from '@/Utilities/formUtils';
import moment from 'moment';
import { deleteFireStorageData } from '@/Utilities/deleteFireStorageData';
import { countryApi } from '@/helpers/request';
/**TODO::ocaciona error en ios */

import { async } from 'ramda-adjunct';
const { Option } = Select;
const { Panel } = Collapse;
const { TextArea } = Input;
const { Dragger } = Upload;

const GetAdditionalFields = ({ fields, attendee, visibleInCms }: any) => {
  const intl = useIntl();
  let attendeeProperties = attendee?.properties || {};
  let areacodeselected = attendeeProperties['code'] || '+57';
  let onlyAreacodeselected = attendeeProperties['onlyCodearea'] || '+57';
  const dateFormat = 'YYYY/MM/DD';

  const [country, setCountry] = useState({ name: '', countryCode: '', inputName: '' });
  const [region, setRegion] = useState({ name: '', regionCode: '', inputName: '' });
  const [city, setCity] = useState({ name: '', regionCode: '', inputName: '' });
  const [countries, setCountries] = useState([]);
  const [regiones, setRegiones] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const getState = async (country: string) => {
    setLoading(true);
    try {
      const response = await countryApi.getStatesByCountry(country);

      setRegiones(response);
    } catch (error) {
      setRegiones([]);
    }
    setLoading(false);
  };

  const getCities = async (country: string, state: string) => {
    setLoading(true);
    try {
      const response = await countryApi.getCities(country, state);

      setCities(response);
    } catch (error) {
      setCities([]);
    }
    setLoading(false);
  };

  const getCitiesByCountry = async (country: string) => {
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

  //console.log(locationState.getStatesByShort('CO'), country, region);
  if (fields?.lenght === 0) return [];

  let additionalFormFields = fields.map((field: any, key: any) => {
    // se valida si el campo es visible solo el en cms,
    if (field.visibleByAdmin == true && !visibleInCms) return;

    //Este if es nuevo para poder validar las contraseñas viejos (nuevo flujo para no mostrar esos campos)
    if (field.name !== 'contrasena' && field.name !== 'password') {
      let ImgUrl: any = '';
      let rule = {};
      let type = field.type || 'text';
      let name = field.name;
      let label = field.label;
      let mandatory = field.mandatory;
      let description = field.description;
      let labelPosition = field.labelPosition;
      let target = name;

      let value = attendeeProperties.email || attendeeProperties.names ? attendeeProperties[target] ?? attendee[target]: null;

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
      rule = name == 'email' || name == 'names' ? { required: true } : { required: mandatory };
      let validations =
        (type === 'region' && regiones.length == 0) ||
        (type === 'country' && countries.length == 0) ||
        (type === 'city' && cities.length == 0);

      let input = (
        <Form.Item initialValue={value} name={name} noStyle>
          <Input
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
          />
        </Form.Item>
      );

      if (type === 'codearea') {
        const prefixSelector = (
          <Form.Item initialValue={areacodeselected} name={['code']} noStyle>
            <Select
              showSearch
              optionFilterProp='children'
              style={{ fontSize: '12px', width: 155 }}
              onChange={(val) => {
                areacodeselected = val;
              }}
              placeholder='Código de area del pais'>
              {areaCode.map((code: any, key: any) => {
                return (
                  <Option key={key} value={code.value}>
                    {`${code.label} (${code.value})`}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        );
        input = (
          <Form.Item initialValue={value} name={name} noStyle>
            <Input
              addonBefore={prefixSelector}
              name={name}
              required={mandatory}
              type='number'
              key={key}
              style={{ width: '100%' }}
              placeholder='Numero de telefono'
            />
          </Form.Item>
        );
      }
      if (type === 'onlyCodearea') {
        input = (
          <Form.Item initialValue={onlyAreacodeselected} name={name} noStyle>
            <Select
              showSearch
              optionFilterProp='children'
              style={{ width: '100%' }}
              onChange={(val) => {
                onlyAreacodeselected = val;
              }}
              placeholder='Código de area del pais'>
              {areaCode.map((code: any, key: any) => {
                return (
                  <Option key={key} value={code.value}>
                    {`${code.label} (${code.value})`}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        );
      }

      if (type === 'tituloseccion') {
        input = (
          <>
            <div className={`label has-text-grey ${mandatory ? 'required' : ''}`}>
              <div
                dangerouslySetInnerHTML={{
                  __html: label,
                }}></div>
            </div>
            <Divider />
          </>
        );
      }

      if (type === 'multiplelisttable') {
        let defaultValue = value;
        if (typeof value === 'string') defaultValue = JSON.parse(value);

        input = field.options
          ? field.options.map((option: any, key: any) => {
              return (
                <Option key={key} value={option.value}>
                  {option.label}
                </Option>
              );
            })
          : [];

        input = (
          <Form.Item initialValue={defaultValue} name={name} noStyle>
            <Select mode='multiple' placeholder='Selecciona una o mas opciones' style={{ width: '100%' }}>
              {input}
            </Select>
          </Form.Item>
        );
      }

      if (type === 'boolean') {
        let textoError = '';
        if (mandatory) {
          textoError = intl.formatMessage({ id: 'form.field.required' });

          rule = {
            validator: (_: any, value: any) => (value == true ? Promise.resolve() : Promise.reject(textoError)),
          };
        } else {
          rule = {
            validator: (_: any, value: any) =>
              value == true || value == false || value == '' || value == undefined
                ? Promise.resolve()
                : Promise.reject(textoError),
          };
        }

        return (
          <div key={'g' + key}>
            {
              <>
                <Form.Item
                  valuePropName={'checked'}
                  name={name}
                  rules={[rule]}
                  key={'l' + key}
                  htmlFor={key}
                  initialValue={value}>
                  <Checkbox key={key} name={name}>
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

                {description && description.length < 100 && <p>{description}</p>}
                {description && description.length > 100 && (
                  <Collapse
                    defaultActiveKey={['0']}
                    // style={{ margingBotton: '15px' }}
                  >
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
        input = (
          <Form.Item initialValue={value} name={name} noStyle>
            <TextArea rows={4} autoSize={{ minRows: 3, maxRows: 25 }} value={value} />
          </Form.Item>
        );
      }

      if (type === 'multiplelist') {
        input = (
          <Form.Item initialValue={value} name={name} noStyle>
            <Checkbox.Group
              options={field.options}
              onChange={(checkedValues) => {
                value = JSON.stringify(checkedValues);
              }}
            />
          </Form.Item>
        );
      }

      if (type === 'file') {
        input = (
          <Form.Item initialValue={value} name={name} noStyle>
            <Dragger
              accept='application/pdf,image/png, image/jpeg,image/jpg,application/msword,.docx'
              action={`${ApiUrl}/api/files/upload/`}
              maxCount={1}
              multiple={false}
              listType='text'
              beforeUpload={beforeUpload}
              onRemove={async (file: any) => {
                const urlFile = file.url || file.response;
                if (urlFile) await deleteFireStorageData(urlFile);
              }}
              // @ts-ignore: Unreachable code error
              defaultFileList={
                value
                  ? [
                      {
                        name: typeof value == 'string' ? getImagename(value) : null,
                        url: typeof value == 'string' ? value : null,
                      },
                    ]
                  : []
              }>
              <>
                <p className='ant-upload-drag-icon'>
                  <InboxOutlined style={{ color: '#009fd9' }} />
                </p>
                <p>Haga clic o arrastre el archivo a esta área para cargarlo</p>
              </>
            </Dragger>
          </Form.Item>
        );
      }

      if (type === 'list' || type === 'list_type_user') {
        input = field.options
          ? field.options.map((option: any, key: any) => {
              return (
                <Option key={key} value={option.value}>
                  {option.label}
                </Option>
              );
            })
          : [];
        input = (
          <Form.Item initialValue={value} name={name} noStyle>
            <Select style={{ width: '100%' }}>
              <Option value={''}>Seleccione...</Option>
              {input}
            </Select>
          </Form.Item>
        );
      }

      if (type === 'country') {
        input = (
          <Form.Item initialValue={value} name={name} noStyle>
            <Select
              showSearch
              optionFilterProp='children'
              style={{ width: '100%' }}
              onChange={(nameCountry, aditionalData: any) => {
                getState(aditionalData.key);
                getCitiesByCountry(aditionalData.key);
                setCountry({ name: nameCountry, countryCode: aditionalData.key, inputName: name });
              }}
              disabled={loading || countries.length === 0}
              loading={loading}
              placeholder='Seleccione un país'>
              {countries.map((country: any) => {
                return (
                  <Option key={country.iso2} value={country.name}>
                    {country.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        );
      }
      if (type === 'region') {
        input = (
          <Form.Item initialValue={value} name={name} noStyle>
            <Select
              showSearch
              optionFilterProp='children'
              style={{ width: '100%' }}
              onChange={(nameRegion, aditionalData: any) => {
                getCities(country.countryCode, aditionalData.key);
                setRegion({ name: nameRegion, regionCode: aditionalData.key, inputName: name });
              }}
              disabled={loading || regiones.length === 0}
              loading={loading}
              placeholder='Seleccione un región'>
              {regiones.map((regiones: any) => {
                return (
                  <Option key={regiones.iso2} value={regiones.name}>
                    {regiones.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        );
      }

      if (type === 'city') {
        input = (
          <Form.Item initialValue={value} name={name} noStyle>
            <Select
              showSearch
              optionFilterProp='children'
              style={{ width: '100%' }}
              disabled={loading || cities.length === 0}
              loading={loading}
              onChange={(nameCity, aditionalData: any) => {
                setCity({ name: nameCity, regionCode: aditionalData.key, inputName: name });
              }}
              placeholder='Seleccione una ciudad'>
              {cities.map((cityCode: any, key: any) => {
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
                  // setImageAvatar(file);
                }}
                multiple={false}
                listType='picture'
                maxCount={1}
                // @ts-ignore: Unreachable code error
                defaultFileList={
                  value
                    ? [
                        {
                          name: typeof value == 'string' ? getImagename(value) : null,
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

      if (type === 'number') {
        input = (
          <Form.Item initialValue={value} name={name} noStyle>
            <Input type={type} />
          </Form.Item>
        );
      }

      if (type === 'date') {
        let defaultValue = value ? moment(value, dateFormat) : null;
        input = (
          <Form.Item initialValue={defaultValue} name={name} noStyle>
            {/*  @ts-ignore: Unreachable code error */}
            <DatePicker format={dateFormat} style={{ width: '100%' }} />
          </Form.Item>
        );
      }

      return (
        type !== 'boolean' && (
          <div key={'g' + key}>
            {type === 'tituloseccion' && input}
            {type !== 'tituloseccion' && (
              <>
                <Form.Item
                  // noStyle={visible}
                  // hidden={visible}
                  valuePropName={type === 'boolean' ? 'checked' : 'value'}
                  label={
                    (labelPosition !== 'izquierda' || !labelPosition) && type !== 'tituloseccion'
                      ? label
                      : '' && (labelPosition !== 'arriba' || !labelPosition)
                  }
                  name={name}
                  rules={validations ? [{ required: false }] : [rule]}
                  key={'l' + key}
                  htmlFor={key}>
                  {input}
                </Form.Item>

                {description && description.length < 500 && <p>{description}</p>}
                {description && description.length > 500 && (
                  <Collapse
                    defaultActiveKey={['0']}
                    // style={{ margingBotton: '15px' }}
                  >
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

  return additionalFormFields;
};

export default GetAdditionalFields;
