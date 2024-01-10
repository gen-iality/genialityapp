import { ArrowUpOutlined } from '@ant-design/icons';
import { Anchor, Avatar, BackTop, Col, Grid, List, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

import { ILegalTemplate } from './typings/interfaces';
import DateAndVersion from './DateAndVersion';
const { useBreakpoint } = Grid;
const LegalTemplate = (props: ILegalTemplate) => {
	const { breadCrumbles, termsAnchor, termsContent, termsParagraph, termsTitle, termsVersion, termsLastUpdate } = props;
	const [targetOffset, setTargetOffset] = useState<number | undefined>(undefined);
	const screens = useBreakpoint();

	useEffect(() => {
		setTargetOffset(window.innerHeight / 3);
	}, []);
	return (
		<Row className='legal-container' gutter={[0, 16]}>
			<Col xs={0} sm={0} md={6} lg={6} xl={6} xxl={6}>
				<Row style={{ padding: '60px 30px', height: '100%', backgroundColor: '#111827' }}>
					<Col span={24}>
						<Anchor offsetTop={60} targetOffset={targetOffset}>
							{termsAnchor.map((item) => (
								<Anchor.Link
									key={`anchor-${item.anchor}`}
									href={`#${item.anchor}`}
									title={
										<Typography.Text style={{ color: '#FFFFFF', whiteSpace: 'normal' }}>{item.title}</Typography.Text>
									}
								/>
							))}
						</Anchor>
					</Col>
				</Row>
			</Col>
			<Col xs={24} sm={24} md={18} lg={18} xl={18} xxl={18}>
				<Row gutter={[0, 16]} style={{ padding: screens.xs ? '30px' : '60px 80px 60px 80px' }}>
					<Col span={24}>{breadCrumbles && breadCrumbles}</Col>
					<Col span={24}>
						<Typography.Title style={{ color: '#111827' }}>{termsTitle}</Typography.Title>
						<Typography.Paragraph>{termsParagraph}</Typography.Paragraph>
					</Col>
					<Col span={24}>
						<List
							header={<DateAndVersion termsLastUpdate={termsLastUpdate} termsVersion={termsVersion} />}
							footer={<DateAndVersion termsLastUpdate={termsLastUpdate} termsVersion={termsVersion} />}
							split={false}
							dataSource={termsContent}
							renderItem={(item) => (
								<List.Item id={item.anchor}>
									<List.Item.Meta className='legal-content' title={item.title} description={item.content} />
								</List.Item>
							)}
						/>
					</Col>
				</Row>
			</Col>
			<BackTop>
				<Avatar
					shape='square'
					icon={
						<ArrowUpOutlined
							style={{
								filter: 'drop-shadow(0 4px 3px rgb(17 24 39 / 0.5)) drop-shadow(0 2px 2px rgb(17 24 39 / 0.5))',
							}}
							className='animate__animated animate__bounce animate__slower animate__infinite'
						/>
					}
					size={50}
					style={{
						color: '#FFFFFF',
						backgroundColor: '#111827',
						borderRadius: '8px',
						overflow: 'visible',
					}}></Avatar>
			</BackTop>
		</Row>
	);
};

export default LegalTemplate;
