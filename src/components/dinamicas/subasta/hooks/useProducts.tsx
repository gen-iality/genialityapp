import * as service from '../services/index';
import { useEffect, useState } from 'react';
import { ModalProduct, ProductState, Products } from '../interfaces/auction.interface';
import { UploadFile } from 'antd/lib/upload/interface';
import { deleteFireStorageData } from '@/Utilities/deleteFireStorageData';

const useProducts = (eventId: string) => {
  const [products, setproducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getProducts();
  }, []);

  const FilterImage = (images: UploadFile[]): UploadFile[] => {
    return images
      .filter((item) => item.status === 'done')
      .map((img) => ({
        uid: img.uid,
        name: img.name,
        url: img.url || img.response?.url,
        status : img.status
      }));
  };

  const createProduct = async (data: ModalProduct, images: UploadFile[]) => {
    const { name, description, start_price } = data;

    const response = await service.CreateProduct(eventId, {
      type: 'just-auction',
      name,
      description,
      images: FilterImage(images),
      start_price,
      price: start_price,
      state: 'waiting'
    });
    if (response) refresh();
  };

  const deleteProduct = async (id: string, images: UploadFile[]) => {
    if (!id) return;
    const response = await service.deleteProduct(eventId, id);
    if (response) {
      await service.deleteOffersByProduct(eventId,id)
      await deleteImages(images);
      refresh();
    }
  };

  const deleteImages = async (images: UploadFile[]) => {
    if (images.length > 0) {
      const promises = images.map((image) => deleteFireStorageData(image.url || image.response?.url));
      await Promise.all(promises);
    }
  };

  const updateProduct = async (data: ModalProduct, images: UploadFile[], state: ProductState, price?: number ) => {
    const { name, description, start_price } = data;
    const response = await service.updateProduct(eventId, {
      type: 'just-auction',
      name,
      description,
      images: FilterImage(images),
      _id: data._id ?? '',
      price: price ?? start_price,
      start_price,
      state
    });
    if (response) refresh();
  };
  const getProducts = async () => {
    setLoading(true);
    const data = await service.getProducts(eventId);
   if(data) setproducts(data.data || []);
    setLoading(false);
  };

  const refresh = async () => {
    await getProducts();
  };

  return {
    products,
    getProducts,
    refresh,
    createProduct,
    deleteProduct,
    updateProduct,
    loading,
    deleteImages,
  };
};

export default useProducts;
