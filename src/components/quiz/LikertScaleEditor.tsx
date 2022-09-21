import * as React from 'react';
import { useState, useEffect } from 'react';

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
};

function LikertScaleEditor(props: LikertScaleEditorProps) {
  const {
    source = {
      columns: [], // Empty list for default
      rows: [], // Empty list for default
      values: {}, // Empty list for default
    } // Default value, if it is undefined
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
    setModalType(null);
    setNextText('');
    setNextValue('');
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
      ...sourceData.columns,
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
      ...sourceData.rows,
      { text, value },
    ];
    setSourceData({
      ...sourceData,
      rows: newRows,
      values: { ...sourceData.values, [value]: null }, // Add a relation to null
    });
  };

  useEffect(() => {
    console.debug('LikertScaleEditor.source', source)
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
                danger
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
            danger
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
          isController: true,
        };
        return { [`row_${j}`]: cell };
      }).reduce((last, current) => ({...last, ...current}), []),
    });

    // Save all data
    setRows(newRows);
    setColumns(newColumns);
    console.log('LikertScaleEditor.all', newRows);
    console.log('LikertScaleEditor.all', newColumns);
  }, [sourceData]);

  return (
    <>
    <Table dataSource={rows} columns={columns} />
    <Modal
      visible={isOpenedModal}
      title={`Agrega elemento: ${modalType === 'column' ? 'categoría' : modalType === 'row' ? 'pregunta' : 'desconocido tipo'}`}
      okText='Add'
      onCancel={closeModal}
      onOk={addNewElement}
    >
      <Space direction='vertical'>
        {isAlertShown && <Alert message='Faltan datos' type='error'/>}
        <Input autoFocus required size='large' placeholder='Texto' value={nextText} onChange={(e) => setNextText(e.target.value)}/>
        <Input required size='large' placeholder='Valor' value={nextValue} onChange={(e) => setNextValue(e.target.value)}/>
      </Space>
    </Modal>
    </>
  );
}

export default LikertScaleEditor;