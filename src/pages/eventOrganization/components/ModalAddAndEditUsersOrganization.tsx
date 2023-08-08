import React, { useEffect, useState } from 'react';
import { Button, Form, Grid, Modal, ModalProps, Result, Space, Spin, Steps } from 'antd';
import { stylePaddingDesktop, stylePaddingMobile } from '../styles/user-organization.style';
import { FormUserOrganization, UserToOrganization } from '../interface/organization.interface';
import { UserOrganizationForm } from './UserOrganizationForm';
import { UploadFile } from 'antd/lib/upload/interface';
import OrganizationPropertiesForm from './OrganizationPropertiesForm';
import { OrganizationApi } from '@/helpers/request';
import AccountOutlineIcon from '@2fd/ant-design-icons/lib/AccountOutline';
import TicketConfirmationOutlineIcon from '@2fd/ant-design-icons/lib/TicketConfirmationOutline';
import { ScheduleOutlined } from '@ant-design/icons';
import { saveImageStorage } from '@/helpers/helperSaveImage';
import createNewUser from '@/components/authentication/ModalsFunctions/createNewUser';
import { UnchangeableUserData } from './form-edit/UnchangeableUserData';
import { useResultsUserOrganizations } from '../hooks/useResultsUserOrganizations';
import { useSteps } from '../hooks/useSteps';
import { DispatchMessageService } from '@/context/MessageService';

const initialForm: FormUserOrganization = {
  email: '',
  names: '',
  password: '',
};

interface Props extends ModalProps {
  selectedUser?: Omit<UserToOrganization, 'password'>;
  organizationId: string;
  onCancel: () => void;
  getEventsStatisticsData: () => void;
}

