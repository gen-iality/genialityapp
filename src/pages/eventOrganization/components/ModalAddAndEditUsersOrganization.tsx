import React, { useEffect, useState } from 'react';
import { Button, Form, Grid, Modal, ModalProps, Result, Space, Spin, Steps } from 'antd';
import { stylePaddingDesktop, stylePaddingMobile } from '../styles/user-organization.style';
import { FormUserOrganization } from '../interface/organization.interface';
import { UserOrganizationForm } from './UserOrganizationForm';
import { UploadFile } from 'antd/lib/upload/interface';
import OrganizationPropertiesForm from './OrganizationPropertiesForm';
import { OrganizationApi } from '@/helpers/request';
import AccountOutlineIcon from '@2fd/ant-design-icons/lib/AccountOutline';
import TicketConfirmationOutlineIcon from '@2fd/ant-design-icons/lib/TicketConfirmationOutline';
import { ScheduleOutlined } from '@ant-design/icons';
import { saveImageStorage } from '@/helpers/helperSaveImage';
import createNewUser from '@/components/authentication/ModalsFunctions/createNewUser';

interface User {
  email: string;
  names: string;
}
interface UserToOrganization extends User {
  [key: string]: any;
}

const initialForm: FormUserOrganization = {
  email: '',
  names: '',
  password: '',
  imageFile: undefined,
};

interface Props extends ModalProps {
  selectedUser?: FormUserOrganization;
  organizationId: string;
}

export const ModalAddAndEditUsers = ({ selectedUser, organizationId, ...modalProps }: Props) => {
  const [current, setCurrent] = useState(0);
  const screens = Grid.useBreakpoint();
  const [formBasicData] = Form.useForm();
  const [formDinamicData] = Form.useForm();
  const [imageFile, setImagesFile] = useState<UploadFile>();
  const [organization, setOrganization] = useState<any>();
  const [dataBasic, setdataBasic] = useState<FormUserOrganization>();
  const [backToCreate, setbackToCreate] = useState(false);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [dataToAddUser, setdataToAddUser] = useState<any>();
  const [resultData, setresultData] = useState({
    title: '',
    subTitle: '',
  });

  const resultEmailExist = () => {
    setresultData({
      title: 'El correo electronico ya existe',
      subTitle: 'Puede cambiarlo o agregar el usuario a tu organizacion',
    });
  };

  const resultUserExistIntoOrganization = (email: string) => {
    setresultData({
      title: 'EL usuario ya es miembro',
      subTitle: `El usuario con email: ${email} ya es miembro de esta organizacion`,
    });
    setbackToCreate(false);
    setLoadingRequest(false);
  };

  const resultUnexpectedError = () => {
    setresultData({ title: 'Error inesperado', subTitle: 'Ocurrio un error inesperado creando el usuario' });
  };

  const resultUserOrganizationSuccess = (name: string) => {
    setresultData({ title: 'Se creo correctamente', subTitle: `Se agrego el usuario ${name} a tu organiacion` });
  };

  const resultUserOrganizationError = (name: string) => {
    setresultData({
      title: `Error al agregar el usuario`,
      subTitle: `No se agrego el usuario ${name} a tu organiacion`,
    });
  };

  const onLastStep = () => {
    setCurrent(current > 0 ? current - 1 : current);
  };

  const onNextStep = () => {
    setCurrent(current < steps.length - 1 ? current + 1 : current);
  };

  const onFinisUserOrganizationStep = (values: FormUserOrganization) => {
    setdataBasic(values);
    onNextStep();
  };

  const onContinueCreating = () => {
    onLastStep();
    setbackToCreate(false);
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

  useEffect(() => {
    OrganizationApi.getOne(organizationId).then((response) => {
      setOrganization(response);
    });
  }, []);

  useEffect(() => {
    if (selectedUser) {
      formBasicData.setFieldsValue(selectedUser);
    } else {
      formBasicData.setFieldsValue(initialForm);
    }
  }, [selectedUser]);
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
      content: (
        <div>
          {organization?.user_properties?.filter((userOrg: any) => !['names', 'email'].includes(userOrg.name))
            .length === 0 ? (
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
      ),
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
              <Button onClick={onContinueCreating}>Atras</Button>
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
      </div>
    </Modal>
  );
};
