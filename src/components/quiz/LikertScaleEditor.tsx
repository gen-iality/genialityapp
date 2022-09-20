import { Table } from 'antd';
import * as React from 'react';
import { useState, useEffect } from 'react';

type SourceRow = { key?: string } & { [x: string]: string };
type Column = {
  title: string,
  dataIndex: keyof SourceRow,
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
  const [dataSource, setDataSource] = useState<SourceRow[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);

  useEffect(() => {
    console.debug('LikertScaleEditor.source', source)
    if (!source) return;

    const newDataSource: SourceRow[] = [];
    const newColumns: Column[] = [];

    // Add header
    newDataSource.push({
      key: 'key_column_0',
      // Now we concat from rows.
      // Here we create a key-value pair and return, but the result is an
      // array. So we have to use the reduce to concat those objects.
      ...source.rows.map((row, j) => {
        const item: { [x:string]: string } = {};
        item[`row_${j + 1}`] = row.text; // Check out our index starts at 1
        return item;
      }).reduce((last, current) => ({...last, ...current})),
    });

    // In this point we use the current dataSource to generate the columns list
    Object.values(newDataSource[0]).forEach((columnInfo) => {
      const columnName = columnInfo === 'key_column_0' ? 'matter' : columnInfo;
      newColumns.push({
        key: columnName,
        dataIndex: columnName,
        title: columnName === 'matter' ? columnName : `"${columnName}"`,
      });
    });

    // Now we will fill the dataSource
    source.columns // For each Column, we add data to dataSource
      .forEach((column, i) => {
        const newSourceRow: SourceRow = {
          key: `key_column_${i + 1}`,
          matter: column.text,
          // Now we concat from rows.
          // Here we create a key-value pair and return, but the result is an
          // array. So we have to use the reduce to concat those objects.
          ...source.rows.map((row, j) => {
            const item: { [x:string]: string } = {};
            item[`row_${j + 1}`] = row.text; // Check out our index starts at 1
            return item;
          }).reduce((last, current) => ({...last, ...current})),
        };

        console.debug('LikertScaleEditor:', newSourceRow);
      })
    
    // Save all data
    setDataSource(newDataSource);
    setColumns(newColumns);
  }, [source]);

  return (
    <>
    <Table dataSource={dataSource} columns={columns} />
    </>
  );
}

export default LikertScaleEditor;