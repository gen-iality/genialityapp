import { Anchor, Col, Row, Typography, Grid, List } from 'antd';
import React, { useEffect, useState } from 'react';
import { termsAnchor, termsContent, termsParagraph, termsTitle } from './constants';

const { useBreakpoint } = Grid;

const TermsAndConditions = () => {
	const [targetOffset, setTargetOffset] = useState<number | undefined>(undefined);

  useEffect(() => {
    setTargetOffset(window.innerHeight / 3);
  }, []);
	const screens = useBreakpoint();
	return (
		<Row gutter={[0, 16]} >
			<Col style={{ padding: screens.xs ? '30px' : '60px' }} xs={0} sm={0} md={6} lg={6} xl={6} xxl={6}>
				<Anchor targetOffset={targetOffset}>
					{termsAnchor.map((item) => (
						<Anchor.Link key={`anchor-${item.anchor}`} href={`#${item.anchor}`} title={item.title} />
					))}
				</Anchor>
			</Col>
			<Col style={{ padding: screens.xs ? '30px' : '60px 80px 60px 80px' }} xs={24} sm={24} md={18} lg={18} xl={18} xxl={18}>
				<Col span={24}>
					<Typography.Title>{termsTitle}</Typography.Title>
					<Typography.Paragraph>{termsParagraph}</Typography.Paragraph>
				</Col>
				<List
					split={false}
					dataSource={termsContent}
					renderItem={(item) => (
						<List.Item id={item.anchor}>
							<List.Item.Meta title={item.title} description={item.content} />
						</List.Item>
					)}
				/>
			</Col>
		</Row>
	);
};

export default TermsAndConditions;
