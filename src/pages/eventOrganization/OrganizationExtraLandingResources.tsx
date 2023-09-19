import { DeleteOutlined } from '@ant-design/icons'
import { Button, Divider, Form, Input, Modal, Select, Space } from 'antd'
import { FunctionComponent, useEffect, useState } from 'react'
import ReactPlayer from 'react-player'

export type ExtraLandingResourceType =
  | {
      type: 'video'
      url: string
      caption?: string
    }
  | {
      type: 'text'
      content: string
    }

interface IOrganizationExtraLandingResourcesProps {
  value?: any
  onChange?: (data: any) => void
}

const OrganizationExtraLandingResources: FunctionComponent<
  IOrganizationExtraLandingResourcesProps
> = (props) => {
  const { value = {}, onChange = () => {} } = props

  const [resources, setResources] = useState<ExtraLandingResourceType[]>(
    value?.resources ?? [],
  )

  /**
   * Add a new field as text field
   */
  const addField = () => {
    setResources([
      ...resources,
      {
        type: 'text',
        content: '',
      },
    ])
  }

  const deleteField = (index: number) => {
    setResources(resources.filter((data, _index) => _index !== index))
  }

  const changeResourceType = (type: ExtraLandingResourceType['type'], index: number) => {
    const copy = [...resources]
    switch (type) {
      case 'text':
        copy[index] = { type: 'text', content: '' }
        break
      case 'video':
        copy[index] = { type: 'video', url: '' }
        break
      default:
        Modal.error({
          title: 'Error de cambio de tipo',
          content: `El tipo de dato "${type}" no es reconocido`,
        })
        return
    }

    setResources(copy)
  }

  const renderByType = (resource: ExtraLandingResourceType, index: number) => {
    switch (resource.type) {
      case 'text':
        return (
          <Form.Item
            label="Texto"
            validateStatus={resource.content ? 'success' : 'error'}
            help={!resource.content ? 'Valor requerido' : undefined}
          >
            <Input
              value={resource.content}
              onChange={(event) => {
                const copy = [...resources]
                resource.content = event.target.value ?? ''
                copy[index] = resource
                setResources(copy)
              }}
            />
          </Form.Item>
        )
      case 'video':
        let isValidURL = false
        try {
          new URL(resource.url)
          isValidURL = true
        } catch (err) {
          console.error('given video URL is invalid:', err)
          isValidURL = false
        }
        return (
          <Space direction="vertical">
            <Form.Item
              label="URL del vídeo"
              validateStatus={isValidURL ? 'success' : 'error'}
              help={!isValidURL ? 'La URL no es válida' : undefined}
            >
              <Input
                value={resource.url}
                onChange={(event) => {
                  const copy = [...resources]
                  resource.url = event.target.value ?? ''
                  copy[index] = resource
                  setResources(copy)
                }}
                placeholder="https://...."
              />
            </Form.Item>
            <Form.Item label="Texto auxiliar">
              <Input
                value={resource.caption}
                onChange={(event) => {
                  const copy = [...resources]
                  resource.caption = event.target.value ?? ''
                  copy[index] = resource
                  setResources(copy)
                }}
                placeholder="(Opcional)"
              />
            </Form.Item>
          </Space>
        )
      default:
        return 'Contenido no reconocido'
    }
  }

  useEffect(() => {
    onChange({ resources })
  }, [resources])

  return (
    <Space direction="vertical">
      {resources.map((resource, index) => (
        <Space direction="vertical">
          <Space direction="horizontal">
            <Select
              options={[
                {
                  label: 'Texto',
                  value: 'text',
                },
                {
                  label: 'Vídeo',
                  value: 'video',
                },
              ]}
              value={resource.type}
              onChange={(value) => changeResourceType(value, index)}
            />
            {renderByType(resource, index)}
          </Space>
          <Button danger onClick={() => deleteField(index)} icon={<DeleteOutlined />}>
            Eliminar
          </Button>
          <Divider />
        </Space>
      ))}
      <Space direction="horizontal">
        <Button
          disabled={resources.length === 1}
          title="Habilitado en futuras actualizaciones"
          size="small"
          type="primary"
          onClick={addField}
        >
          Agregar campo
        </Button>
      </Space>
    </Space>
  )
}

export default OrganizationExtraLandingResources
