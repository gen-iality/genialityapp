import { DownloadOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import * as XLSX from 'xlsx/xlsx.mjs'
import { StateMessage } from '@context/MessageService'

export const ExportExcel = (props) => {
  const exportData = () => {
    if (props.list) {
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(props.list)
      XLSX.utils.book_append_sheet(wb, ws, 'Datos')
      XLSX.writeFile(wb, props.fileName + '.xlsx')
    } else {
      StateMessage.show(null, 'error', 'No hay datos que exportar')
    }
  }
  return (
    <div>
      <Button primary onClick={exportData}>
        <DownloadOutlined /> Exportar
      </Button>
    </div>
  )
}