export const ModalAddAndEditUsers = ({
  selectedUser,
  organizationId,
  onCancel,
  getEventsStatisticsData,
  ...modalProps
}: Props) => {
  const screens = Grid.useBreakpoint();
  const [formBasicData] = Form.useForm<FormUserOrganization>();
  const [formDinamicData] = Form.useForm();
  const [imageFile, setImagesFile] = useState<UploadFile>();
  const [organization, setOrganization] = useState<any>();
  const [dataBasic, setdataBasic] = useState<FormUserOrganization>();
  const [dataToAddUser, setdataToAddUser] = useState<any>();
  const [haveDinamicProperties, setHaveDinamicProperties] = useState(false);
  const { current, onLastStep, onNextStep } = useSteps(3);
  const [addToUserEvents, setAddToUserEvents] = useState(false);
  const {
    backToCreate,
    loadingRequest,
    resultData,
    resultEmailExist,
    resultUnexpectedError,
    resultUserExistIntoOrganization,
    resultUserOrganizationError,
    resultUserOrganizationSuccess,
    onContinueCreating,
    setLoadingRequest,
    setbackToCreate,
  } = useResultsUserOrganizations();
  const onChangeAddUserToEvent = (checked: boolean) => {
    setAddToUserEvents(checked);
  };

  const onFinisUserOrganizationStep = (values: FormUserOrganization) => {
    setdataBasic(values);
    onNextStep();
  };
  const onFinishDinamicStep = (values?: any) => {
    if (!selectedUser) {
      onCreateUser(values);
    } else {
      onEditUser(values);
    }
    onNextStep();
  };

  const onCreateUser = async (dataDinamic: any) => {
    setLoadingRequest(true);
    const nuewUserPicture = await saveImageStorage(imageFile?.thumbUrl);
    const newUser: UserToOrganization = {
      names: dataBasic?.names,
      email: dataBasic?.email,
      urlImage: nuewUserPicture,
      password: dataBasic?.password,
      ...dataDinamic,
    };
    try {
      let resp = await createNewUser(newUser);
      if (resp === 0) {
        setdataToAddUser(newUser);
        setLoadingRequest(false);
        resultEmailExist();
        setbackToCreate(true);
      } else if (resp === 1) {
        setLoadingRequest(false);
        await onAddUserToOrganization(newUser);
      } else {
        setLoadingRequest(false);
        setbackToCreate(true);
        resultUnexpectedError();
      }
    } catch (error) {
      setLoadingRequest(false);
      setbackToCreate(true);
      resultUnexpectedError();
    }
  };

  const onEditUser = async (dataDinamic: any) => {
    setLoadingRequest(true);
    const currentDatas = { ...selectedUser };
    delete currentDatas.position;
    const updateUser: UserToOrganization = {
      ...currentDatas,
      ...dataDinamic,
    };
    try {
      let respUser = await onEditUserToOrganization(updateUser);
      if (respUser._id) {
        setLoadingRequest(false);
        DispatchMessageService({
          type: 'success',
          msj: '¡Se actualizó correctamente!',
          action: 'show',
        });
        setbackToCreate(false);
        if (onCancel) onCancel();
        getEventsStatisticsData();
      } else {
        setLoadingRequest(false);
        setbackToCreate(true);
        resultUnexpectedError();
      }
    } catch (error) {
      setLoadingRequest(false);
      setbackToCreate(true);
      resultUnexpectedError();
    }
  };

  const alreadyExistUserInOrganization = async (email: string): Promise<boolean> => {
    const { data } = await OrganizationApi.getUsers(organizationId);
    return data.filter((userOrganization: any) => userOrganization.properties.email === email).length > 0;
  };

  const onAddUserToOrganization = async (newUser: UserToOrganization): Promise<void> => {
    setLoadingRequest(true);
    const { picture, password, ...userToOrganization } = newUser;
    const alreadyExistUser = await alreadyExistUserInOrganization(newUser.email);
    if (alreadyExistUser) return resultUserExistIntoOrganization(newUser.email);

    try {
      const respUser = await OrganizationApi.saveUser(organizationId, { properties: userToOrganization }, addToUserEvents);

      if (respUser._id) {
        setLoadingRequest(false);
        resultUserOrganizationSuccess(newUser.names);
        setbackToCreate(false);
        getEventsStatisticsData();
      } else {
        setLoadingRequest(false);
        resultUserOrganizationError(newUser.names);
      }
    } catch (error) {
      setLoadingRequest(false);
      resultUserOrganizationError(newUser.names);
    }
  };

  const onEditUserToOrganization = async ({ rol_id, ...updateUser }: UserToOrganization) => {
    const { picture, password, ...userToOrganization } = updateUser;
    return await OrganizationApi.editUser(organizationId, selectedUser?._id, {
      properties: userToOrganization,
      rol_id,
    });
  };

  const renderFormDinamic = () => {
    return (
      <div>
        {!haveDinamicProperties ? (
          <>
            <Result icon={<></>} title='No hay datos configurados' subTitle='Puede continuar' />
            <Space>
              <Button onClick={onLastStep}>Atrás</Button>
              <Button onClick={() => onFinishDinamicStep()} type='primary'>
                Finalizar
              </Button>
            </Space>
          </>
        ) : (
          <>
            {organization && (
              <OrganizationPropertiesForm
                form={formDinamicData}
                organization={
                  !selectedUser
                    ? organization
                    : {
                        ...organization,
                        user_properties: [
                          ...organization?.user_properties,
                          {
                            name: 'rol_id',
                            label: 'Rol',
                            mandatory: true,
                            type: 'list',
                            options: [
                              {
                                value: '60e8a7e74f9fb74ccd00dc22',
                                label: 'Attendee',
                                type: 'attendee',
                              },
                              {
                                value: '5c1a59b2f33bd40bb67f2322',
                                label: 'Administrator',
                                type: 'admin',
                              },
                            ],
                          },
                        ],
                      }
                }
                onSubmit={onFinishDinamicStep}
                noSubmitButton
                onLastStep={onLastStep}
              />
            )}
            <Space>
              {!selectedUser && <Button onClick={onLastStep}>Atrás</Button>}
              <Button
                loading={loadingRequest}
                onClick={() => {
                  formDinamicData.submit();
                }}
                type='primary'>
                Finalizar
              </Button>
            </Space>
          </>
        )}
      </div>
    );
  };

  useEffect(() => {
    OrganizationApi.getOne(organizationId).then((response) => {
      setOrganization(response);
    });
  }, [organizationId]);

  useEffect(() => {
    const dinamicPropsOrEdit: boolean =
      organization?.user_properties?.filter((userOrg: any) => !['names', 'email'].includes(userOrg.name)).length > 0 ||
      !!selectedUser;
    setHaveDinamicProperties(dinamicPropsOrEdit);
  }, [organization]);

  useEffect(() => {
    if (selectedUser) {
      formBasicData.setFieldsValue({
        email: selectedUser.email,
        names: selectedUser.names,
        password: selectedUser.password,
      });
    } else {
      formBasicData.setFieldsValue(initialForm);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (haveDinamicProperties && selectedUser) {
      const { password, names, email, ...dinamicProperties } = selectedUser;
      formDinamicData.setFieldsValue(dinamicProperties);
    }
  }, [selectedUser, haveDinamicProperties]);

  const steps = [
    {
      title: 'First',
      icon: <AccountOutlineIcon style={{ fontSize: '32px' }} />,
      content: (
        <div>
          <UserOrganizationForm
            form={formBasicData}
            setimageFile={setImagesFile}
            filesSelected={imageFile}
            onFinish={onFinisUserOrganizationStep}
            addToUserEvents={addToUserEvents}
            onChangeAddUserToEvent={onChangeAddUserToEvent}
          />
          <Button onClick={() => formBasicData.submit()}>Siguiente</Button>
        </div>
      ),
    },
    {
      title: 'Second',
      icon: <TicketConfirmationOutlineIcon style={{ fontSize: '32px' }} />,
      content: renderFormDinamic(),
    },
    {
      title: 'Last',
      icon: <ScheduleOutlined style={{ fontSize: '32px' }} />,
      content: (
        <div>
          {loadingRequest && <Spin />}
          {!loadingRequest && <Result title={resultData.title} subTitle={resultData.subTitle} icon={<></>} />}
          {backToCreate && !loadingRequest && (
            <Space>
              <Button
                onClick={() => {
                  onContinueCreating();
                  onLastStep();
                }}>
                Atrás
              </Button>
              <Button onClick={() => onAddUserToOrganization(dataToAddUser)} type='primary'>
                Agregar
              </Button>
            </Space>
          )}
        </div>
      ),
    },
  ];

  return (
    <Modal closable footer={false} {...modalProps} onCancel={onCancel}>
      <div style={screens.xs ? stylePaddingMobile : stylePaddingDesktop}>
        {selectedUser ? (
          <>
            <UnchangeableUserData selectedUser={selectedUser} />
            {renderFormDinamic()}
          </>
        ) : (
          <div
            style={{
              marginTop: '30px',
            }}>
            <Steps current={current} responsive={false}>
              {steps.map((item) => (
                <Steps.Step key={item.title} icon={item.icon} />
              ))}
            </Steps>
            <div>{steps[current].content}</div>
          </div>
        )}
      </div>
    </Modal>
  );
};
