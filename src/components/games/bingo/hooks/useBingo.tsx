import { useState, useEffect, useContext } from 'react';
import { Bingo, DimensionInterface } from '@/components/games/bingo/interfaces/bingo';
import {
  CreateBingo,
  DeleteBingo,
  GetBingo,
  listenBingoData,
  listenBingoNotifications,
  UpdateBingo,
  deleteValueBingo,
  importValuesBingo,
  updateValueBingo,
  createValueBingo,
  UpdateBingoDimension,
} from '@/components/games/bingo/services';
import { CurrentEventContext } from '@/context/eventContext';
import { DispatchMessageService } from '@/context/MessageService';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { handleRequestError } from '@/helpers/utils';
import { Modal } from 'antd';
import { FormDataBingoInterface } from '@/components/games/bingo/interfaces/bingo';
import { background_color, background_image, banner, footer } from '../constants/constants';
const { confirm } = Modal;
export const useBingo = () => {
  const [bingo, setBingo] = useState<Bingo | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const eventContext = useContext(CurrentEventContext);
  const [isVisibleModalTable, setIsVisibleModalTable] = useState<boolean>(false);
  const [canEditBallotValue, setCanEditBallotValue] = useState<{ isEdit: boolean; id: string | null }>({
    isEdit: false,
    id: null,
  });
  const [dataNotifications, setDataNotifications] = useState<any[]>([]);
  const [dataFirebaseBingo, setDataFirebaseBingo] = useState({
    bingoData: [],
    currentValue: { value: '', type: '' },
    _id: '',
    demonstratedBallots: [],
    startGame: false,
  });

  const initialFormDataBingo = {
    name: '',
    amount_of_bingo: 0,
    regulation: '',
    bingo_appearance: {
      background_color: background_color,
      background_image: background_image,
      banner: banner,
      footer: footer,
      dial_image: '',
    },
    bingo_values: [],
    dimensions: {
      format: '3x3',
      amount: 9,
      minimun_values: 18,
    },
  };

  const [formDataBingo, setFormDataBingo] = useState<FormDataBingoInterface>({
    name: '',
    amount_of_bingo: 0,
    regulation: '',
    bingo_appearance: {
      background_color: background_color,
      background_image: background_image,
      banner: banner,
      footer: footer,
      dial_image: '',
    },
    bingo_values: [],
    dimensions: {
      format: '3x3',
      amount: 9,
      minimun_values: 18,
    },
  });
  const [valuesData, setValuesData] = useState({
    carton_value: {
      type: '',
      value: '',
    },
    ballot_value: {
      type: '',
      value: '',
    },
    id: '',
  });
  const { value } = eventContext;
  useEffect(() => {
    const getBingo = async () => {
      setLoading(true);
      const bingo = await GetBingo(value._id);
      if (bingo) {
        setBingo(bingo);
        setFormDataBingo((prev) => ({
          ...prev,
          name: bingo.name,
          amount_of_bingo: bingo.amount_of_bingo,
          regulation: bingo.regulation,
          bingo_appearance: bingo.bingo_appearance,
          bingo_values: bingo.bingo_values || [],
          dimensions: bingo.dimensions,
        }));
      }

      setLoading(false);
    };
    getBingo();
    return () => {
      setBingo(undefined);
      setFormDataBingo((prev) => ({
        ...prev,
        name: '',
        amount_of_bingo: 0,
        regulation: '',
        bingo_appearance: {
          background_color: background_color,
          background_image: background_image,
          banner: banner,
          footer: footer,
          dial_image: '',
        },
        bingo_values: [],
      }));
    };
  }, []);

  function getBingoListenerNotifications() {
    const unSuscribe = listenBingoNotifications(value._id, setDataNotifications);
    return unSuscribe;
  }

  const deleteEmptyData = (data: any) => {
    const newData: any = {};
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined) {
        newData[key] = data[key];
      }
    });
    return newData;
  };

  const onSubmit = async (values: any) => {
    setLoading(true);
    if (bingo) {
      const data = {
        ...deleteEmptyData(formDataBingo),
      };

      const response = await UpdateBingo(value._id, data, bingo._id);
      if (response) {
        setBingo(response);
        setFormDataBingo((prev) => ({
          ...prev,
          name: response.name,
          amount_of_bingo: response.amount_of_bingo,
          regulation: response.regulation,
          bingo_appearance: response.bingo_appearance,
          bingo_values: response.bingo_values || [],
          dimensions: response.dimensions,
        }));
      }
    } else {
      const createBingoBody = {
        ...formDataBingo,
        name: values.name,
      };
      const response = await CreateBingo(value._id, createBingoBody);
      if (response) {
        setBingo(response);
        setFormDataBingo((prev) => ({
          ...prev,
          name: response.name,
          amount_of_bingo: response.amount_of_bingo,
          regulation: response.regulation,
          bingo_appearance: response.bingo_appearance,
          bingo_values: response.bingo_values || [],
        }));
      }
    }

    setLoading(false);
  };

  const changeBingoDimensions = async (dimensions: {
    format: '3x3' | '4x4' | '5x5';
    amount: number;
    minimun_values: number;
  }) => {
    setLoading(true);
    const payload: FormDataBingoInterface = {
      ...formDataBingo,
      // bingo_values: formDataBingo.bingo_values.slice(0, dimensions.amount),
      dimensions,
    };
    if (bingo) {
      const response = await UpdateBingoDimension(value._id, payload, bingo._id);
      if (response) {
        setBingo(response);
        setFormDataBingo({
          name: response.name,
          amount_of_bingo: response.amount_of_bingo,
          regulation: response.regulation,
          bingo_appearance: response.bingo_appearance,
          bingo_values: response.bingo_values || [],
          dimensions: response.dimensions,
        });
      }
    }
    setLoading(false);
  };

  const changeBingoDimensionsNew = async (dimensions: DimensionInterface) => {
    setFormDataBingo((prevState) => ({
      ...prevState,
      dimensions,
    }));
  };
  const deleteBingo = async () => {
    setLoading(true);
    if (bingo) {
      DispatchMessageService({
        type: 'loading',
        key: 'loading',
        msj: 'Por favor espere mientras se borra la información...',
        action: 'show',
      });
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
              await DeleteBingo(value._id, bingo._id);
              setBingo(undefined);

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
                msj: handleRequestError(e).message,
                action: 'show',
              });
            }
          };

          onHandlerRemove();
        },
      });
    }
    console.log('bingo', bingo);
    setLoading(false);
  };

  const deleteBallotValue = (id: string) => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere mientras se borra la información...',
      action: 'show',
    });
    confirm({
      title: `¿Está seguro de eliminar la información?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Una vez eliminado, no lo podrá recuperar',
      okText: 'Borrar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        const onHandlerRemove = async () => {
          const response = await deleteValueBingo(value._id, bingo!._id, id);
          if (!response) {
            setLoading(false);
            return;
          }
          const newBingoValues = [...formDataBingo.bingo_values];
          const index = newBingoValues.findIndex((value: any) => value.id === id);
          newBingoValues.splice(index, 1);
          setFormDataBingo({
            ...formDataBingo,
            bingo_values: newBingoValues,
          });
          DispatchMessageService({
            key: 'loading',
            action: 'destroy',
          });
          DispatchMessageService({
            type: 'success',
            msj: 'Se eliminó la información correctamente!',
            action: 'show',
          });
        };
        onHandlerRemove();
      },
    });
  };

  const thereIsBingo = (message: string) => {
    if (!bingo) setLoading(false);
    DispatchMessageService({
      type: 'error',
      msj: message,
      action: 'show',
    });
    return;
  };

  const actionEditBallotValue = (id: string) => {
    const newBingoValues = [...formDataBingo.bingo_values];
    const index = newBingoValues.findIndex((value: any) => value.id === id);
    setIsVisibleModalTable(!isVisibleModalTable);
    setValuesData({
      carton_value: newBingoValues[index].carton_value,
      ballot_value: newBingoValues[index].ballot_value,
      id: newBingoValues[index].id,
    });
    setCanEditBallotValue({
      isEdit: true,
      id,
    });
  };
  const editBallotValue = (
    id: string,
    values: {
      id: string;
      carton_value: {
        type: string;
        value: string;
      };
      ballot_value: {
        type: string;
        value: string;
      };
    }
  ) => {
    setLoading(true);

    const response = updateValueBingo(value._id, bingo!._id, values.id, values);
    if (!response) {
      setLoading(false);
      return;
    }
    const newBingoValues = [...formDataBingo.bingo_values];
    const index = newBingoValues.findIndex((value: any) => value.id === id);
    newBingoValues[index] = {
      ...newBingoValues[index],
      carton_value: values.carton_value,
      ballot_value: values.ballot_value,
      id: values.id,
    };
    setFormDataBingo({
      ...formDataBingo,
      bingo_values: newBingoValues,
    });
    setCanEditBallotValue({
      isEdit: false,
      id: null,
    });
    setValuesData({
      carton_value: {
        type: '',
        value: '',
      },
      ballot_value: {
        type: '',
        value: '',
      },
      id: '',
    });
    DispatchMessageService({
      key: 'loading',
      action: 'destroy',
    });
    DispatchMessageService({
      type: 'success',
      msj: 'Se editó la información correctamente!',
      action: 'show',
    });
    setLoading(false);
  };
  const onCancelValueTable = () => {
    setIsVisibleModalTable(!isVisibleModalTable);
    setValuesData({
      carton_value: {
        type: '',
        value: '',
      },
      ballot_value: {
        type: '',
        value: '',
      },
      id: '',
    });
    setCanEditBallotValue({
      isEdit: false,
      id: null,
    });
  };
  function getBingoListener() {
    const unSuscribe = listenBingoData(value._id, setDataFirebaseBingo);
    return unSuscribe;
  }

  const saveValueData = () => {
    setLoading(true);

    const response = createValueBingo(value._id, bingo!._id, valuesData);
    if (!response) {
      setLoading(false);
      return;
    }
    setFormDataBingo({
      ...formDataBingo,
      bingo_values: [...formDataBingo.bingo_values, { ...valuesData, id: value._id }],
    });
    setValuesData({
      carton_value: {
        type: '',
        value: '',
      },
      ballot_value: {
        type: '',
        value: '',
      },
      id: '',
    });
    DispatchMessageService({
      key: 'loading',
      action: 'destroy',
    });
    DispatchMessageService({
      type: 'success',
      msj: 'Se editó la información correctamente!',
      action: 'show',
    });
    setLoading(false);
  };

  return {
    bingo,
    isLoading: loading,
    onSubmit,
    changeBingoDimensions,
    deleteBingo,
    formDataBingo,
    setFormDataBingo,
    valuesData,
    setValuesData,
    deleteBallotValue,
    actionEditBallotValue,
    editBallotValue,
    setIsVisibleModalTable,
    isVisibleModalTable: isVisibleModalTable,
    canEditBallotValue,
    setCanEditBallotValue,
    onCancelValueTable,
    getBingoListenerNotifications,
    dataNotifications,
    getBingoListener,
    dataFirebaseBingo,
    saveValueData,
    changeBingoDimensionsNew,
  };
};
