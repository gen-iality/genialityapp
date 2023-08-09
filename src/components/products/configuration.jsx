import { useState, useEffect } from 'react'
import { Col, Row, Spin, Switch } from 'antd'
import { useNavigate } from 'react-router'
import ReactQuill from 'react-quill'
import { toolbarEditor } from '@helpers/constants'

import Header from '@antdComponents/Header'
import { StateMessage } from '@context/MessageService'
import { FB } from '@helpers/firestore-request'

const Configuration = (props) => {
  const [checkSubasta, setCheckSubasta] = useState(false)
  const [messageF, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    if (props.eventId) {
      obtenerConfig()
    }
    async function obtenerConfig() {
      const resp = await FB.Configs.get(props.eventId)
      if (resp) {
        const data = resp
        setCheckSubasta(data.data.habilitar_subasta)
        setMessage(data.data.message)
      }
      setLoadingData(false)
    }
  }, [])

  const goBack = () => navigate(-1)
  function onChange(checked) {
    setCheckSubasta(checked)
  }
  const changeMessage = (e) => {
    setMessage(e)
  }

  const saveConfiguration = async () => {
    StateMessage.show(
      'loading',
      'loading',
      ' Por favor espere mientras se guarda la configuración...',
    )
    setIsLoading(true)
    const data = {
      habilitar_subasta: checkSubasta,
      message: messageF,
    }

    try {
      await FB.Configs.edit(props.eventId, { data })
      StateMessage.destroy('loading')
      StateMessage.show(null, 'success', 'Configuración guardada correctamente!')
    } catch (e) {
      StateMessage.destroy('loading')
      StateMessage.show(null, 'error', 'Ha ocurrido un error')
    }
    setIsLoading(false)
  }

  return !loadingData ? (
    <>
      <Header title="Configuración" back save saveMethod={saveConfiguration} />
      <Row justify="center" wrap gutter={12}>
        <Col span={16}>
          <p>Habilitar puja</p>
          <Switch checked={checkSubasta} onChange={onChange} />
          <br /> <br />
          <p>Mensaje a mostrar al deshabilitar</p>
          <ReactQuill
            id="messageF"
            value={messageF}
            modules={toolbarEditor}
            onChange={changeMessage}
          />
        </Col>
      </Row>
    </>
  ) : (
    <div style={{ textAlign: 'center' }}>
      <Spin />
    </div>
  )
}

export default Configuration
