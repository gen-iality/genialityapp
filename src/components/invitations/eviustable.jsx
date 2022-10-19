import { useTable } from 'react-table';

export default function EviusTable({ columns, data }) {
  // Use the useTable Hook to send the columns and data to build the table
  const {
    headerGroups, // headerGroups if your table have groupings
    rows, // rows for the table based on the data passed
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  return (
    <table>
      <thead className='ant-table-thead'>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th className='ant-table-header-column'>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className='ant-table-tbody'>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr className='ant-table-row nt-table-row-level-0'>
              {row.cells.map((cell) => {
                return <td>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
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
  
  )


*/
