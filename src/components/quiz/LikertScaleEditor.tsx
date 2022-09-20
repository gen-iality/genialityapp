import { Table } from 'antd';
import * as React from 'react';
import { useState, useEffect } from 'react';

type SourceRow = { key?: string } & { [x: string]: string };
type Column = {
  title: string,
  dataIndex: keyof SourceRow,
  key?: string,
};

interface LikertScaleEditorProps {};

function LikertScaleEditor(props: LikertScaleEditorProps) {
  const [dataSource, setDataSource] = useState<SourceRow[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);

  return (
    <>
    <Table dataSource={dataSource} columns={columns} />
    </>
  );
}

export default LikertScaleEditor;