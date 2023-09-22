import { useEffect, useRef, useState } from 'react';
import BasicFieldsToFormEnrollAttendeeToEvent from './BasicFieldsToFormEnrollAttendeeToEvent';
import AdditionalFieldsToFormEnrollAttendeeToEvent from './AdditionalFieldsToFormEnrollAttendeeToEvent';
import { Alert, Button, Card, Col, Divider, Form, Row, Space, Spin, Typography } from 'antd';
import { useIntl } from 'react-intl';
import { LoadingOutlined } from '@ant-design/icons';
import useDispatchFormEnrollAttendeeToEvent from './useDispatchFormEnrollAttendeeToEvent';
import {
  aditionalFields,
  alertStyles,
  cardStyles,
  center,
  textLeft,
  assignmentOfConditionsToAdditionalFields,
} from '@/Utilities/formUtils';
import { AttendeeInformation, FormEnrollAttendeeToEventPropsTypes } from '@/Utilities/types/types';
import AttendeeCheckInCheckbox from '../checkIn/AttendeeCheckInCheckbox';
import BadgeAccountOutlineIcon from '@2fd/ant-design-icons/lib/BadgeAccountOutline';
import AttendeeCheckInButton from '../checkIn/AttendeeCheckInButton';
import AttendeeCheckInButtonPrint from '@/components/checkIn/AttendeeCheckInButtonPrint';

const { Title } = Typography;

const FormEnrollAttendeeToEvent = ({
  fields = [],
  conditionalFields = [],
  attendee,
  options,
  saveAttendee = () => {},
  loaderWhenSavingUpdatingOrDelete = false,
  checkInAttendeeCallbak,
  visibleInCms = false,
  eventType = 'Virtual',
  submitButtonProps = {
    icon: <BadgeAccountOutlineIcon />,
    styles: {},
  },
  printUser,
  badgeEvent,
  activityId,
  isAddFromOrganization
}: FormEnrollAttendeeToEventPropsTypes) => {
  const [form] = Form.useForm();
  const intl = useIntl();
  const buttonSubmit = useRef(null);
  const [generalFormErrorMessageVisible, setGeneralFormErrorMessageVisible] = useState<boolean>(false);

  const [attendeeInformation, setAttendeeInformation] = useState<AttendeeInformation | null>(null);

  const { formDispatch, formState } = useDispatchFormEnrollAttendeeToEvent();
  const { basicFields, thereAreExtraFields, buttonText } = formState;
  const [validatedFields, setValidatedFields] = useState<Array<any>>([]);
  const { icon, styles, text } = submitButtonProps;
  /** Restructuring of fields which contain conditions or not */
  const assigningConditionsToFields = (changedValues: {}, allValues: {}) => {
    assignmentOfConditionsToAdditionalFields({ conditionalFields, allValues, fields, setValidatedFields });
  };
  const componentLoad = (attendeeData: AttendeeInformation) => {
    setAttendeeInformation(attendeeData);
    form.resetFields();
    formDispatch({ type: 'getBasicFields', payload: { fields, attendeeData } });
    formDispatch({
      type: 'thereAreExtraFields',
      payload: {
        fields,
        attendeeData,
        visibleInCms,
      },
    });
    formDispatch({ type: 'buttonText', payload: { visibleInCms, attendeeData } });
    const allValues = attendeeData ? attendeeData.properties : [];

    assigningConditionsToFields({}, allValues);
  };

  useEffect(() => {
    componentLoad(attendee);
  }, [attendee]);

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
            onFinish={saveAttendee}
            onFinishFailed={showGeneralMessage}
            onValuesChange={assigningConditionsToFields}>
            <Row style={textLeft}>
              <Col span={24}>
                <Card bodyStyle={textLeft} style={cardStyles}>
                  <Spin tip='Guardando cambios' spinning={loaderWhenSavingUpdatingOrDelete}>
                    <BasicFieldsToFormEnrollAttendeeToEvent basicFields={basicFields} attendee={attendee} isAddFromOrganization={isAddFromOrganization}/>
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
                    <AdditionalFieldsToFormEnrollAttendeeToEvent
                      aditionalFields={aditionalFields({ validatedFields, attendee, visibleInCms })}
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
                  <Space direction='vertical'>
                    {attendeeInformation?._id && eventType === 'hybridEvent' && (
                      <b>
                        Tipo de checkIn:{' '}
                        {attendeeInformation?.checkedin_type ? attendeeInformation.checkedin_type : 'ninguno'}
                      </b>
                    )}
                    {visibleInCms && (
                      <>
                        <AttendeeCheckInCheckbox
                          attendee={attendeeInformation}
                          activityId={activityId}
                          reloadComponent={componentLoad}
                          checkInAttendeeCallbak={checkInAttendeeCallbak ? checkInAttendeeCallbak : () => {}}
                        />
                        {eventType === 'hybridEvent' && (
                          <AttendeeCheckInButton
                            attendee={attendeeInformation}
                            activityId={activityId}
                            reloadComponent={componentLoad}
                            checkInAttendeeCallbak={checkInAttendeeCallbak ? checkInAttendeeCallbak : () => {}}
                          />
                        )}
                        {eventType !== 'onlineEvent' && badgeEvent && attendee && printUser && (
                          <AttendeeCheckInButtonPrint onPrintUser={printUser!} />
                        )}
                      </>
                    )}

                    <Form.Item>
                      <Space direction='horizontal'>
                        <Button
                          htmlType='submit'
                          type='primary'
                          ref={buttonSubmit}
                          icon={icon}
                          style={{
                            ...styles,
                          }}>
                          {text ? text : buttonText}
                        </Button>

                        {options &&
                          attendee &&
                          options.map((option: any) => (
                            <Button
                              key={'option-' + option.text}
                              icon={option.icon}
                              onClick={() => option.action(attendee._id)}
                              type={option.type}>
                              {option.text}
                            </Button>
                          ))}
                      </Space>
                    </Form.Item>
                  </Space>
                )}
              </Col>
            </Row>
          </Form>
        </Card>
      </Col>
    </div>
  );
};

export default FormEnrollAttendeeToEvent;
