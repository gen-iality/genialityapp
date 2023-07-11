import React, { useEffect, useState } from 'react';
import { Button, Form, Grid, Modal, ModalProps, Space, Steps } from 'antd';
import { stylePaddingDesktop, stylePaddingMobile } from '../styles/user-organization.style';
import { steps } from '../utils/stepsUserOranizationModal';
import { FormUserOrganization } from '../interface/organization.interface';
import { UserOrganizationForm } from './UserOrganizationForm';
import { UploadFile } from 'antd/lib/upload/interface';
import OrganizationPropertiesForm from './OrganizationPropertiesForm';
import { OrganizationApi } from '@/helpers/request';

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
  const [form] = Form.useForm();
  const [imageFile, setImagesFile] = useState<UploadFile>();
  const [organization, setOrganization] = useState();

  const onResetForm = () => {
    form.setFieldsValue(initialForm);
  };
  const onLastStep = () => {
    setCurrent(current > 0 ? current - 1 : current);
  };

  const onNextStep = () => {
    setCurrent(current < steps.length - 1 ? current + 1 : current);
  };

  useEffect(() => {
    OrganizationApi.getOne(organizationId).then((response) => {
      setOrganization(response);
    });
  }, []);

  useEffect(() => {
    if (selectedUser) {
      form.setFieldsValue(selectedUser);
    } else {
      form.setFieldsValue(initialForm);
    }
  }, [selectedUser]);

console.log('current',current)
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

          {current === 0 && <UserOrganizationForm form={form} setimageFile={setImagesFile} filesSelected={imageFile} />}
          {current === 1 && (
            <OrganizationPropertiesForm form={form} organization={organization} onSubmit={onSubmit} noSubmitButton />
          )}

          <Space>
            {current !== 0 && <Button onClick={onLastStep}>Atras</Button>}
            {current < steps.length - 2 && <Button onClick={onNextStep}>Siguiente</Button>}
            {current === steps.length - 2 && (
              <Button onClick={onNextStep} type='primary'>
                Finalizar
              </Button>
            )}
          </Space>
        </div>
      </div>
    </Modal>
  );
};
