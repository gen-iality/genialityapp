import { Button, Checkbox, Modal } from 'antd';
import { useState } from 'react';
import { ImportModalInterface } from '../interfaces/bingo';
import ImportValues from './importValues';
import { importValuesBingo } from '../services';
import { DispatchMessageService } from '@/context/MessageService';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { KEYSDATAIMPORT } from '../constants/constants';
const ImportModal = ({
  event,
  openAndCloseImportModal,
  setOpenAndCloseImportModal,
  extraFields,
  setFormData,
  formData,
  bingo,
}: ImportModalInterface) => {
  const [enableSaveButton, setEnableSaveButton] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [importData, setImportData] = useState<[]>([]);
  const [preserveInformation, setPreserveInformation] = useState(false)

  const handleXls = (importedData: []) => {
    // setLoading(true);
    setImportData(importedData);
  };

  const typeIsWrong = (dataBingoValuesExcel: any[]) => {
   const dataFound = dataBingoValuesExcel.filter(dataBingo => dataBingo.carton_value.type !== 'image' 
    &&  dataBingo.carton_value.type !== 'text'
    ||  dataBingo.ballot_value.type !== 'image'
    &&  dataBingo.ballot_value.type !== 'text'
    )
    if( dataFound.length > 0){
      return {
        success: false,
        data: dataFound,
      }
    } 
    return  {
      success: true,
      data: dataFound,
    }
  }
  const changeType = (type: string)  => {
   const typeInLowerCase = type?.toLocaleLowerCase()
   const types = {
      imagen: 'image',
      image: 'image',
      text: 'text',
      texto: 'text',
   }
   return types[typeInLowerCase as keyof typeof types] || typeInLowerCase
  }
  
  
  const savedataImport = async () => {
    setLoading(true);
    let tempArray = new Array();
    const headerTitle = Object.keys(importData[0  as keyof typeof importData] || {});
    const setCorrectHeader = (currentValue: string)=>KEYSDATAIMPORT.includes(currentValue)
    const isCorrectHeader = headerTitle.every(setCorrectHeader)
    if(isCorrectHeader === false) {
      DispatchMessageService({
        type: 'error',
        msj: 'Error al verificar la data, verifique la estructura con el template',
        action: 'show',
      });
      setLoading(false);
      return
    }
    importData.forEach((importItem) => {
      const keys = Object.keys(importItem);
      extraFields.map((extraField: any) => {
        if (extraField.name === keys[0]) {
          tempArray.push({
            carton_value: {
              type: changeType(importItem[keys[0]]),
              value: importItem[keys[1]],
            },
            ballot_value: {
              type: changeType(importItem[keys[2]]),
              value: importItem[keys[3]],
            },
          });
        }
      });
    });
    if (tempArray.length === 0) {
      DispatchMessageService({
        type: 'error',
        msj: 'No hay datos para importar',
        action: 'show',
      });
      setLoading(false);
      return;
    }
    const arraySend = tempArray.filter(item => item.carton_value.type !== '' && item.ballot_value.type !== '' )
    if (arraySend.length === 0) {
      DispatchMessageService({
        type: 'error',
        msj: 'No hay datos para importar o los tipos estan vacios',
        action: 'show',
      });
      setLoading(false);
      return;
    }
     const isWrong = typeIsWrong(arraySend)
      if(!isWrong.success)  {
        setLoading(false);
        DispatchMessageService({
          type: 'error',
          msj: 'Error al importar los datos verifique el tipo, la cantida de datos nulos es ' + isWrong.data.length,
          action: 'show',
        });
        return
      }
    const response = await importValuesBingo(event._id!, bingo._id, {
      replace_data: !preserveInformation,
      data: arraySend
    });
    if (!response) {
      setLoading(false);
      return;
    }
    // unir los dos arrays
   preserveInformation === true && setFormData({
      ...formData,
      bingo_values: [...formData.bingo_values, ...response.success],
    });

    preserveInformation === false &&  setFormData({
      ...formData,
      bingo_values: [...response.success],
    });

    DispatchMessageService({
      type: 'success',
      msj: 'Datos importados correctamente',
      action: 'show',
    });

    setLoading(false);

    setOpenAndCloseImportModal(false);
    setEnableSaveButton(true);
  };
  const onChangeCheckbox = (e:CheckboxChangeEvent) => {
    setPreserveInformation(e.target.checked)
  }

  return (
    <Modal
      title=''
      closable={loading ? false : true}
      maskClosable={false}
      destroyOnClose={true}
      visible={openAndCloseImportModal}
      onCancel={() => setOpenAndCloseImportModal(false)}
      footer={[
        <Checkbox
          checked={preserveInformation}
          value={preserveInformation}
          onChange={onChangeCheckbox}
        >Conservar la información</Checkbox>,
        <Button type='primary' onClick={savedataImport} loading={loading} disabled={enableSaveButton}>
          Guardar
        </Button>,
      ]}>
      <ImportValues
        key={1}
        templateName={'import_bingo_values'}
        handleXls={handleXls}
        extraFields={extraFields}
        event={event}
        setEnableSaveButton={(state) => setEnableSaveButton(state)}
        setImportData={setImportData}
        
      />
    </Modal>
  );
};

export default ImportModal;
