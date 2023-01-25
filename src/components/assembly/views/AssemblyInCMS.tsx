import { Card, Col, Collapse, Row, Space, Typography } from 'antd';
import AccountEyeIcon from '@2fd/ant-design-icons/lib/AccountEye';
import React from 'react';
import AccountGroupIcon from '@2fd/ant-design-icons/lib/AccountGroup';

export default function AssemblyInCMS() {
	return (
		<div style={{ padding: '40px' }}>
			<Row gutter={[16, 16]}>
				<Col span={12}>
					<Card>Inscritos / Registrados</Card>
				</Col>
				<Col span={12}>
					<Card>Asistencia / Checkeados</Card>
				</Col>
				<Col span={24}>
					<Card>
						<Collapse>
							<Collapse.Panel
								key='1'
								header='Nombre actividad'
								showArrow={false}
								extra={
									<Space size={'large'} wrap>
										<Space>
											<AccountGroupIcon />
											<Typography.Text>5</Typography.Text>
										</Space>
                    <Space>
											<AccountEyeIcon />
											<Typography.Text>15</Typography.Text>
										</Space>
                    <Space>
											Quorum
											<Typography.Text>45%</Typography.Text>
										</Space>
									</Space>
								}></Collapse.Panel>
						</Collapse>
					</Card>
				</Col>
			</Row>
		</div>
	);
}
