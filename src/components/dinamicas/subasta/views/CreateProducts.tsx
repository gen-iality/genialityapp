import React, { useContext, useEffect, useState } from 'react';
import Products from '../components/cms/Products';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Row } from 'antd';
import useProducts from '../hooks/useProducts';
import ModalProducts from '../components/cms/ModalProducts';
import { ImagesData, ModalProduct } from '../interfaces/auction.interface';
import { InitialModalState, deleteImage } from '../utils/utils';
import { AuctionContext } from '../context/AuctionContext';
import Loading from '@/components/profile/loading';
import { DispatchMessageService } from '@/context/MessageService';
import { UploadFile } from 'antd/lib/upload/interface';

export default function CreateProducts({reload}: {reload: boolean}) {
  const [modal, setmodal] = useState({ visibility: false, edit: false });
  const [productSelect, setProductSelect] = useState<ModalProduct>(InitialModalState);
  const { eventId } = useContext(AuctionContext);
  const { products, createProduct, deleteProduct, updateProduct, loading, deleteImages, refresh } = useProducts(eventId);
  useEffect(() => {
    refresh()
  }, [reload]);
  const onChange = async ({ file, fileList: newFileList }: ImagesData) => {
    const { status } = file;
    switch (status) {
      case 'removed':
        if (!modal.edit || newFileList.length !== 0) {
          await deleteImage(file, setProductSelect, newFileList);
        } else {
          DispatchMessageService({ type: 'warning', msj: 'el producto debe tener minimo una imagen', action: 'show' });
        }
        break;
      case 'error':
        DispatchMessageService({ type: 'error', msj: 'No se logro subir una imagen', action: 'show' });
        setProductSelect({ ...productSelect, images: newFileList });
        break;

      case 'done':
      case 'uploading':
        setProductSelect({ ...productSelect, images: newFileList });
        break;

      default:
        break;
    }
  };

  const onSave = async (product: ModalProduct) => {
    if (productSelect.images.length === 0)
      return DispatchMessageService({ type: 'error', msj: 'Debe añadir por lo menos una imagen', action: 'show' });
    if (modal.edit) {
      await updateProduct(product, productSelect.images);
    } else {
      await createProduct(product, productSelect.images);
    }
    resetModal();
  };

  const resetModal = () => {
    setmodal({ visibility: false, edit: false });
    setProductSelect(InitialModalState);
  };

  const onCancel = async (images: UploadFile[], update?: boolean) => {
    if (!modal.edit) {
      await deleteImages(images);
    } else {
      const newImages = images.filter((img) => !img.url);

      await deleteImages(newImages);
    }
    resetModal();
  };

  return (
    <>
      <Modal
        visible={modal.visibility}
        title={modal.edit ? 'Editar Producto' : 'Agregar Producto'}
        footer={false}
        closable={false}
        okText={'Guardar'}>
        <ModalProducts
          key={`${productSelect._id}`}
          onChange={onChange}
          product={productSelect}
          onCancel={onCancel}
          onSave={onSave}
        />
      </Modal>
      <Row justify='end'>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => {
            setProductSelect(InitialModalState);
            setmodal({ visibility: true, edit: false });
          }}>
          Agregar
        </Button>
      </Row>
      <Row justify='center' style={{ margin: 10 }}>
        {!loading ? (
          <Products
            products={products}
            onDelete={deleteProduct}
            onclick={(product) => {
              
                setProductSelect(product);
                setmodal({ visibility: true, edit: true });
            
            }}
          />
        ) : (
          <Loading />
        )}
      </Row>
    </>
  );
}
