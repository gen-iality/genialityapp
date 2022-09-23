import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';

import { Checkbox, Button, Space } from 'antd';
import { Table, Modal, Input, Alert } from 'antd';
import { ColumnsType } from 'antd/es/table';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

/**
 * This constant is used to put the column content and other purposes
 */
const mainColumnName = 'Matter';

type Cell = {
  row: string | number, // X
  column: string | number, // Y
  isController?: false,
} | {
  isController: true,
};

type RowType = {
  key?: string,
  [x: string]: any | Cell,
};

// type ColumnType = {
//   title: string | ((text: any) => any),
//   dataIndex: keyof RowType,
//   key?: string,
//   render?: (text: any) => any,
// };

type InputColumn = {
  value: number, // Or "number | string" ??
  text: string,
};

type InputRow = {
  value: number | string,
  text: string,
};

export interface DataSource {
  columns: InputColumn[],
  rows: InputRow[],
  values: {
    [key: string]: number | string | null,
  },
};

export interface LikertScaleEditorProps {
  source?: DataSource | null,
  onEdit?: (x: DataSource) => void,
};

function LikertScaleEditor(props: LikertScaleEditorProps) {
  const {
    source = {
      columns: [], // Empty list for default
      rows: [], // Empty list for default
      values: {}, // Empty list for default
    }, // Default value, if it is undefined
    onEdit = (x: DataSource) => {}, // By default
  } = props;

  const [sourceData, setSourceData] = useState(
    source === null ? {
      columns: [],
      rows: [],
      values: {},
    } : source,
  );
  const [rows, setRows] = useState<RowType[]>([]);
  const [columns, setColumns] = useState<ColumnsType<RowType>>([]);
  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const [modalType, setModalType] = useState<'row' | 'column' | null>(null);
  const [nextText, setNextText] = useState<string>('');
  const [nextValue, setNextValue] = useState<string>('');
  const [isAlertShown, setIsAlertShown] = useState(false);

  const openModal = () => {
    setIsOpenedModal(true)
    console.debug('LikertScaleEditor.modal', 'close');
  };

  const closeModal = () => {
    // Reset some states
    setModalType(null);
    setNextText('');
    setNextValue('');
    // Then, close the modal
    setIsOpenedModal(false);
    console.debug('LikertScaleEditor.modal', 'close');
  };

  const showModalForRow = () => {
    setModalType('row');
    openModal();
  };

  const showModalForColumn = () => {
    setModalType('column');
    openModal();
  };

  const addNewElement = () => {
    console.debug('LikertScaleEditor.add', 'Add new element');
    if (nextText.trim() && nextValue.trim()) {
      if (modalType === 'row') {
        addNewRow(nextText, nextValue);
      } else if (modalType === 'column') {
        addNewColumn(nextText, nextValue);
      }
      closeModal();
    } else {
      setIsAlertShown(true);
      setTimeout(() => setIsAlertShown(false), 5000);
    }
  };

  const addNewColumn = (text: string, value: string | number) => {
    console.debug('LikertScaleEditor.add', 'Add new column', text, value);
    const numberValue = parseInt(value as string);
    const newColumns: InputColumn[] = [
      ...sourceData.columns, // Last values, and new value:
      { text, value: numberValue },
    ];
    setSourceData({
      ...sourceData,
      columns: newColumns,
    });
  };
  const addNewRow = (text: string, value: string | number) => {
    console.debug('LikertScaleEditor.add', 'Add new row', text, value);
    const newRows: InputRow[] = [
      ...sourceData.rows, // Last values, and new value:
      { text, value },
    ];
    setSourceData({
      ...sourceData,
      rows: newRows,
      values: { ...sourceData.values, [value]: null }, // Add a relation to null
    });
  };

  useEffect(() => {
    console.debug('LikertScaleEditor.source', source);
    if (!sourceData) return;

    const newRows: RowType[] = [];
    const newColumns: ColumnsType<RowType> = [];

    sourceData.rows.forEach((row, i) => {
      newRows.push({
        key: `key_${i}`,
        [mainColumnName.toLowerCase()]: row.text,
        ...sourceData.columns.map((column, j) => {
          const cell: Cell = {
            row: row.value,
            column: column.value,
          };
          return { [`row_${j}`]: cell };
        }).reduce((last, current) => ({...last, ...current}), []),
      });
    });
    // [`row_${j}`]: `${column.value.toString()} - ${row.value.toString()} - ${source.values[row.value.toString()]}`,

    // Add the header
    newColumns.push({
      key: `key_0`,
      dataIndex: mainColumnName.toLowerCase(),
      title: mainColumnName,
      render: (value: string | Cell) => (
        <>
        {typeof value !== 'string' && value.isController ? (
          <Space align='center' size='large'>
            <Button title='Agregar pregunta' type='primary' onClick={showModalForRow}>
              <PlusOutlined />
            </Button>
          </Space>
        ) : (
          <em>{value}</em>
        )}
        </>
      ),
    });
    // Add other things
    sourceData.columns.forEach((column, i) => {
      const columnName = column.text === mainColumnName ? column.text : `"${column.text}"`;
      newColumns.push({
        key: `key_${i+1}`,
        dataIndex: `row_${i}`,
        title: columnName,
        render: (value: Cell, record, index) => {
          return (
            <>
            {value.isController ? (
              <Button
                danger // The button should be different
                title='Eliminar categoría'
                onClick={() => {
                  const newSourceData = { ...sourceData };
                  newSourceData.columns.splice(i, 1);
                  console.debug('LikertScaleEditor.delete', i, 'at columns', newSourceData);
                  setSourceData(newSourceData);
                }}
              >
                <DeleteOutlined />
              </Button>
            ) : (
              <Checkbox
                onChange={(e: CheckboxChangeEvent) => {
                  const { checked } = e.target;
                  console.debug('checked', checked);
                  const newSourceData = { ...sourceData };
                  if (checked) {
                    newSourceData.values[value.row] = value.column;
                  } else {
                    newSourceData.values[value.row] = null;
                  }
                  setSourceData(newSourceData);
                }}
                checked={sourceData.values[value.row] === value.column}
              >{/*value.row*/}</Checkbox>
            )}
            </>
          );
        }
      });
    });

    // Add this column for add controllers
    newColumns.push({
      key: `key_controller`,
      dataIndex: 'row_controller',
      title: (text) => (
        <Space align='center' size='large'>
          <Button title='Agregar categoría' type='primary' onClick={showModalForColumn}>
            <PlusOutlined />
          </Button>
        </Space>
      ),
      render: (text, record, index) => (
        <>
        {record.key !== 'key_row_controller' && (
          <Button
            danger // The button should be different
            title='Eliminar pregunta'
            onClick={() => {
              const newSourceData = { ...sourceData };
              const i = index;
              newSourceData.rows.splice(i, 1);
              console.debug('LikertScaleEditor.delete', i, 'at rows', newSourceData);
              setSourceData(newSourceData);
            }}
          >
            <DeleteOutlined />
          </Button>
        )}
        </>
      ),
    });

    // Add this row for controllers
    newRows.push({
      key: `key_row_controller`,
      [mainColumnName.toLowerCase()]: { isController: true },
      ...sourceData.columns.map((column, j) => {
        const cell: Cell = {
          isController: true, // In this case, this cell only is a controller
        };
        return { [`row_${j}`]: cell };
      }).reduce((last, current) => ({...last, ...current}), []),
    });

    // Save all data
    setRows(newRows);
    setColumns(newColumns);
    console.log('LikertScaleEditor.all', newRows);
    console.log('LikertScaleEditor.all', newColumns);

    const purgedSourceData = { ...sourceData };
    Object.keys(sourceData.values).forEach((key) => {
      // Check if this key (A.K.A row-value) exists in the rows list.
      if (sourceData.rows.some((row) => row.value === key)) {
        // Nothing to do, everything is ok
      } else {
        // Delete from `purgedSourceData.values`
        delete purgedSourceData.values[key];
      }

      // Check if its value (A.K.A column-value) exists in the columns list.
      const value = sourceData.values[key];
      if (sourceData.columns.some((column) => column.value === value)) {
        // Nothing to do, everything is ok
      } else {
        // Delete from `purgedSourceData.values`
        delete purgedSourceData.values[key];
      }
    });
  }, [sourceData]);

  useEffect(() => {
    onEdit(sourceData);
  }, [sourceData]);

  const title = useMemo(() => {
    switch(modalType) {
      case 'row':
        return 'Agrega elemento: pregunta';
      case 'column':
        return 'Agrega elemento: categoría';
      default:
        console.warn(`Tipo de modal ${modalType} es desconocido, no sabría qué hacer al agregar qué cosa en el LikertScalaEditor`);
        return 'Agrega elemento: desconocido tipo';
    }
  }, [modalType]);

  return (
    <>
    <Table dataSource={rows} columns={columns} />
    <Modal
      visible={isOpenedModal} // Enable open/close the modal before clicking the plus-buttons
      title={title}
      okText='Add' // Change for more understandable
      onCancel={closeModal} // Close and edit some states
      onOk={addNewElement} // Add the new element acccording to the selected modalType
    >
      <Space direction='vertical'>
        {isAlertShown && <Alert message='Faltan datos' type='error'/>}
        <Input
          autoFocus // The first field
          required // It is important that this field won't be empty
          size='large' // Size, but we NEED that this field has the 100% of width
          placeholder='Texto' // As we don't use label, so...
          value={nextText} // Current value
          onChange={(e) => setNextText(e.target.value)} // Update current value
        />
        <Input
          required // It is important that this field won't be empty
          size='large' // Size, but we NEED that this field has the 100% of width
          placeholder='Valor' // As we don't use label, so...
          value={nextValue} // Current value
          onChange={(e) => setNextValue(e.target.value)} // Update current value
        />
      </Space>
    </Modal>
    </>
  );
}

export default LikertScaleEditor;
