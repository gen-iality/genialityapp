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

const initialForm: FormUserOrganization = {
  email: '',
  names: '',
  password: '',
};

interface Props extends ModalProps {
  selectedUser?: Omit<UserToOrganization, 'password'>;
  organizationId: string;
}

export const ModalAddAndEditUsers = ({ selectedUser, organizationId, ...modalProps }: Props) => {
  const screens = Grid.useBreakpoint();
  const [formBasicData] = Form.useForm<FormUserOrganization>();
  const [formDinamicData] = Form.useForm();
  const [imageFile, setImagesFile] = useState<UploadFile>();
  const [organization, setOrganization] = useState<any>();
  const [dataBasic, setdataBasic] = useState<FormUserOrganization>();
  const [dataToAddUser, setdataToAddUser] = useState<any>();
  const [haveDinamicProperties, setHaveDinamicProperties] = useState(false);
  const { current, onLastStep, onNextStep } = useSteps(3);
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

  const onFinisUserOrganizationStep = (values: FormUserOrganization) => {
    setdataBasic(values);
    onNextStep();
  };

  const onFinishDinamicStep = (values?: any) => {
    onCreateUser(values);
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
    let resp = await createNewUser(newUser);
    if (resp === 0) {
      setdataToAddUser(newUser);
      setLoadingRequest(false);
      resultEmailExist();
      setbackToCreate(true);
      return;
    }

    if (resp === 1) {
      setLoadingRequest(false);
      return onAddUserToOrganization(newUser);
    }

    setLoadingRequest(false);
    setbackToCreate(true);
    resultUnexpectedError();
  };

  const alreadyExistUserInOrganization = async (email: string) => {
    const { data } = await OrganizationApi.getUsers(organizationId);
    return data.filter((userOrganization: any) => userOrganization.properties.email === email).length > 0;
  };

  const onAddUserToOrganization = async (newUser: UserToOrganization) => {
    setLoadingRequest(true);
    const { picture, password, ...userToOrganization } = newUser;
    const alreadyExistUser = await alreadyExistUserInOrganization(newUser.email);
    if (alreadyExistUser) return resultUserExistIntoOrganization(newUser.email);

    const respUser = await OrganizationApi.saveUser(organizationId, { properties: userToOrganization });

    if (respUser._id) {
      setLoadingRequest(false);
      resultUserOrganizationSuccess(newUser.names);
      setbackToCreate(false);
      return;
    }
    setLoadingRequest(false);
    resultUserOrganizationError(newUser.names);
  };

  const renderFormDinamic = () => {
    return (
      <div>
        {!haveDinamicProperties ? (
          <>
            <Result icon={<></>} title='No hay datos configurados' subTitle='Puede continuar' />
            <Space>
              <Button onClick={onLastStep}>Atras</Button>
              <Button onClick={() => onFinishDinamicStep()} type='primary'>
                Finalizar
              </Button>
            </Space>
          </>
        ) : (
          <>
            <OrganizationPropertiesForm
              form={formDinamicData}
              organization={organization}
              onSubmit={onFinishDinamicStep}
              noSubmitButton
              onLastStep={onLastStep}
            />
            <Space>
              <Button onClick={onLastStep}>Atras</Button>
              <Button
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
    setHaveDinamicProperties(
      organization?.user_properties?.filter((userOrg: any) => !['names', 'email'].includes(userOrg.name)).length > 0
    );
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
                Atras
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
    <Modal closable footer={false} {...modalProps}>
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
