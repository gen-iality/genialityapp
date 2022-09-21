import * as React from 'react';
import { useState, useEffect } from 'react';

import { Checkbox } from 'antd';
import { Table } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

/**
 * This constant is used to put the column content and other purposes
 */
const mainColumnName = 'Matter';

type RowType = { key?: string } & { [x: string]: string };
type ColumnType = {
  title: string,
  dataIndex: keyof RowType,
  key?: string,
};

interface DataSource {
  columns: {
    value: number, // Or "number | string" ??
    text: string,
  }[],
  rows: {
    value: number | string,
    text: string,
  }[],
};

interface LikertScaleEditorProps {
  source?: DataSource | null,
};

function LikertScaleEditor(props: LikertScaleEditorProps) {
  const {
    source = {
      columns: [], // Empty list for default
      rows: [], // Empty list for default
    } // Default value, if it is undefined
  } = props;
  const [rows, setRows] = useState<RowType[]>([]);
  const [columns, setColumns] = useState<ColumnType[]>([]);

  useEffect(() => {
    console.debug('LikertScaleEditor.source', source)
    if (!source) return;

    const newRows: RowType[] = [];
    const newColumns: ColumnType[] = [];

    source.columns.forEach((column, i) => {
      newRows.push({
        key: `key_${i}`,
        [mainColumnName.toLowerCase()]: column.text,
        ...source.rows.map((row, j) => {
          return { [`row_${j}`]: row.value.toString() };
        }).reduce((last, current) => ({...last, ...current})),
      });
    });

    // Add the header
    newColumns.push({
      key: `key_0`,
      dataIndex: mainColumnName.toLowerCase(),
      title: mainColumnName,
    });
    // Add other things
    source.rows.forEach((row, i) => {
      const columnName = row.text === mainColumnName ? row.text : `"${row.text}"`;
      newColumns.push({
        key: `key_${i+1}`,
        dataIndex: `row_${i}`,
        title: columnName,
      });
    });

    // Save all data
    setRows(newRows);
    setColumns(newColumns);
    console.log('LikertScaleEditor.all', newRows);
    console.log('LikertScaleEditor.all', newColumns);
  }, [source]);

  return (
    <>
    <Table dataSource={rows} columns={columns} />
    </>
  );
}

export default LikertScaleEditor;