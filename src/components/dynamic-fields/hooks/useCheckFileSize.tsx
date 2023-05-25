import { StateMessage } from '@context/MessageService'
import { RcFile } from 'antd/lib/upload'
import { useCallback } from 'react'

export default function useCheckFileSize() {
  const handleBeforeUpload = useCallback((file: RcFile) => {
    const isLt5M = file.size / 1024 / 1024 < 5
    if (!isLt5M) {
      StateMessage.show(null, 'error', 'Image must smaller than 5MB!')
    }
    return isLt5M
  }, [])

  return handleBeforeUpload
}
