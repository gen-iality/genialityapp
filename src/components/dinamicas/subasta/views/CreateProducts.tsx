import React, { useEffect, useState } from 'react';
import Products from '../components/cms/Products';
import { PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Row } from 'antd';
import useProducts from '../hooks/useProducts';
import ModalProducts from '../components/cms/ModalProducts';
import { ImagesData, ModalProduct, Products as IProduct } from '../interfaces/auction.interface';
import { InitialModalState, deleteImage } from '../utils/utils';
import Loading from '@/components/profile/loading';
import { DispatchMessageService } from '@/context/MessageService';
import { UploadFile } from 'antd/lib/upload/interface';

export default function CreateProducts({reload, eventId}: {reload: boolean,eventId: string}) {
  const [modal, setmodal] = useState({ visibility: false, edit: false });
  const [productSelect, setProductSelect] = useState<IProduct>(InitialModalState);
  const { products, createProduct, deleteProduct, updateProduct, loading, deleteImages, refresh } = useProducts(eventId);
  const [loadingModal, setLoadingModal] = useState(false);
  
  useEffect(() => {
    if(reload) refresh()
  }, [reload]);

  const onChange = async ({ file, fileList: newFileList }: ImagesData) => {
    const { status } = file;
    setLoadingModal(true)
    switch (status) {
      case 'removed':
        if (!modal.edit || newFileList.length !== 0) {
          await deleteImage(file, setProductSelect, newFileList);
        } else {
          DispatchMessageService({ type: 'warning', msj: 'el producto debe tener mínimo una imagen', action: 'show' });
        }
        setLoadingModal(false)
        break;
      case 'error':
        DispatchMessageService({ type: 'error', msj: 'No se logro subir una imagen', action: 'show' });
        setProductSelect({ ...productSelect, images: newFileList });
        setLoadingModal(false)
        break;

      case 'done':
      case 'uploading':
        setProductSelect({ ...productSelect, images: newFileList });
        setLoadingModal(false)
        break;

      default:
        setLoadingModal(false)
        break;
    }
  };

  const onSave = async (product: ModalProduct) => {
    if (productSelect.images.length === 0)  return DispatchMessageService({ type: 'error', msj: 'Debe añadir por lo menos una imagen', action: 'show' });
      if (modal.edit) {
      await updateProduct(product, productSelect.images,productSelect.state,productSelect.price);
    } else {
      await createProduct(product, productSelect.images);
    }
    resetModal();
  };

  const resetModal = () => {
    setLoadingModal(false)
    setmodal({ visibility: false, edit: false });
    setProductSelect(InitialModalState);
  };

  const onCancel = async (images: UploadFile[], update?: boolean) => {
    setLoadingModal(true)
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
        title={modal.edit ? 'Editar producto' : 'Agregar producto'}
        footer={false}
        closable
        onCancel={()=>onCancel(productSelect.images)}
        destroyOnClose
        style={{ top: 20 }}
        okText={'Guardar'}>
        <ModalProducts
          key={`${productSelect._id}`}
          loading={loadingModal}
          onChange={onChange}
          product={productSelect}
          onCancel={onCancel}
          onSave={onSave}
        />
      </Modal>
      <Row justify='end' style={{paddingBottom: 10}}>
        <Button
          type='primary'
          icon={<PlusCircleOutlined />}
          onClick={() => {
            setProductSelect(InitialModalState);
            setmodal({ visibility: true, edit: false });
          }}>
          Agregar
        </Button>
      </Row>
      {!loading ? (
        <Card style={{overflowY: 'auto', height: '65vh'}} bodyStyle={{padding: 5}} className='desplazar'>
          <Products
            products={products}
            onDelete={deleteProduct}
            onclick={(product) => {
              setProductSelect(product);
              setmodal({ visibility: true, edit: true });
            }}
          />
        </Card>
      ) : (
        <Loading />
      )}
    </>
  );
}
