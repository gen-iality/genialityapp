import React, { useEffect, useState } from 'react';
import { EventsApi } from '@/helpers/request';
import { handleRequestError } from '@/helpers/utils';
import { DispatchMessageService } from '@/context/MessageService';
import { removeObjectFromArray, renderTypeImage } from '@/Utilities/imgUtils';
import { ImageFile, Product, Validators, useAddProductHookProps } from '../interface/productTypes';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';

const { confirm } = Modal;
let oldDiscount: number = 0;
const defaultImage = 'data:image/png;base64,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'

export default function useAddProductHook(props: useAddProductHookProps) {
  // State variables
  const [product, setProduct] = useState<Product>({} as Product);
  const [name, setName] = useState<string | null>(null);
  const [creator, setCreator] = useState<string>('');
  //subasta o tienda
  // const [shop, setShop] = useState<string>('just-store');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string | number>(0);
  const [picture, setPicture] = useState<string | null>(null);
  const [optionalPicture, setOptionalPicture] = useState<string>('');
  const [imageFile, setImgFile] = useState<ImageFile[]>([]);
  const [error, setError] = useState<Validators | null>(null);
  const [idNew, setIdNew] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [discount, setDiscount] = useState<number | null>(null);
  const [discountEnabled, setDiscountEnabled] = useState<boolean>(false);
  const formLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };
  useEffect(() => {
    // Fetch product data if an ID is provided in the route parameters
    if (props.match.params.id) {
      setIdNew(props.match.params.id);
      EventsApi.getOneProduct(props.eventId, props.match.params.id).then((product) => {
        setProduct(product);
        setName(product.name);
        setCreator(product.by);
        setDiscount(product.discount);
        // subasta o tienda
        // setShop(product.type)
        setDescription(product.description || '');
        setPicture(product.images && product.images[0] ? product.images[0] : defaultImage);
        setImgFile([
          { name: 'Imagen', file: product.images && product.images[0] ? product.images[0] : defaultImage },
          { name: 'img_optional', file: product.images[1] },
        ]);
        setOptionalPicture(product.images && product.images[1] ? product.images[1] : null);
        setPrice(product.price);
        setIsLoading(false);
      });
    } else {
      setImgFile([
        { name: 'Imagen', file: product.images && product.images[0] ? product.images[0] : defaultImage }
      ]);
    }
  }, [props.match.params.id]);

  useEffect(() => {
    setDiscountEnabled(product.discount ? true : false);
  }, [product.discount]);

  useEffect(() => {
    setDiscount(discountEnabled ? oldDiscount : 0);
  }, [discountEnabled]);

  const goBack = () => props.history.goBack();
  // Event handlers
  const handleDiscountEnabledChange = () => {
    setDiscountEnabled((old) => !old);
  };
  // subasta o tienda
  // const handleChange = (value: string): void => {
  //   setShop(value);
  // };
  // console.log(shop);

  const onChangeDiscount = (value: number | null): void => {
    setDiscount(value === null ? null : value);
    oldDiscount = value || 0;
  };

  const changeInput = (e: React.ChangeEvent<HTMLInputElement>, key: string): void => {
    if (key === 'name') {
      setName(e.target.value);
    } else if (key === 'price') {
      setPrice(e.target.value);
    } else if (key === 'creator') {
      setCreator(e.target.value);
    }
  };

  const changeDescription = (e: string) => {
    const MINIMUM_CHARS_TO_DESCRIPTION = 10000;
    if (description.length < MINIMUM_CHARS_TO_DESCRIPTION) {
      setDescription(e);
    } else {
      //alert('NO PUEDE ESCRIBIR MAS');
    }
  };

  const changeImg = (file: File | null, name: string): void => {
    let temp = imageFile;
    let ImagenSearch = imageFile.filter((img) => img.name === name);
    if (ImagenSearch.length > 0) {
      let newtemp = imageFile.filter((img) => img.name !== name);
      temp = newtemp;
      temp.push({ name, file });
      setImgFile(temp);
      return;
    }

    if (file) {
      temp.push({ name, file });
      setImgFile(temp);
    } else {
      removeObjectFromArray(name, temp, setImgFile);
      temp.push({ name, file: new File([], '') });
    }
  };

  const saveProduct = async (): Promise<void> => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: ' Por favor espere mientras se guarda la información...',
      action: 'show',
    });

    let validators: Validators = {
      price: false,
      creator: false,
      name: false,
      description: false,
      picture: false,
    };
    validators.price = false;
    validators.creator = false;

    if (name === '') {
      validators.name = true;
    } else {
      validators.name = false;
    }
    if (description === '') {
      validators.description = true;
    } else {
      validators.description = false;
    }
    // if (picture === null) {
    //   validators.picture = true;
    // } else {
    //   validators.picture = false;
    // }
    let ImagenFilled = imageFile.filter((img) => img.name === 'Imagen');
    if (ImagenFilled.length === 0) {
      validators.picture = true;
    } else {
      validators.picture = false;
    }

    setError(validators);
    if (
      validators &&
      validators.name === false &&
      validators.creator === false &&
      validators.description === false &&
      validators.picture === false &&
      validators.price === false
    ) {
      try {
        if (idNew !== undefined && idNew !== null && idNew !== 'null' && idNew !== 'undefined' && idNew !== '') {
          let resp = await EventsApi.editProduct(
            {
              name,
              by: creator,
              description,
              price,
              discount: discount,
              images: [renderTypeImage('Imagen', imageFile), renderTypeImage('img_optional', imageFile)],
              // subasta o tienda
              // type: shop,
              type: 'just-store',
            },
            props.eventId,
            product._id
          );
          if (resp) {
            props.history.push(`/eventadmin/${props.eventId}/product`);
          }
        } else {
          const newProduct = await EventsApi.createProducts(
            {
              name,
              by: creator,
              description,
              price,
              discount: discount,
              images: [renderTypeImage('Imagen', imageFile), renderTypeImage('img_optional', imageFile)],
              // subasta o tienda
              // type: shop,
              type: 'just-store',
            },
            props.eventId
          );
          if (newProduct) {
            props.history.push(`/eventadmin/${props.eventId}/product`);
          }
        }
        DispatchMessageService({
          key: 'loading',
          action: 'destroy',
        });
        DispatchMessageService({
          type: 'success',
          msj: 'Información guardada correctamente!',
          action: 'show',
        });
      } catch (e) {
        // e;
        DispatchMessageService({
          key: 'loading',
          action: 'destroy',
        });
        DispatchMessageService({
          type: 'error',
          msj: e as string,
          action: 'show',
        });
      }
    } /* else {
      console.log('algo fallo', validators);
    } */
  };

  const remove = () => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: ' Por favor espere mientras se borra la información...',
      action: 'show',
    });
    if (props.match.params.id) {
      confirm({
        title: `¿Está seguro de eliminar la información?`,
        icon: <ExclamationCircleOutlined />,
        content: 'Una vez eliminado, no lo podrá recuperar',
        okText: 'Borrar',
        okType: 'danger',
        cancelText: 'Cancelar',
        onOk() {
          const onHandlerRemove = async () => {
            try {
              await EventsApi.deleteProduct(props.match.params.id, props.eventId);
              DispatchMessageService({
                key: 'loading',
                action: 'destroy',
              });
              DispatchMessageService({
                type: 'success',
                msj: 'Se eliminó la información correctamente!',
                action: 'show',
              });
              goBack();
            } catch (e) {
              DispatchMessageService({
                key: 'loading',
                action: 'destroy',
              });
              DispatchMessageService({
                type: 'error',
                msj: handleRequestError(e)?.message,
                action: 'show',
              });
            }
          };
          onHandlerRemove();
        },
      });
    }
  };
  
  return {
    name,
    price,
    discount,
    picture,
    optionalPicture,
    description,
    error,
    creator,
    isLoading,
    discountEnabled,
    remove,
    saveProduct,
    handleDiscountEnabledChange,
    onChangeDiscount,
    changeInput,
    changeDescription,
    changeImg,
    formLayout,
  };
}
{
  /* <Row justify='center' wrap gutter={12}>
        {props.match.params.id && isLoading ? (
          <Loading />
        ) : (
          <Col span={16}>
            <Form.Item
              label={
                <label style={{ marginTop: '2%' }}>
                  Nombre del producto <label style={{ color: 'red' }}>*</label>
                </label>
              }
              rules={[{ required: true, message: 'Ingrese el nombre de la producto' }]}>
              <Input
                value={name as string}
                placeholder='Nombre del producto'
                name={'name'}
                onChange={(e: ChangeEvent<HTMLInputElement>) => changeInput(e, 'name')}
              />
              {error != null && error.name && (
                <small style={{ color: 'red' }}>El nombre del producto es requerido</small>
              )}
            </Form.Item>
            <Form.Item label={<label style={{ marginTop: '2%' }}>Vendedor</label>} rules={[{ required: false }]}>
              <Input
                value={creator}
                placeholder='Nombre del autor, creador o descripción corta'
                name={'creator'}
                onChange={(e: ChangeEvent<HTMLInputElement>) => changeInput(e, 'creator')}
              />
              {error != null && error.creator && <small style={{ color: 'red' }}>Este campo es requerido</small>}
            </Form.Item>
            / <Form.Item label={<label style={{ marginTop: '2%' }}>Tipo</label>} rules={[{ required: false }]}>
              <Select value={shop} style={{ width: 120 }} onChange={handleChange}>
                <Option value='just-store'>Tienda</Option>
                <Option value='Prueba'>Subasta</Option>
              </Select>
              {error != null && error.shop && <small style={{ color: 'red' }}>Este campo es requerido</small>}
            </Form.Item> *
            <Form.Item
              label={
                <label style={{ marginTop: '2%' }}>
                  Descripción <label style={{ color: 'red' }}>*</label>
                </label>
              }>
              <EviusReactQuill data={description} id={'descriptionProduct'} handleChange={changeDescription} />
              {error != null && error.description && (
                <small style={{ color: 'red' }}>La descripción del producto es requerida</small>
              )}
            </Form.Item>
            <Form.Item
              label={<label style={{ marginTop: '2%' }}>Valor</label>}
              rules={[{ required: false, message: 'Ingrese el valor del producto' }]}>
              <Input
                value={price}
                placeholder='Valor del producto'
                name={'price'}
                onChange={(e: ChangeEvent<HTMLInputElement>) => changeInput(e, 'price')}
              />
            </Form.Item>
            <Form.Item>
              <label style={{ marginTop: '2%', marginRight: '5px' }}>Habilitar descuento</label>
              <Switch checked={discountEnabled} onChange={handleDiscountEnabledChange} />
            </Form.Item>
            {discountEnabled && (
              <Form.Item label={<label style={{ marginTop: '2%' }}>Descuento</label>} rules={[{ required: false }]}>
                <InputNumber
                  defaultValue={discount ? discount : 100}
                  min={1}
                  max={100}
                  formatter={(value: number) => (value === null ? '' : `${value}%`)}
                  parser={(value: any) => (value ? value.replace('%', '') : undefined)}
                  onChange={onChangeDiscount}
                />
              </Form.Item>
            )}
            <label style={{ marginTop: '2%' }}>
              Imagen <label style={{ color: 'red' }}>*</label>
            </label>
            <ImageUploaderDragAndDrop
              imageDataCallBack={(file: any) => changeImg(file, 'Imagen')}
              imageUrl={picture !== null ? (picture as string) : ''}
              width='1080'
              height='1080'
            />
            {error != null && error.picture && <small style={{ color: 'red' }}>La imagen es requerida</small>}

            <label style={{ marginTop: '2%' }}>Imagen opcional</label>

            <ImageUploaderDragAndDrop
              imageDataCallBack={(file: any) => changeImg(file, 'img_optional')}
              imageUrl={optionalPicture}
              width='1080'
              height='1080'
            />
          </Col>
        )}
      </Row> */
}
