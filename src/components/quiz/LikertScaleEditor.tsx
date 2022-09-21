import * as React from 'react';
import { useState, useEffect } from 'react';

import { Checkbox } from 'antd';
import { Table } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

/**
 * This constant is used to put the column content and other purposes
 */
const mainColumnName = 'Matter';

type Cell = {
  row: string | number, // X
  column: string | number, // Y
};

type RowType = {
  key?: string,
  [x: string]: any | Cell,
};

type ColumnType = {
  title: string,
  dataIndex: keyof RowType,
  key?: string,
  render?: (text: any) => any,
};

export interface DataSource {
  columns: {
    value: number, // Or "number | string" ??
    text: string,
  }[],
  rows: {
    value: number | string,
    text: string,
  }[],
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

  const [sourceData, setSourceData] = useState(source);
  const [rows, setRows] = useState<RowType[]>([]);
  const [columns, setColumns] = useState<ColumnType[]>([]);

  useEffect(() => {
    console.debug('LikertScaleEditor.source', source)
    if (!sourceData) return;

    const newRows: RowType[] = [];
    const newColumns: ColumnType[] = [];

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
        }).reduce((last, current) => ({...last, ...current})),
      });
    });
    // [`row_${j}`]: `${column.value.toString()} - ${row.value.toString()} - ${source.values[row.value.toString()]}`,

    // Add the header
    newColumns.push({
      key: `key_0`,
      dataIndex: mainColumnName.toLowerCase(),
      title: mainColumnName,
    });
    // Add other things
    sourceData.columns.forEach((column, i) => {
      const columnName = column.text === mainColumnName ? column.text : `"${column.text}"`;
      newColumns.push({
        key: `key_${i+1}`,
        dataIndex: `row_${i}`,
        title: columnName,
        render: (value: Cell) => {
          return (
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
            >{value.row}</Checkbox>
          );
        }
      });
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
    </>
  );
}

export default LikertScaleEditor;