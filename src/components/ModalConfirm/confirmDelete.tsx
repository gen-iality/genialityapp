import { Modal } from 'antd';
import { MessageConfirmDelete } from './ContenDelete';

interface ParamsSync {
  titleConfirm: string;
  descriptionConfirm: string;
  onOk: () => void;
}
interface ParamsAync {
  titleConfirm: string;
  descriptionConfirm: string;
}

export const confirmDeleteSync = ({ descriptionConfirm, onOk, titleConfirm }: ParamsSync) => {
  Modal.confirm({
    content: <MessageConfirmDelete titleConfirm={titleConfirm} descriptionConfirm={descriptionConfirm} />,
    okText: 'Eliminar',
    cancelText: 'Cancelar',
    onOk,
    icon: null,
  });
};
export const confirmDeleteAsync = ({ descriptionConfirm, titleConfirm }: ParamsAync) => {
  return new Promise<boolean>((resolve, reject) => {
    Modal.confirm({
      content: <MessageConfirmDelete titleConfirm={titleConfirm} descriptionConfirm={descriptionConfirm} />,
      okText: 'Eliminar',
      cancelText: 'Cancelar',
      onOk: () => {
        resolve(true);
      },
      onCancel: () => {
        resolve(false);
      },
      icon: null,
    });
  });
};
