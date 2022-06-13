import { useEffect, useRef, useState } from 'react';
import BasicFieldsToFormEnrollUserToEvent from './BasicFieldsToFormEnrollUserToEvent';
import AdditionalFieldsToEnrollUserToEvent from './AdditionalFieldsToFormEnrollUserToEvent';
import { Alert, Button, Card, Col, Divider, Form, Row, Space, Spin, Typography } from 'antd';
import { useIntl } from 'react-intl';
import { LoadingOutlined } from '@ant-design/icons';
import dispatchFormEnrollUserToEvent from './dispatchFormEnrollUserToEvent';
import {
  aditionalFields,
  alertStyles,
  cardStyles,
  center,
  saveOrUpdateUser,
  textLeft,
  assignmentOfConditionsToAdditionalFields,
} from '@/Utilities/formUtils';
import { FormEnrollUserToEventPropsTypes } from '@/Utilities/types/types';
import AttendeeCheckIn from '../checkIn/AttendeeCheckIn';
import BadgeAccountOutlineIcon from '@2fd/ant-design-icons/lib/BadgeAccountOutline';

const { Title } = Typography;

const FormEnrollUserToEvent = ({
  fields = [],
  conditionalFields = [],
  editUser,
  options,
  saveUser,
  loaderWhenSavingUpdatingOrDelete = false,
  checkInUserCallbak = () => {},
  visibleInCms = false,
  submitIcon = <BadgeAccountOutlineIcon />,
}: FormEnrollUserToEventPropsTypes) => {
  const [form] = Form.useForm();
  const intl = useIntl();
  const buttonSubmit = useRef(null);
  const [generalFormErrorMessageVisible, setGeneralFormErrorMessageVisible] = useState<boolean>(false);
  const [validatedFields, setValidatedFields] = useState<Array<any>>([]);

  const { formDispatch, formState } = dispatchFormEnrollUserToEvent();
  const { basicFields, thereAreExtraFields, buttonText } = formState;

  /** Restructuring of fields which contain conditions or not */
  const assigningConditionsToFields = (changedValues: {}, allValues: {}) => {
    assignmentOfConditionsToAdditionalFields({ conditionalFields, allValues, fields, setValidatedFields });
  };

  const componentLoad = () => {
    form.resetFields();
    formDispatch({ type: 'getBasicFields', payload: { fields, editUser } });
    formDispatch({
      type: 'thereAreExtraFields',
      payload: {
        fields,
        editUser,
        visibleInCms,
      },
    });
    formDispatch({ type: 'buttonText', payload: { visibleInCms, editUser } });
    const allValues = editUser ? editUser.properties : [];

    assigningConditionsToFields({}, allValues);
  };

  useEffect(() => {
    componentLoad();
  }, [editUser]);

  const showGeneralMessage = () => {
    setGeneralFormErrorMessageVisible(true);
    setTimeout(() => {
      setGeneralFormErrorMessageVisible(false);
    }, 4000);
  };

  return (
    <div style={center}>
      <Col xs={24} sm={22} md={24} lg={24} xl={24}>
        <Card bordered={false}>
          <Form
            form={form}
            scrollToFirstError={true}
            layout='vertical'
            onFinish={(values) => saveOrUpdateUser(values, fields, saveUser)}
            onFinishFailed={showGeneralMessage}
            onValuesChange={assigningConditionsToFields}>
            <Row style={textLeft} gutter={[8, 8]}>
              <Col span={24}>
                <Card bodyStyle={textLeft} style={cardStyles}>
                  <Spin tip='Guardando cambios' spinning={loaderWhenSavingUpdatingOrDelete}>
                    <BasicFieldsToFormEnrollUserToEvent basicFields={basicFields} editUser={editUser} />
                    <Divider />
                    {thereAreExtraFields > 0 && (
                      <Title level={4} style={{ marginBottom: '30px', textAlign: 'center' }}>
                        {intl.formatMessage({
                          id: 'modal.title.registerevent..',
                          defaultMessage: 'Información adicional para el evento',
                        })}
                      </Title>
                    )}
                    {thereAreExtraFields === 0 &&
                      intl.formatMessage({
                        id: 'msg.no_fields_create',
                        defaultMessage: 'No hay campos adicionales en este evento',
                      })}
                    <AdditionalFieldsToEnrollUserToEvent
                      aditionalFields={aditionalFields({ validatedFields, editUser, visibleInCms })}
                    />
                  </Spin>
                </Card>
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              {generalFormErrorMessageVisible && (
                <Col span={24} style={{ display: 'inline-flex', justifyContent: 'center' }}>
                  <Alert
                    className='animate__animated animate__bounceIn'
                    style={alertStyles}
                    message={intl.formatMessage({
                      id: 'form.missing.required.fields',
                    })}
                    type='warning'
                    showIcon
                  />
                </Col>
              )}

              <Col span={24}>
                {loaderWhenSavingUpdatingOrDelete ? (
                  <LoadingOutlined style={{ fontSize: '50px' }} />
                ) : (
                  <>
                    <Form.Item>
                      <AttendeeCheckIn
                        editUser={editUser}
                        reloadComponent={componentLoad}
                        checkInUserCallbak={checkInUserCallbak}
                      />
                    </Form.Item>
                    <Form.Item>
                      <Space direction='horizontal'>
                        <Button
                          htmlType='submit'
                          type='primary'
                          ref={buttonSubmit}
                          icon={submitIcon}
                          // style={{
                          //   display: isVisibleButton(basicDataUser, extraFields, cEventUser) ? 'none' : 'block',
                          // }}
                        >
                          {buttonText}
                        </Button>

                        {options &&
                          editUser &&
                          options.map((option: any) => (
                            <Button
                              key={'option-' + option.text}
                              icon={option.icon}
                              onClick={() => option.action(editUser._id)}
                              type={option.type}>
                              {option.text}
                            </Button>
                          ))}
                      </Space>
                    </Form.Item>
                  </>
                )}
              </Col>
            </Row>
          </Form>
        </Card>
      </Col>
    </div>
  );
};

export default FormEnrollUserToEvent;
