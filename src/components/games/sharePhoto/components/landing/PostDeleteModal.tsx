import DeleteForeverIcon from '@2fd/ant-design-icons/lib/DeleteForever';
import { HeartFilled } from '@ant-design/icons';
import { Button, Modal, Tooltip } from 'antd';
import React, { useState } from 'react';
import useSharePhoto from '../../hooks/useSharePhoto';

interface Props {
  postId: string;
}

export default function PostDeleteModal(props: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { postId } = props;
  const { deletePost } = useSharePhoto();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    console.log(`Deleting ${postId}`);
    await deletePost(postId);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Tooltip title='Eliminar publicación'>
        <Button
          size='large'
          shape='circle'
          type='text'
          onClick={showModal}
          icon={<DeleteForeverIcon style={{ color: '#FF4D4F', fontSize: '25px' }} />}
        />
      </Tooltip>
      {/* <Button type='primary' onClick={showModal}>
				Borrar publicación
			</Button> */}
      <Modal title='Borrar publicación' visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        Estas seguro que quieres borrar la publicación. Si la borras, perderas todos tus likes.
      </Modal>
    </>
  );
}
