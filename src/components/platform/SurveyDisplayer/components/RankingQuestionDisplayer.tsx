import { FunctionComponent, useEffect, useState } from 'react'
import { IQuestionDisplayer } from '../types'
import { Table } from 'antd'

import arrayMove from 'array-move'
import type { SortableContainerProps, SortEnd } from 'react-sortable-hoc'
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'
import { MenuOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/lib/table'

const arrayMoveImmutable = arrayMove

interface DataType {
  key: string
  text: string
  index: number
}

interface IRankingQuestionDisplayerProps extends IQuestionDisplayer {}
const DragHandle = SortableHandle(() => (
  <MenuOutlined value={'ss'} style={{ cursor: 'grab', color: '#999' }} title="s" />
))

const SortableItem = SortableElement(
  (props: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />,
)
const SortableBody = SortableContainer(
  (props: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />,
)

const columns: ColumnsType<DataType> = [
  {
    title: 'Orden',
    dataIndex: 'sort',
    width: 30,
    className: 'drag-visible',
    render: () => <DragHandle />,
  },
  {
    title: 'Categoría',
    dataIndex: 'text',
    className: 'drag-visible',
  },
]

const RankingQuestionDisplayer: FunctionComponent<IRankingQuestionDisplayerProps> = (
  props,
) => {
  const { onAnswer, question } = props
  const [dataSource, setDataSource] = useState<DataType[]>(
    (question.choices as string[]).map((choice, index) => ({
      key: index.toString(),
      text: choice,
      index,
    })),
  )
  const [isCorrect, setIsCorrect] = useState<boolean | undefined>()

  const onChange = (orderedAnswers: string[]) => {
    console.debug('ranking options:', orderedAnswers)
    let correctAnswers: string[] = []

    if (Array.isArray(question.correctAnswer) && question.correctAnswer.length > 0) {
      correctAnswers = question.correctAnswer
    } else if (
      Array.isArray(question.correctAnswerIndex) &&
      question.correctAnswerIndex.length > 0
    ) {
      correctAnswers = question.correctAnswerIndex.map(
        (index) => (question.choices as string[])[index],
      )
    } else {
      console.error(`the question ${question} has no correct value`)
    }

    // Eval if the answers is in the correct answers

    const normalizedCorrectAnswers = correctAnswers.map((value) =>
      value.toString().toLowerCase(),
    )
    const normalizeAnswers = orderedAnswers.map((value) => value.toString().toLowerCase())
    console.log({ normalizeAnswers, normalizedCorrectAnswers })

    const _isCorrect =
      normalizedCorrectAnswers.length === normalizeAnswers.length &&
      normalizeAnswers.every(
        (answer, index) => answer === normalizedCorrectAnswers[index],
      )

    setIsCorrect(_isCorrect)

    const points =
      typeof question.points === 'number'
        ? question.points
        : parseInt(question.points ?? '0', 10)

    if (typeof onAnswer === 'function') {
      onAnswer(orderedAnswers, _isCorrect, points)
    }
  }

  const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(dataSource.slice(), oldIndex, newIndex).filter(
        (el: DataType) => !!el,
      )
      console.log('Sorted items: ', newData)
      setDataSource(newData)
    }
  }

  useEffect(() => {
    console.log(dataSource)
    onChange(dataSource.map((row) => row.text))
  }, [dataSource])

  const DraggableContainer = (props: SortableContainerProps) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  )

  const DraggableBodyRow: React.FC<any> = ({ className, style, ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex((x) => x.index === restProps['data-row-key'])
    return <SortableItem index={index} {...restProps} />
  }

  return (
    <Table
      showHeader={false}
      pagination={false}
      dataSource={dataSource}
      columns={columns}
      rowKey="index"
      components={{
        body: {
          wrapper: DraggableContainer,
          row: DraggableBodyRow,
        },
      }}
    />
  )
}

export default RankingQuestionDisplayer
