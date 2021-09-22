import { Table as TableAnt } from 'antd';

const Table = ( props ) => {
  const { header, list, key, loading, pagination } = props;
  return (
    <TableAnt 
      columns={header}
      dataSource={list}
      hasData={list.length}
      rowKey={key}
      loading={loading}
      pagination={pagination}
    />
  )
}

export default Table;