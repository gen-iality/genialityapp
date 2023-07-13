import React, { useEffect, useState } from 'react';
import { Button, Form, Grid, Modal, ModalProps, Space, Steps } from 'antd';
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
  const [organization, setOrganization] = useState();
  const [dataBasic, setdataBasic] = useState<FormUserOrganization>();

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

  const onFinishDinamicStep = (values: any) => {
    onCreateUser(values);
    onNextStep();
  };

  const onCreateUser = async (dataDinamic: any) => {
    const nuewUserPicture = await saveImageStorage(imageFile?.thumbUrl);
    const newUser = {
      names: dataBasic?.names,
      email: dataBasic?.email,
      picture: nuewUserPicture,
      password: dataBasic?.password,
      ...dataDinamic,
    };
    return console.log('newUser', newUser);
    // return console.log('data=>', { dataBasic, dataDinamic, imageFile: imageFile?.url });
    // const respUser = await OrganizationApi.saveUser(organizationId, propertiesOrgMember);
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
        </div>
      ),
    },
    {
      title: 'Last',
      icon: <ScheduleOutlined style={{ fontSize: '32px' }} />,
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
