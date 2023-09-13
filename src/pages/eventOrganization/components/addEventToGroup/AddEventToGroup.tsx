import { Form, Modal, ModalProps, Select } from 'antd';
import { useGetGruopEventList } from '../../hooks/useGetGruopEventList';
import { getGroupsToSelect } from '../../utils/transformDataToSelect';

interface Props extends ModalProps {
  onCancel: () => void;
  selectedEvent: any;
  organizationId: string;
}

interface EditEventOrganization {
  groupId: string;
}

export const AddEventToGroup = ({ onCancel: onCanel, organizationId, ...modalProps }: Props) => {
  const { groupEvent, isLoading } = useGetGruopEventList(organizationId);
  const [form] = Form.useForm<EditEventOrganization>();

  const onAddEventToGroup = () => {};
  return (
    <Modal {...modalProps} onCancel={onCanel} footer={false} title={'Edicion de eventos en organizacion'}>
      <Form onFinish={onAddEventToGroup}>
        <Form.Item label={'Escoger el grupo'} name='group' hasFeedback>
          <Select
            loading={isLoading}
            size='large'
            placeholder='micorreo@ejemplo.com'
            options={getGroupsToSelect(groupEvent)}
            allowClear
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
