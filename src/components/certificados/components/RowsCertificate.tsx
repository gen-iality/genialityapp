import { useModalLogic } from '@/hooks/useModalLogic';
import RowConfiguration from './RowConfiguration';
import { Button, Space, Table, Tooltip } from 'antd';
import { CertifiRow } from '@/components/agenda/types';
import { DeleteOutlined, EditOutlined, PlusCircleFilled } from '@ant-design/icons';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { columnsRowList } from '../utils/rowColumns';
import { ITagRow } from '../types';

interface Props {
	handleDragEnd: (data: any) => void;
	certificateRows: CertifiRow[];
	handledDelete: (certificateRowId: string) => void;
	handledEdit: (certificatesRowId: string, newRowCertificate: Partial<CertifiRow>) => void;
	handledAdd: (newCertificateRowForm: Omit<CertifiRow, 'id'>) => void;
	allTags: ITagRow[];
}
const RowsCertificate = ({
	handleDragEnd,
	certificateRows,
	handledDelete,
	handledEdit,
	handledAdd,
	allTags,
}: Props) => {
	const {
		closeModal: onCloseConfigurationRow,
		handledSelectedItem: handledSelectedRow,
		isOpenModal: isOpenConfigurationRow,
		openModal: onOpenConfigurationRow,
		selectedItem: selectedRow,
	} = useModalLogic<CertifiRow>();

	const SortableBody: any = SortableContainer((props: any) => <tbody {...props} />);

	const SortableItem: any = SortableElement((props: any) => <tr {...props} />);
	/* const DragHandle = SortableHandle(() => (
    <DragIcon
      style={{
        cursor: 'move',
        fontSize: '22px',
      }}
    />
  )); */

	return (
		<>
			<Table
				title={() => (
					<Space style={{ display: 'flex', flexDirection: 'row-reverse' }}>
						<Button
							onClick={() => {
								onOpenConfigurationRow();
							}}
							icon={<PlusCircleFilled />}>
							Agregar
						</Button>
					</Space>
				)}
				tableLayout='auto'
				style={{ padding: '30px 0', cursor: 'pointer' }}
				dataSource={certificateRows}
				columns={[
					...columnsRowList,
					{
						title: 'Acciones',
						dataIndex: 'checked',
						width: 10,
						render: (text: string, item: CertifiRow, index: number) => (
							<Space>
								<Tooltip title='Editar'>
									<Button
										size='small'
										type='primary'
										onClick={() => {
											handledSelectedRow(item);
											onOpenConfigurationRow();
										}}
										icon={<EditOutlined />}
									/>
								</Tooltip>
								<Tooltip title='Eliminar'>
									<Button
										danger
										size='small'
										type='primary'
										onClick={() => handledDelete(item.id)}
										icon={<DeleteOutlined />}
									/>
								</Tooltip>
							</Space>
						),
					},
				]}
				pagination={false}
				bordered={false}
				size='small'
				components={{
					body: {
						wrapper: (props: any) => (
							<SortableBody {...props} useDragHandle helperClass='row-dragging' onSortEnd={handleDragEnd} />
						),
						row: (props: any) => <SortableItem index={props['data-row-key']} {...props} />,
					},
				}}
				//@ts-ignore
				onRow={(record: any, index: number | undefined) => ({
					index,
					'data-row-key': record.id,
				})}
				rowKey='key'
			/>
			{isOpenConfigurationRow && (
				<RowConfiguration
					onClose={onCloseConfigurationRow}
					visible={isOpenConfigurationRow}
					selectedRow={selectedRow}
					handledEdit={handledEdit}
					handledAdd={handledAdd}
					allTags={allTags}
				/>
			)}
		</>
	);
};

export default RowsCertificate;
