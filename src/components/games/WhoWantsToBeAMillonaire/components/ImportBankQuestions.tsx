import React from 'react';
import { Button, Modal, Checkbox } from 'antd';
import ImportValues from '../../bingo/components/importValues';
import { useMillonaireCMS } from '../hooks/useMillonaireCMS';
import GenerateColumnsBankQuestion from '../functions/generateColumnsBankQuestion';
import { TEMPLATE_DATA } from '../constants/formData';
export default function ImportBankQuestions() {
  const {
    isVisibleModalImport,
    onActiveModalImport,
    loading,
    enableSaveButton,
    event,
    onHandleXlsx,
    setImportData,
    preserveInformation,
    setPreserveInformation,
    setEnableSaveButton,
    onSaveDataImport,
  } = useMillonaireCMS();

  return (
    <div>
      <Button onClick={() => onActiveModalImport()}>Importar valores</Button>
      <Modal
        title=''
        closable={loading ? false : true}
        maskClosable={false}
        destroyOnClose={true}
        visible={isVisibleModalImport}
        onCancel={() => onActiveModalImport()}
        footer={[
          <Checkbox
            checked={preserveInformation}
            value={preserveInformation}
            onChange={(e) => setPreserveInformation(e.target.checked)}>
            Conservar la información
          </Checkbox>,
          <Button onClick={() => onSaveDataImport()} loading={loading} disabled={enableSaveButton} type='primary'>
            Guardar
          </Button>,
        ]}>
        <ImportValues
          key={1}
          templateName='BANCO_DE_PREGUNTAS'
          handleXls={onHandleXlsx}
          extraFields={GenerateColumnsBankQuestion()}
          event={event?.value?._id}
          setEnableSaveButton={(state) => setEnableSaveButton(state)}
          setImportData={setImportData}
          templateDataDefault={TEMPLATE_DATA}
        />
      </Modal>
    </div>
  );
}
