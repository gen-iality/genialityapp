/* eslint-disable no-console */
import { DispatchMessageService } from "@/context/MessageService";
import { CategoriesApi } from "@/helpers/request";
import { Modal } from "antd";

export const handleDeleteCategory = async (id_category) => {
    try {
      DispatchMessageService({
        type: 'loading',
        key: 'loading',
        msj: ' Por favor espere mientras se borra la información...',
        action: 'show',
      });
      const shouldDelete = await showDeleteConfirmation();
      if (shouldDelete) {
        // Llama a tu función `delete` para eliminar la categoría
        await CategoriesApi.delete(id_category);
      }
  
      DispatchMessageService({
        key: 'loading',
        action: 'destroy',
      });
      DispatchMessageService({
        type: 'success',
        msj: 'Se eliminó la información correctamente!',
        action: 'show',
      });
    } catch (e) {
      DispatchMessageService({
        key: 'loading',
        action: 'destroy',
      });
      DispatchMessageService({
        type: 'error',
        msj: 'Error eliminando el usuario',
        action: 'show',
      });
    }
  }
  const showDeleteConfirmation = () => {
    return new Promise((resolve) => {
      Modal.confirm({
        title: 'Eliminar categoría',
        content: '¿Estás seguro de que deseas eliminar esta categoría?',
        okText: 'Sí',
        okType: 'danger',
        cancelText: 'No',
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  };

  