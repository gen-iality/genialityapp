import { useEffect, useRef, useState } from 'react';
import BasicFieldsToFormEnrollUserToEvent from './BasicFieldsToFormEnrollUserToEvent';
import AdditionalFieldsToEnrollUserToEvent from './AdditionalFieldsToFormEnrollUserToEvent';
import { Alert, Button, Card, Col, Divider, Form, Row, Typography } from 'antd';
import { useIntl } from 'react-intl';
import { LoadingOutlined } from '@ant-design/icons';
import dispatchFormEnrollUserToEvent from './dispatchFormEnrollUserToEvent';
import { aditionalFields, alertStyles, cardStyles, center, saveOrUpdateUser, textLeft } from '@/Utilities/formUtils';

const { Title } = Typography;

type FormEnrollUserToEventPropsTypes = {
  fields: any;
  editUser: any;
  options: any;
  saveUser: (user: any) => void;
  loaderWhenSavingUpdatingOrDelete: boolean;
  visibleInCms: boolean;
};

const FormEnrollUserToEvent = ({
  fields = [],
  editUser,
  options,
  saveUser,
  loaderWhenSavingUpdatingOrDelete,
  visibleInCms = false,
}: FormEnrollUserToEventPropsTypes) => {
  const [form] = Form.useForm();
  const intl = useIntl();
  const buttonSubmit = useRef(null);
  const [generalFormErrorMessageVisible, setGeneralFormErrorMessageVisible] = useState(false);

  const { formDispatch, formState } = dispatchFormEnrollUserToEvent();
  const { basicFields, thereAreExtraFields, buttonText } = formState;

  const componentLoad = () => {
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
  };

  useEffect(() => {
    form.resetFields();
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
        {/* {!submittedForm ? ( */}
        <Card bordered={false}>
          <Form
            form={form}
            layout='vertical'
            onFinish={(values) => saveOrUpdateUser(values, fields, saveUser)}
            onFinishFailed={showGeneralMessage}>
            <Row style={textLeft} gutter={[8, 8]}>
              <Col span={24}>
                <Card bodyStyle={textLeft} style={cardStyles}>
                  <BasicFieldsToFormEnrollUserToEvent basicFields={basicFields} editUser={editUser} />
                  <Divider />
                  {thereAreExtraFields > 0 && (
                    <Title level={5}>
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
                    aditionalFields={aditionalFields(fields, editUser, visibleInCms)}
                  />
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
                      <Button
                        htmlType='submit'
                        type='primary'
                        ref={buttonSubmit}
                        // style={{
                        //   display: isVisibleButton(basicDataUser, extraFields, cEventUser) ? 'none' : 'block',
                        // }}
                      >
                        {buttonText}
                      </Button>
                    </Form.Item>

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
