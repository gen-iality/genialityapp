import { FunctionComponent, ReactNode, useMemo } from 'react'
import { TruncatedAgenda } from '@Utilities/types/AgendaType'
import { Collapse } from 'antd'

interface IModuledActivityDisplayerProps {
  list: TruncatedAgenda[]
  render: (nameToFilter: string) => ReactNode
}

const ModuledActivityDisplayer: FunctionComponent<IModuledActivityDisplayerProps> = (
  props,
) => {
  const moduleNames = useMemo(() => {
    const uniqueNames = Array.from(
      new Set(props.list.map((item) => item.module_name)),
    ).filter((item) => item !== undefined) as string[]

    const sorttedNames = uniqueNames
      .map((name) => {
        const data = props.list.find((item) => item.module_name == name)
        if (!data) return { name, order: 0 }
        return {
          name,
          order: data.module_order,
        }
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((item) => item.name)
    return sorttedNames
  }, [props.list])

  return (
    <Collapse>
      {moduleNames.map((name: string, index: number) => (
        <Collapse.Panel
          header={`Módulo: ${name}`}
          key={index}
          extra={`${
            props.list.filter((item) => item.module_name === name).length
          } elemento(s)`}
        >
          {props.render(name)}
        </Collapse.Panel>
      ))}
    </Collapse>
  )
}
export default ModuledActivityDisplayer
