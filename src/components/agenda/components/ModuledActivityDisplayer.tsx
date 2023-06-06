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
  const { list: givenList, render } = props

  const activityList = useMemo(() => {
    if (!Array.isArray(givenList)) {
      console.warn('givenList is not an array')
      return []
    }
    return givenList
  }, [givenList])

  const moduleNames = useMemo(() => {
    const uniqueSet = new Set(activityList.map((item) => item.module_name))
    console.debug('uniqueSet:', uniqueSet, 'now as array:', Array.from(uniqueSet))
    const uniqueNames = Array.from(uniqueSet).filter(
      (item) => item !== undefined,
    ) as string[]
    console.debug('uniqueNames:', uniqueNames)

    const preSorttedNames = uniqueNames
      .map((name) => {
        const data = activityList.find((item) => item.module_name == name)
        if (!data) return { name, order: 0 }
        return {
          name,
          order: data.module_order,
        }
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0))
    console.debug('preSorttedNames:', preSorttedNames)
    const sorttedNames = preSorttedNames.map((item) => item.name)
    return sorttedNames
  }, [activityList])

  return (
    <Collapse>
      {moduleNames.map((name: string, index: number) => (
        <Collapse.Panel
          header={`Módulo: ${name}`}
          key={index}
          extra={`${
            activityList.filter((item) => item.module_name === name).length
          } elemento(s)`}
        >
          {render(name)}
        </Collapse.Panel>
      ))}
    </Collapse>
  )
}
export default ModuledActivityDisplayer
