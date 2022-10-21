import { useTable, usePagination, useRowSelect } from 'react-table';

/**
 * 
 * @param {
 * columns={this.state.columns}
 manual
 data={[]}
 loading={loading}
 onFetchData={this.fetchData}
 showPaginationTop={true}
 showPaginationBottom={false}
 pages={pages}
 defaultPageSize={pageSize}
 className="-highlight"} props 
 */
export default function EviusTable(props) {
  const { columns, data, onRowClick } = props;
  // Use the useTable Hook to send the columns and data to build the table

  const keyHooks = (hooks) => {
    hooks.getRowProps.push((props) => {
      return {
        key: `${props.index}_${Math.random()}`,
        nuevo: 'nuevo',
        nuevo2: 'nuevo2',
        onClick: (a) => {},
        ...props,
      };
    });
  };

  const {
    headerGroups, // headerGroups if your table have groupings
    rows, // rows for the table based on the data passed
    prepareRow,
    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
    },
    usePagination,
    useRowSelect,
    keyHooks
  );

  return (
    <>
      <table>
        <thead className='ant-table-thead'>
          {headerGroups.map((headerGroup, index) => (
            <tr key={index} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, key) => (
                <th key={key} className='ant-table-header-column'>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className='ant-table-tbody'>
          {rows.map((row, keyrow) => {
            prepareRow(row);

            return (
              <tr
                {...row.getRowProps()}
                onClick={(e) => {
                  onRowClick && onRowClick(row);
                }}
                key={keyrow}
                className='ant-table-row nt-table-row-level-0'>
                {row.cells.map((cell, keycell) => {
                  return <td key={keycell}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className='pagination'>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type='number'
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}>
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

/*  Inicio de metodo para cargar millones de datos trabajo en proceso

  const RenderRow = useCallback(
    ({ index, style }) => {
      const row = rows[index]
      prepareRow(row)
      return (
        <div
          {...row.getRowProps({
            style,
          })}
          className="tr"
        >
          {row.cells.map(cell => {
            return (
              <div {...cell.getCellProps()} className="td">
                {cell.render('Cell')}
              </div>
            )
          })}
        </div>
      )
    },
    [prepareRow, rows]
  )


  return (
<div>
    <div {...getTableProps()} className="table">
    <div>
      {headerGroups.map(headerGroup => (
        <div {...headerGroup.getHeaderGroupProps()} className="tr">
          {headerGroup.headers.map(column => (
            <div {...column.getHeaderProps()} className="th">
              {column.render('Header')}
            </div>
          ))}
        </div>
      ))}
    </div>

    <div {...getTableBodyProps()}>
      <FixedSizeList
        height={400}
        itemCount={rows.length}
        itemSize={50}
        width={totalColumnsWidth*2}
      >
        {RenderRow}
      </FixedSizeList>
    </div>
  </div>

  </div>
  </>
  )


*/
